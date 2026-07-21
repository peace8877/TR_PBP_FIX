<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Mengambil semua menu beserta kategori & ingredients
    public function index()
    {
        $menus = Menu::with('category', 'ingredients')->get();
        return response()->json([
            'status' => 'success',
            'data' => $menus
        ], 200);
    }

    // Menambah menu baru
    public function store(Request $request)
{
    // Validasi data menu beserta array resep bahannya
    $validated = $request->validate([
        'category_id'                   => 'required|exists:categories,id',
        'name'                          => 'required|string|max:255',
        'description'                   => 'nullable|string',
        'price'                         => 'required|numeric|min:0',
        'is_available'                  => 'boolean',
        'image'                         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        // Validasi Array Bahan Baku (Resep)
        'ingredients'                   => 'nullable|array',
        'ingredients.*.ingredient_id'   => 'required_with:ingredients|exists:ingredients,id',
        'ingredients.*.quantity_needed' => 'required_with:ingredients|numeric|min:0.01',
    ]);

    // Proses upload gambar jika ada
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
        $validated['image_url'] = $imagePath;
    }

    // 1. Simpan Data Menu
    $menu = Menu::create($validated);

    // 2. Attach (hubungkan) bahan baku ke tabel pivot menu_ingredients
    if (!empty($validated['ingredients'])) {
        foreach ($validated['ingredients'] as $item) {
            $menu->ingredients()->attach($item['ingredient_id'], [
                'quantity_needed' => $item['quantity_needed']
            ]);
        }
    }

    return response()->json([
        'status'  => 'success',
        'message' => 'Menu berhasil ditambahkan beserta resepnya',
        'data'    => $menu->load('ingredients')
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
        'category_id'                   => 'sometimes|required|exists:categories,id',
        'name'                          => 'sometimes|required|string|max:255',
        'description'                   => 'nullable|string',
        'price'                         => 'sometimes|required|numeric|min:0',
        'is_available'                  => 'boolean',
        'image'                         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'ingredients'                   => 'nullable|array',
        'ingredients.*.ingredient_id'   => 'required_with:ingredients|exists:ingredients,id',
        'ingredients.*.quantity_needed' => 'required_with:ingredients|numeric|min:0.01',
    ]);

    // Proses upload gambar baru jika ada
    if ($request->hasFile('image')) {
        // Hapus gambar lama jika ada
        if ($menu->image_url) {
            \Storage::disk('public')->delete($menu->image_url);
        }
        $imagePath = $request->file('image')->store('products', 'public');
        $validated['image_url'] = $imagePath;
    }

    // 1. Update Data Utama Menu
    $menu->update($validated);

    // 2. Sync (Sinkronisasi ulang) resep bahan baku
    if (array_key_exists('ingredients', $validated)) {
        $syncData = [];
        foreach ($validated['ingredients'] as $item) {
            $syncData[$item['ingredient_id']] = [
                'quantity_needed' => $item['quantity_needed']
            ];
        }
        // method sync() otomatis menghapus resep lama & mengganti dengan yang baru
        $menu->ingredients()->sync($syncData); 
    }

    return response()->json([
        'status'  => 'success',
        'message' => 'Menu berhasil diperbarui',
        'data'    => $menu->load('ingredients')
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