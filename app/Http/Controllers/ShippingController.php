<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Order;
use App\Models\Shipping;
use Illuminate\Support\Facades\Auth;

class ShippingController extends Controller
{
    /**
     * Get the destination for shipping.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDestination(Request $request)
    {
        $query = $request->input('query');
        if (!$query) {
            return response()->json(['error' => 'Query parameter is required'], 400);
        }
        $url = 'https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=' . urlencode($query);
        $response =  Http::withHeaders([
            'key' => config('rajaongkir_api.key'),
            'Content-Type' => 'application/json',
        ])->get($url);
        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to fetch data from RajaOngkir'], $response->status());
        }
        $data = $response->json();
        if (isset($data['data'])) {
            return response()->json($data['data']);
        } else {
            return response()->json(['error' => 'No results found'], 404);
        }
    }
    /**
     * calculate shipping cost based on the selected destination and courier.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function calculateShippingCost(Request $request)
    {
        $request->validate([
            'destination' => 'required|integer',
            'weight' => 'required|integer|min:1', // Weight must be a positive integer
            'courier' => 'required|string|in:jne,pos,tiki,jnt,sicepat,tiki,anteraja', // Valid couriers
        ]);
        $url = 'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost';
        $response = Http::withHeaders([
            'key' => config('rajaongkir_api.key'),
            'Content-Type' => 'application/json',
        ])->asForm()->post($url, [
            'origin' => env('RAJAONGKIR_ORIGIN'), // Default origin ID, can be set in .env
            'destination' => $request->input('destination', 65421),
            'weight' => $request->input('weight'),
            'courier' => $request->input('courier'),
        ]);
        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to fetch shipping cost'], $response->status());
        }
        $data = $response->json();
        if (isset($data['data'])) {
            return response()->json($data['data']);
        } else {
            return response()->json(['error' => 'No shipping options found'], 404);
        }
    }
    /**
     * track the shipping status.
     * @param int $id
     * @return
     */
    public function trackShipping($id)
    {
        $order = Order::findOrFail($id);

        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to track your order.');
        }

        // Check if the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized access to this order.');
        }

        $shipping = Shipping::where('order_id', $id)->firstOrFail();

        if (!$shipping->tracking_number) {
            return view('shipping.show', [
                'order' => $order->load('shipping'),
                'tracking_info' => [],
                'title' => 'Track Shipping',
            ])->with('error', 'Tracking number not available for this order.');
        }

        $url = 'https://rajaongkir.komerce.id/api/v1/track/waybill';
        $response = Http::withHeaders([
            'key' => config('rajaongkir_api.key'),
            'Content-Type' => 'application/json',
        ])->asForm()->post($url, [
            'courier' => $shipping->courier,
            'awb' => $shipping->tracking_number,
        ]);

        if (!$response->successful()) {
            return view('shipping.show', [
                'order' => $order->load('shipping'),
                'tracking_info' => [],
                'title' => 'Track Shipping',
            ])->with('error', 'Failed to fetch tracking information. Please try again later.');
        }

        $data = $response->json();
        return view('shipping.show', [
            'order' => $order->load('shipping'),
            'tracking_info' => $data['data'] ?? [],
            'title' => 'Track Shipping',
        ]);
    }
    /**
     * Update the shipping information for the order.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $orderId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateShippingInfo(Request $request, $orderId)
    {
        $data = $request->validate([
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'courier' => 'required|string|max:50',
            'district' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'note' => 'nullable|string|max:500',
            'phone' => 'required|string|max:15',
            'postal_code' => 'required|string|max:10',
            'province' => 'required|string|max:255',
            'service' => 'required|string|max:50',
            'shipping_cost' => 'required|numeric|min:0',
            'status' => 'nullable|string|max:50',
            'subdistrict' => 'required|string|max:255',
        ]);
        $order = Order::findOrFail($orderId);
        if (!$order->shipping) {
            $order->shipping()->create($data);
        } else {
            $order->shipping->update($data);
        }
        return redirect()->route('checkout', ['order_id' => $orderId, 'step' => 2])
            ->with('success', 'Shipping information updated successfully.');
    }

    /**
     * Set the order as shipped and update the tracking number.
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setShipped(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'tracking_number' => 'required|string|max:50',
        ]);
        $order = Order::findOrFail($request->input('order_id'));
        if (!$order->shipping) {
            return redirect()->back()->with('error', 'Shipping information not found for this order.');
        }

        $order->shipping->update(['status' => 'shipped', 'tracking_number' => $request->input('tracking_number')]);

        return redirect()->back()->with('success', 'Order status updated to shipped.');
    }
}
