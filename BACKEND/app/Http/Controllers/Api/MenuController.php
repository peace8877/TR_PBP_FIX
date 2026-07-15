<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Mengambil semua menu beserta kategorinya
    public function index()
    {
        $menus = Menu::with('category')->get();
        return response()->json([
            'status' => 'success',
            'data' => $menus
        ], 200);
    }

    // Menambah menu baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'image_url' => 'nullable|string'
        ]);

        $menu = Menu::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Menu berhasil ditambahkan',
            'data' => $menu->load('category')
        ], 201);
    }

    // Mengambil detail satu menu
    public function show(Menu $menu)
    {
        return response()->json([
            'status' => 'success',
            'data' => $menu->load('category')
        ], 200);
    }

    // Mengubah data menu
    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'is_available' => 'boolean',
            'image_url' => 'nullable|string'
        ]);

        $menu->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Menu berhasil diperbarui',
            'data' => $menu->load('category')
        ], 200);
    }

    // Menghapus menu
   public function destroy($id)
{
    // Cari produk berdasarkan ID secara manual
    $product = Menu::find($id);

    if (!$product) {
        return response()->json(['message' => 'Produk tidak ditemukan'], 404);
    }

    $product->delete();

    return response()->json(['message' => 'Produk berhasil dihapus']);
}
}