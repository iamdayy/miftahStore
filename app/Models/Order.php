<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'shipping_id',
        'payment_id',
        'discount',
        'total_amount',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'items_orders', 'order_id', 'product_id')
            ->withPivot('quantity', 'review_id')
            ->withTimestamps();
    }

    public function shipping()
    {
        return $this->hasOne(Shipping::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }
}
