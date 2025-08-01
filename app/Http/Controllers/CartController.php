<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use Carbon\Carbon;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $carts = Cart::with(['product', 'product.category', 'user'])->where('user_id', Auth::user()->id)
            ->get();
        // $carts = DB::table('carts')
        //     ->where('user_id', Auth::user()->id)
        //     ->get();
        $subtotal = 0;
        foreach ($carts as $cart) {
            $subtotal += $cart->product->price * $cart->quantity;
        }
        return Inertia::render('cart/index', [
            'carts' => $carts,
            'subtotal' => $subtotal,
        ]);
    }
    public function addToCart(Request $request)
    {
        $productExist = Cart::where('user_id', Auth::user()->id)
            ->where('product_id', $request->product_id)
            ->get();
        // var_dump(sizeof($productExist));
        // exit;
        if (sizeof($productExist)) {
            $count = $productExist[0]->quantity + (int)$request->quantity;
            Cart::where('id', $productExist[0]->id)->update([
                'quantity' => $count,
            ]);
            return redirect(route('products.show', ['product' => $request->product_id]));
        }
        Cart::create([
            'user_id' => Auth::user()->id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        return redirect(route('cart.index'))->with('success', 'Product added to cart successfully');
    }
    public function updateCart(Request $request)
    {
        $product = Cart::find([
            'user_id' => Auth::user()->id,
            'product_id' => $request->product_id,
        ])->first();
        if (!$product) {
            return redirect(route('cart.index'))->with('error', 'Product not found in cart');
        }
        if ($request->quantity <= 0) {
            $product->delete();
            return redirect(route('cart.index'))->with('success', 'Product removed from cart');
        }
        $count = (int)$request->quantity;
        if ($count > $product->product->stock) {
            return redirect(route('cart.index'))->with('error', 'Quantity exceeds available stock');
        }
        $product->update([
            'quantity' => $count,
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);
        return redirect(route('cart.index'));
    }
}
