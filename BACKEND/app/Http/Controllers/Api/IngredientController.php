<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    // Melihat semua bahan baku (Admin)
    public function index()
    {
        $ingredients = Ingredient::all();
        return response()->json([
            'status' => 'success',
            'data' => $ingredients
        ], 200);
    }

    // Menambah bahan baku baru (Admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name',
            'stock_quantity' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50', // contoh: 'gram', 'ml', 'pcs'
            'image_url' => 'nullable|string'
        ]);

        $ingredient = Ingredient::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Bahan baku berhasil ditambahkan',
            'data' => $ingredient
        ], 201);
    }

    // Melihat detail satu bahan baku
    public function show(Ingredient $ingredient)
    {
        return response()->json([
            'status' => 'success',
            'data' => $ingredient
        ], 200);
    }

    // Update stok atau info bahan baku (Admin)
    public function update(Request $request, Ingredient $ingredient)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:ingredients,name,' . $ingredient->id,
            'stock_quantity' => 'sometimes|required|numeric|min:0',
            'unit' => 'sometimes|required|string|max:50',
            'image_url' => 'nullable|string'
        ]);

        $ingredient->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Bahan baku berhasil diperbarui',
            'data' => $ingredient
        ], 200);
    }

    // Menghapus bahan baku (Admin)
    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Bahan baku berhasil dihapus'
        ], 200);
    }
}