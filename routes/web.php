<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\WishlistController;
use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;
use App\Models\Discount;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    $products = Product::with('category')->latest()->limit(8)->get();
    $banners = Banner::with(['product', 'product.category'])->latest()->get();
    $discounts = Discount::where('status', 'active')->get();
    return Inertia::render('home', [
        'products' => $products,
        'banners' => $banners,
        'discounts' => $discounts,
    ]);
})->name('home');
Route::prefix('products')->group(function () {
    Route::get('/', function () {
        $products = Product::with('category')->latest()->paginate(10);
        $categories = Category::all();
        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories
        ]);
    })->name('products.index');
    Route::get('/category/{category}', function ($id) {
        $products = Product::with('category')->where('category_id', $id)->latest()->paginate(10);
        $categories = Category::all();
        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories
        ]);
    })->name('products.category');

    Route::get('/{product}', function ($id) {
        $product = Product::with('category')->findOrFail($id);
        return Inertia::render('products/show', [
            'product' => $product
        ]);
    })->name('products.show');
});
Route::middleware(['auth'])->group(function () {
    Route::get('profile', function () {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)->with(['products', 'shipping', 'payment'])->limit(5)->latest();
        $recentOrders = $orders->get() ?: collect();
        $cart = Cart::where('user_id', $user->id)->with('product')->first();
        $cartItems = $cart ? $cart : collect();
        $wishlist = Wishlist::where('user_id', $user->id)->with('product')->first();
        $wishlistItems = $wishlist ? $wishlist : collect();
        $totalSpend = $orders->sum('total_amount');
        return Inertia::render('profile/index', [
            'user' => $user,
            'recentOrders' => $recentOrders,
            'cartItems' => $cartItems,
            'wishlistItems' => $wishlistItems,
            'totalSpend' => $totalSpend
        ]);
    })->name('profile');
    Route::controller(CartController::class)->prefix('cart')->group(function () {
        Route::get('/', 'index')->name('cart.index');
        Route::post('/add', 'addToCart')->name('cart.add');
        Route::post('/update', 'updateCart')->name('cart.update');
    });
    Route::controller(ShippingController::class)->prefix('shipping')->group(function () {
        Route::get('/destination', 'getDestination')->name('shipping.destination');
        Route::post('/calculate-cost', 'calculateShippingCost')->name('shipping.calculateCost');
        Route::get('/tracking/{waybill}', 'trackShipping')->name('shipping.track');
    });
    Route::get('checkout', [OrderController::class, 'checkout'])->name('checkout');
    Route::post('checkout', [OrderController::class, 'checkout'])->name('checkout.process');
    Route::post('checkout/shipping/{orderId}', [ShippingController::class, 'updateShippingInfo'])->name('checkout.shipping.update');
    Route::post('checkout/payment', [PaymentController::class, 'processPayment'])->name('checkout.process-payment');
    Route::controller(WishlistController::class)->prefix('wishlist')->group(function () {
        Route::get('/', 'index')->name('wishlist.index');
        Route::post('/toggle', 'toggle')->name('wishlist.toggle');
    });
});

Route::post('/payment/notification', [PaymentController::class, 'handleNotification'])->name('payment.notification');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
