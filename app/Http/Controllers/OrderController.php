<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OrdersExport;
use App\Models\Discount;
use Inertia\Inertia;

class OrderController extends Controller
{
    public static function pendingOrders()
    {
        $pendingOrders = Order::where('status', 'pending')->get();
        return count($pendingOrders);
    }
    public function index()
    {
        // mengambil data dari table orders
        $orders = Order::with(['products', 'user', 'shipping', 'payment'])->orderBy('updated_at', 'desc')->paginate(10);
        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }
    public function userShow()
    {
        // mengambil data dari table orders
        $orders = Order::with(['products', 'user', 'shipping', 'payment'])
            ->where('user_id', Auth::user()->id)->orderBy('updated_at', 'desc')->paginate(10);
        $pendingOrders = DB::table('orders')->where('status', 'pending')->get();
        return Inertia::render('user/orders/index', [
            'orders' => $orders,
            'pendingOrders' => $pendingOrders
        ]);
    }

    public function show($id)
    {
        // mengambil data dari table orders
        $order = Order::with(['products', 'user', 'shipping', 'payment'])->findOrFail($id);
        if ($order->user_id !== Auth::user()->id) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access to this order.']);
        }
        return Inertia::render('user/orders/show', [
            'order' => $order,
        ]);
    }

    public function adminShow($id)
    {
        // mengambil data dari table orders
        $order = Order::with(['products', 'user', 'shipping', 'payment', 'discount'])->findOrFail($id);
        $payment = $order->payment;
        $shipping = $order->shipping;
        if (!$order) {
            return redirect()->back()->withErrors(['error' => 'Order not found.']);
        }
        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'payment' => $payment,
            'shipping' => $shipping,
        ]);
    }


    public function changeStatus(string $id, string $status)
    {
        DB::table('orders')->where('id', $id)->update([
            'status' => $status,
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        return redirect('/admin/orders');
    }

    // public function exports()
    // {
    //     var_dump(request()->all());
    //     $dateRange = request('dateRange');
    //     if (!$dateRange) {
    //         return redirect()->back()->withErrors(['error' => 'Date range is required']);
    //     }
    //     $startDate = null;
    //     $endDate = null;
    //     switch ($dateRange) {
    //         case 'today':
    //             $startDate = Carbon::now()->startOfDay();
    //             $endDate = Carbon::now()->endOfDay();
    //             break;
    //         case 'this_week':
    //             $startDate = Carbon::now()->startOfWeek();
    //             $endDate = Carbon::now()->endOfWeek();
    //             break;
    //         case 'this_month':
    //             $startDate = Carbon::now()->startOfMonth();
    //             $endDate = Carbon::now()->endOfMonth();
    //             break;
    //         default:
    //             return redirect()->back()->withErrors(['error' => 'Invalid date range']);
    //     }
    //     return Excel::download(new OrdersExport($startDate, $endDate), 'orders.xlsx');
    // }
    public function checkout(Request $request)
    {
        if ($request->isMethod('get')) {
            $orderId = $request->query('order_id');
            $snapToken = $request->query('snap_token');
            if (!$orderId) {
                return redirect()->back()->with('error', 'Order ID is required.');
            }
            $order = Order::with(['products', 'shipping', 'payment'])->findOrFail($orderId);
            if ($order->user_id !== Auth::id()) {
                return redirect()->back()->with('error', 'Unauthorized access to this order.');
            }
            $discounts = Discount::where('status', 'active')->get();
            // Render the checkout page
            return Inertia::render('checkout/index', [
                'order' => $order,
                'cartItems' => $order->products,
                'discounts' => $discounts, // Assuming you have a way to fetch discounts
                'snap_token' => $snapToken, // Pass the Snap token to the view
                'csrf' => csrf_token(),
            ]);
        }
        $cartItems = Cart::with(['product', 'product.category'])
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }
        // Create a new order
        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            }),
            'status' => 'pending',
        ]);
        foreach ($cartItems as $item) {
            $order->products()->attach($order->id, [
                'review_id' => null, // Assuming no review is attached at checkout
                'product_id' => $item->product->id, // Assuming you want to keep track of the cart item
                'quantity' => $item->quantity,
                'size' => $item->size ?? '', // Assuming size is a field in the cart item
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            ]);
        }
        // Clear the cart after checkout
        Cart::where('user_id', Auth::id())->delete();
        return redirect()->route('checkout', ['order_id' => $order->id])->with('success', 'Order created successfully. Please complete your payment.');
    }
}
