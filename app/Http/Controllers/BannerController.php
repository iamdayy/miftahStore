<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * Display a listing of the banners.
     */
    public function index()
    {
        $banners = Banner::with(['product', 'product.category'])->get();
        $products = Product::with('category')->get();
        return Inertia::render('admin/banners/index', [
            'banners' => $banners,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created banner in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'product_id' => 'nullable|exists:products,id',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner = \App\Models\Banner::create($data);
        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    /**
     * Display the specified banner.
     */
    public function show($id)
    {
        $banner = \App\Models\Banner::with('product')->findOrFail($id);
        return response()->json($banner);
    }

    /**
     * Update the specified banner in storage.
     */
    public function update(Request $request, $id)
    {
        $banner = \App\Models\Banner::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            // 'image' => 'nullable|image|max:2048',
            'product_id' => 'nullable|exists:products,id',
        ]);
        if ($request->hasFile('image')) {
            if ($banner->image) {
                Storage::disk('public')->delete($banner->image);
            }
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($data);
        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    /**
     * Remove the specified banner from storage.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        if ($banner->image) {
            Storage::disk('public')->delete($banner->image);
        }
        $banner->delete();
        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }
}
