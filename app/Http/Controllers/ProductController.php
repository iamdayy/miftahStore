<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $searchTerm = $request->input('search');
        $categoryId = $request->input('category_id');

        $query = Product::query()->with('category');
        $categories = Category::all();

        if ($searchTerm) {
            $query->search($searchTerm);
        }

        if ($categoryId) {
            $query->inCategory($categoryId);
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $searchTerm,
                'category_id' => $categoryId,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('admin/products/create');
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sizes' => 'required|array',
            'sizes.*' => 'string|max:10',
            'photo' => 'nullable|image|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);
        $data = $request->only([
            'name',
            'description',
            'price',
            'stock',
            'sizes',
            'photo',
            'category_id'
        ]);
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('products', 'public');
        }
        Product::create($data);
        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        return Inertia::render('admin/products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, int $productId)
    {
        $product = Product::findOrFail($productId);
        // Validate the request data
        if ($product->id !== $productId) {
            return redirect()->route('admin.products.index')->withErrors(['product' => 'Product not found.']);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sizes' => 'required|array',
            'sizes.*' => 'string|max:10',
            // 'photo' => $request->hasFile('photo') ? 'image|max:2048' : 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);
        $data = $request->only([
            'name',
            'description',
            'price',
            'stock',
            'sizes',
            'photo',
            'category_id'
        ]);
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($product->photo) {
                Storage::disk('public')->delete($product->photo);
            }
            $data['photo'] = $request->file('photo')->store('products', 'public');
        }
        $product->update($data);
        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(int $productId)
    {
        $product = Product::findOrFail($productId);
        if ($product->id !== $productId) {
            return redirect()->route('admin.products.index')->withErrors(['product' => 'Product not found.']);
        }
        // Delete photo if exists
        if ($product->photo) {
            Storage::disk('public')->delete($product->photo);
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
