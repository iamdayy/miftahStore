<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'code',
        'type',
        'value',
        'start_date',
        'end_date',
        'image',
        'status'
    ];

    /**
     * Get the formatted value of the discount.
     *
     * @return string
     */
    public function getFormattedValueAttribute()
    {
        return $this->type === 'percentage' ? "{$this->value}%" : "$this->value";
    }
    /**
     * Check if the discount is active.
     *
     * @return bool
     */
    public function isActive()
    {
        $now = now();
        return $this->status === 'active' &&
            (!$this->start_date || $this->start_date <= $now) &&
            (!$this->end_date || $this->end_date >= $now);
    }
    /**
     * Get the orders associated with the discount.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
