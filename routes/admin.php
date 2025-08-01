<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\BannerController;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        $salesData = Order::selectRaw('DATE(created_at) as date, SUM(total_amount) as total, COUNT(*) as count')
            // ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::parse($item->date)->format('F Y'),
                    'penjualan' => $item->total,
                    'pesanan' => $item->count,
                    'pelanggan' => Order::whereDate('created_at', $item->date)->distinct('user_id')->count(),
                ];
            });
        // select category with sales count
        $categoryData = Product::selectRaw('category_id, COUNT(*) as count, SUM(stock) as stock')
            ->groupBy('category_id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category->name,
                    'value' => intval($item->stock),
                    'count' => $item->count,
                    'color' => sprintf('#%06X', mt_rand(0, 0xFFFFFF)),
                ];
            });

        $dailyOrdersData = Order::selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get()
            ->map(function ($item) {
                return [
                    'day' => Carbon::parse($item->date)->format('d'),
                    'pesanan' => $item->count,
                    'pendapatan' => $item->total
                ];
            });
        $dailyOrdersData = $dailyOrdersData->take(30);
        $topProducts = Product::withCount('orders')
            ->orderBy('orders_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'terjual' => $product->orders_count,
                    'pendapatan' => $product->orders_count * $product->price,
                    'pertumbuhan' => $product->orders_count - $product->orders_count_last_month,
                ];
            });

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();
        return Inertia::render('admin/index', [
            'salesData' => $salesData,
            'categoryData' => $categoryData,
            'dailyOrdersData' => $dailyOrdersData,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
        ]);
    })->name('admin');
    // Route::controller(CategoryController::class)->prefix('categories')->group(function () {
    //     Route::get('/', 'index')->name('admin.categories.index');
    //     Route::get('/create', 'create')->name('admin.categories.create');
    //     Route::post('/', 'store')->name('admin.categories.store');
    //     Route::get('/{category}/edit', 'edit')->name('admin.categories.edit');
    //     Route::put('/{category}', 'update')->name('admin.categories.update');
    //     Route::delete('/{category}', 'destroy')->name('admin.categories.destroy');
    // });
    Route::controller(ProductController::class)->prefix('products')->group(function () {
        Route::get('/', 'index')->name('admin.products.index');
        Route::get('/create', 'create')->name('admin.products.create');
        Route::post('/', 'store')->name('admin.products.store');
        Route::get('/{product}/edit', 'edit')->name('admin.products.edit');
        Route::put('/{productId}', 'update')->name('admin.products.update');
        Route::delete('/{product}', 'destroy')->name('admin.products.destroy');
    });

    Route::get('/users', function () {
        $users = User::latest()->paginate(10);
        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    })->name('admin.users.index');

    Route::controller(DiscountController::class)->prefix('discounts')->group(function () {
        Route::get('/', 'index')->name('admin.discounts.index');
        Route::post('/', 'store')->name('admin.discounts.store');
        Route::put('/{id}', 'update')->name('admin.discounts.update');
        Route::delete('/{id}', 'destroy')->name('admin.discounts.destroy');
    });

    Route::controller(BannerController::class)->prefix('banners')->group(function () {
        Route::get('/', 'index')->name('admin.banners.index');
        Route::post('/', 'store')->name('admin.banners.store');
        Route::get('/{id}', 'show')->name('admin.banners.show');
        Route::put('/{id}', 'update')->name('admin.banners.update');
        Route::delete('/{id}', 'destroy')->name('admin.banners.destroy');
    });

    Route::controller(OrderController::class)->prefix('orders')->group(function () {
        Route::get('/', 'index')->name('admin.orders.index');
        Route::get('/{id}', 'adminShow')->name('admin.orders.show');
        Route::put('/{id}/status/{status}', 'changeStatus')->name('admin.orders.change-status');
    });

    Route::controller(ShippingController::class)->prefix('/shipping')->group(function () {
        Route::post('/tracking/add', 'setShipped')->name('admin.shipping.add-tracking');
        Route::post(('/tracking/set-delivered/{id}'), 'setDelivered')->name('admin.shipping.set-delivered');
    });
});
