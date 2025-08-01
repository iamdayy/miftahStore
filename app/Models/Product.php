<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'sizes',
        'photo',
        'category_id'
    ];

    protected $casts = [
        'sizes' => 'array',
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'items_orders')->withPivot('quantity');
    }

    public function scopeAvailable($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeInCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('name', 'like', '%' . $searchTerm . '%');
    }
}
