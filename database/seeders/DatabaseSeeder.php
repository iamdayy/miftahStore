<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin'),
            'role' => 'admin'
        ]);
        $categories = [
            [
                'name' => 'Kemeja Polos',
                'description' => 'Koleksi kemeja polos untuk tampilan kasual yang tetap stylish.'
            ],
            [
                'name' => 'Kemeja Flanel',
                'description' => 'Koleksi kemeja flanel yang nyaman dan stylish.'
            ],
            [
                'name' => 'Sarung Batik',
                'description' => 'Sarung batik dengan motif tradisional yang elegan.'
            ]
        ];
        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
