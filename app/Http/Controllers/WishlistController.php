<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist.
     */
    public function index()
    {
        $user = Auth::user();
        $wishlists = Wishlist::where('user_id', $user->id)->with('product')->get();

        return inertia('wishlists/index', [
            'wishlistItems' => $wishlists,
        ]);
    }

    /**
     * Toggle a product in the user's wishlist.
     */
    public function toggle(Request $request)
    {
        $user = Auth::user();
        $productId = $request->input('product_id');
        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();
        if ($wishlist) {
            $wishlist->delete();
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
        }

        return redirect()->route('wishlist.index')->with('success', 'Wishlist updated successfully.');
    }
}
