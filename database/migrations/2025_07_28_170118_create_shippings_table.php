<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shippings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('full_name'); // Full name of the recipient
            $table->string('address');
            $table->string('subdistrict')->nullable();
            $table->string('district')->nullable();
            $table->string('city');
            $table->string('province');
            $table->string('postal_code')->nullable();
            $table->string('phone')->nullable();
            $table->string(('courier'))->nullable(); // e.g., 'jne', 'tiki', 'pos'
            $table->string('service')->nullable(); // e.g., 'regular', 'express'
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->string('tracking_number')->nullable(); // Tracking number for the shipment
            $table->string('status')->default('pending'); // Default status is 'pending'
            $table->timestamp('shipped_at')->nullable(); // Timestamp when the order was shipped
            $table->timestamp('delivered_at')->nullable(); // Timestamp when the order was delivered
            $table->string('note')->nullable(); // Additional notes for the shipping
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shippings');
    }
};
