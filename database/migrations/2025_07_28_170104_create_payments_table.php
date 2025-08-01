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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('payment_method'); // e.g., 'credit_card', 'paypal'
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('IDR'); // Default currency is IDR
            $table->string('status')->default('pending'); // Default status is 'pending'
            $table->string('transaction_id')->nullable(); // Transaction ID from payment gateway
            $table->timestamp('paid_at')->nullable(); // Timestamp when the payment was made
            $table->string('snap_token')->nullable(); // Token for Snap payment
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
