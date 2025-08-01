<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \Midtrans\Snap;
use \Midtrans\Notification;
use \Midtrans\Config;
use App\Models\Payment;
use App\Models\Discount;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }
    /**
     * Process the payment for the order.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processPayment(Request $request)
    {
        // Validate the order ID & discount_id
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'discount_id' => 'nullable|integer|exists:discounts,id',
        ]);
        $grossAmount = 0;
        $order = Order::findOrFail($request->order_id)->load(['products', 'user', 'shipping']);
        if ($order->payment) {
            return redirect(route('checkout', ['order_id' => $request->order_id, 'step' => 3, 'snap_token' => $order->payment->snap_token]))
                ->with('error', 'Payment already processed for this order.');
        }
        // Check if the order exists
        if (!$order) {
            return redirect()->back()->withErrors(['error' => 'Order not found.']);
        }
        // Calculate the total amount for the order
        foreach ($order->products as $item) {
            $grossAmount += $item->price * $item->pivot->quantity;
        }
        // Check if the order is already paid
        if ($order->payment && $order->payment->status === 'paid') {
            return redirect()->back()->withErrors(['error' => 'This order has already been paid.']);
        }
        $grossAmount += $order->shipping->shipping_cost; // Add shipping cost to the total amount
        $discount = Discount::find($request->discount_id);
        if ($discount) {
            $discountAmount = $discount->type === 'percentage'
                ? ($grossAmount * $discount->value / 100)
                : $discount->value; // Calculate discount amount based on type
            $discountAmount = min($discountAmount, $grossAmount); // Ensure discount does not exceed total amount
            $grossAmount -= $discountAmount; // Subtract discount from the total amount
            $order->discount_id = $discount->id; // Associate discount with the order
            $order->save();
        } else {
            $discountAmount = 0; // No discount applied
        }
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access to this order.']);
        }

        $params = [
            'transaction_details' => [
                'order_id' => $order->id . '-' . time(), // Unique order ID
                'gross_amount' => $grossAmount, // Total amount to be paid
            ],
            'customer_details' => [
                'first_name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
            'item_details' => $order->products->map(function ($item) {
                return [
                    'id' => $item->id,
                    'price' => $item->price,
                    'quantity' => $item->pivot->quantity,
                    'name' => $item->name,
                ];
            })->toArray(),
            'enabled_payments' => ['gopay', 'bank_transfer', 'credit_card', 'shopeepay'],
            // 'expiry' => [
            //     'start_time' => now()->addHour(1)->toDateTimeLocalString('yyyy-MM-dd hh:mm:ss Z'),
            //     'unit' => 'minute',
            //     'duration' => 1,
            // ],
        ];
        $snapToken = Snap::getSnapToken($params);
        // save payment details to the database
        if ($order->payment) {
            $order->payment->update([
                'snap_token' => $snapToken,
                'amount' => $grossAmount,
            ]);
        } else {
            $order->payment()->create([
                'payment_method' => 'midtrans',
                'amount' => $grossAmount,
                'currency' => 'IDR',
                'status' => 'pending',
                'transaction_id' => null, // This will be filled after payment is completed
                'paid_at' => null,
                'snap_token' => $snapToken, // Store the Snap token
            ]);
        }
        return redirect()->route('checkout', ['order_id' => $order->id, 'snap_token' => $snapToken, 'step' => 3])
            ->with('success', 'Payment initiated successfully. Please complete the payment.');
    }

    public function verifyPayment(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        // Check if the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access to this order.']);
        }
        // Verify the payment status
        $payment = Payment::where('order_id', $order->id)->first();
        if (!$payment) {
            return redirect()->back()->withErrors(['error' => 'Payment not found for this order.']);
        }
        // Update payment status based on Midtrans response
        if ($request->status === 'success') {
            $payment->status = 'paid';
            $payment->transaction_id = $request->transaction_id;
            $payment->paid_at = now();
            $payment->save();
            return redirect()->route('orders.show', $order->id)->with('success', 'Payment successful!');
        } else {
            $payment->status = 'failed';
            $payment->save();
            return redirect()->route('orders.show', $order->id)->withErrors(['error' => 'Payment failed.']);
        }
    }
    /**
     * Handle the notification from Midtrans.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function handleNotification(Request $request)
    {
        $notification = new Notification();
        $orderId = $notification->order_id;
        $order = Order::where('id', $orderId)->first();
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $payment = Payment::where('order_id', $orderId)->first();
        if (!$payment) {
            return response()->json(['error' => 'Payment not found for this order'], 404);
        }
        // Update payment status based on Midtrans notification
        switch ($notification->transaction_status) {
            case 'capture':
                if ($notification->payment_type === 'credit_card' && $notification->fraud_status === 'challenge') {
                    // Handle challenge payment
                    $payment->status = 'pending';
                } else {
                    // Handle successful payment
                    $payment->status = 'paid';
                    $payment->transaction_id = $notification->transaction_id;
                    $payment->paid_at = now();
                }
                break;
            case 'settlement':
                // Handle settlement payment
                $payment->status = 'paid';
                $payment->transaction_id = $notification->transaction_id;
                $payment->paid_at = now();
                break;
            case 'pending':
                // Handle pending payment
                $payment->status = 'pending';
                break;
            case 'deny':
                // Handle denied payment
                $payment->status = 'failed';
                break;
            case 'expire':
                // Handle expired payment
                $payment->status = 'expired';
                break;
            case 'cancel':
                // Handle canceled payment
                $payment->status = 'canceled';
                break;
            default:
                return response()->json(['error' => 'Unknown transaction status'], 400);
        }
        $payment->save();
        return response()->json(['success' => 'Payment status updated successfully'], 200);
    }
}
