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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('code')->unique();
            $table->string('type'); // e.g., 'percentage', 'fixed'
            $table->decimal('value', 10, 2); // Value of the discount
            $table->dateTime('start_date')->nullable(); // Start date of the discount
            $table->dateTime('end_date')->nullable(); // End date of the discount
            $table->string('image')->nullable(); // Optional image for the discount
            $table->string('status')->default('active'); // Status of the discount, e.g., 'active', 'inactive'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
