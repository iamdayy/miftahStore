<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

class DiscountController extends Controller
{
    /**
     * Display a listing of the discounts.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $discounts = Discount::where('status', 'active')->get();
        return Inertia::render('admin/discounts/index', [
            'discounts' => $discounts,
        ]);
    }
    /**
     * store a newly created discount in storage.
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:255|unique:discounts,code',
            'type' => 'required|in:percentage,amount',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
        ]);
        $discount = new Discount($request->all());
        if ($request->hasFile('image')) {
            $discount->image = $request->file('image')->store('discounts', 'public');
        }
        $discount->save();
        return redirect()->route('admin.discounts.index')->with('success', 'Discount created successfully.');
    }

    /**
     * update the specified discount in storage.
     *
     * @param Request $request
     * @return void
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:255|unique:discounts,code,' . $id,
            'type' => 'required|in:percentage,amount',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
        ]);
        $discount = Discount::findOrFail($id);
        $discount->fill($request->all());
        if ($request->hasFile('image')) {
            if ($discount->image) {
                Storage::disk('public')->delete($discount->image);
            }
            $discount->image = $request->file('image')->store('discounts', 'public');
        }
        $discount->save();
        return redirect()->route('admin.discounts.index')->with('success', 'Discount updated successfully.');
    }
    /**
     * Remove the specified discount from storage.
     *
     * @param int $id
     * @return void
     */
    public function destroy($id)
    {
        $discount = Discount::findOrFail($id);
        if ($discount->image) {
            Storage::disk('public')->delete($discount->image);
        }
        $discount->delete();
        return redirect()->route('admin.discounts.index')->with('success', 'Discount deleted successfully.');
    }
    /**
     * Apply a discount code to the cart.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function applyDiscount(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ]);
        $code = $request->input('code');

        $discount = Discount::where('code', $code)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->first();

        if (!$discount) {
            return response()->json(['message' => 'Invalid discount code.']);
        }

        if (!$discount->isActive()) {
            return response()->json(['message' => 'Discount code is not active.']);
        }
        $carts = Cart::with(['product', 'product.category', 'user'])->where('user_id', Auth::user()->id)
            ->get();
        return Inertia::render('cart/index', [
            'discount' => $discount,
            'carts' => $carts,
        ]);
    }
}
