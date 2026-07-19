<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // Mengambil semua pengaturan untuk ditampilkan di React
    public function index()
    {
        return Setting::all()->pluck('value', 'key');
    }

    // Menyimpan/Update pengaturan
    public function store(Request $request)
    {
        try {
            // Melakukan update/insert per item
            foreach ($request->all() as $key => $value) {
                // Pastikan key tidak kosong
                if (!empty($key)) {
                    Setting::updateOrCreate(
                        ['key' => $key],
                        ['value' => $value ?? ''] // Jika value null, ganti string kosong
                    );
                }
            }
            return response()->json(['message' => 'Pengaturan berhasil diperbarui']);
        } catch (\Exception $e) {
            // Ini akan mencatat error sebenarnya ke storage/logs/laravel.log
            Log::error('Gagal simpan setting: ' . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan server'], 500);
        }
    }
}