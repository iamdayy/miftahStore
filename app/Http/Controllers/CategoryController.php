<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Fetch categorys from the database
        $items = Category::paginate(10);

        // Return the view with categorys data
        return view('admin.categories.index', compact('items'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // Return the view for creating a new category
        return view('admin.categories.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string'
        ]);

        // Create a new category instance
        $category = new Category($data);
        $category->save();

        // Redirect to the categorys index with success message
        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // Find the category by ID
        $item = Category::findOrFail($id);

        // Return the view for editing the category
        return view('admin.categories.edit', compact('item'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string'
        ]);

        // Find the category by ID
        $category = Category::findOrFail($id);


        // Update the redirect URL
        $category->name = $request->name;
        $category->description = $request->description;
        $category->save();

        // Redirect to the categorys index with success message
        return redirect('/admin/categories');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Find the category by ID
        $category = Category::findOrFail($id);

        // Delete the category
        $category->delete();

        // Redirect to the categorys index with success message
        return redirect('/admin/categories');
    }
};
