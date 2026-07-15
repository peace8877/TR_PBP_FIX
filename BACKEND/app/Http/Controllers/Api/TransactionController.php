<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Menu;
use App\Models\Ingredient; // <-- Pastikan ini di-import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // ... method index() tetap sama ...

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_method' => 'required|string',
            'tax_amount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $detailsToSave = [];

            foreach ($request->items as $item) {
                // Ambil data menu beserta bahan baku yang dibutuhkan
                $menu = Menu::with('ingredients')->findOrFail($item['menu_id']);
                
                if (!$menu->is_available) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "Menu '{$menu->name}' saat ini sedang tidak tersedia."
                    ], 422);
                }

                // --- LOGIKA CEK DAN POTONG STOK BAHAN BAKU ---
                foreach ($menu->ingredients as $ingredient) {
                    // Hitung total bahan yang dibutuhkan untuk jumlah pesanan ini
                    $totalNeeded = $ingredient->pivot->quantity_needed * $item['quantity'];

                    // Cek apakah stok di dapur mencukupi
                    if ($ingredient->stock_quantity < $totalNeeded) {
                        return response()->json([
                            'status' => 'error',
                            'message' => "Stok bahan baku '{$ingredient->name}' tidak mencukupi untuk membuat menu '{$menu->name}'."
                        ], 422);
                    }

                    // Kurangi stok bahan baku secara langsung
                    $ingredient->decrement('stock_quantity', $totalNeeded);
                }
                // ----------------------------------------------

                $itemSubtotal = $menu->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $detailsToSave[] = [
                    'menu_id' => $menu->id,
                    'quantity' => $item['quantity'],
                    'price' => $menu->price,
                    'subtotal' => $itemSubtotal
                ];
            }

            $totalAmount = $subtotal + $request->tax_amount;

            // Simpan data utama ke tabel 'transactions'
            $transaction = Transaction::create([
                'user_id' => $request->user_id,
                'subtotal' => $subtotal,
                'tax_amount' => $request->tax_amount,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
                'transactions_date' => now()
            ]);

            // Simpan semua detail item belanjaan
            foreach ($detailsToSave as $detail) {
                $transaction->details()->create($detail);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi sukses diproses dan stok bahan baku telah diperbarui!',
                'data' => $transaction->load('details.menu')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    // ... method show() tetap sama ...

    public function show($id)
    {
        $transaction = Transaction::with(['user', 'details.menu'])->find($id);

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaksi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $transaction
        ], 200);
    }
}