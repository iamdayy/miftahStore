<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    protected $fillable = [
        'order_id',
        'full_name',
        'address',
        'subdistrict',
        'district',
        'city',
        'province',
        'postal_code',
        'phone',
        'courier',
        'service',
        'shipping_cost',
        'tracking_number',
        'status',
        'shipped_at',
        'delivered_at',
        'note'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
