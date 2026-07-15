<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // <-- IMPORT MODEL USER
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // <-- IMPORT FACADE HASH

class AuthController extends Controller
{
    /**
     * Menangani proses login user.
     */
    public function login(Request $request)
    {
        // Validasi input form dari React
        $request->validate([
            'name'     => 'required|string',
            'password' => 'required|string',
        ]);

        // Mencari pengguna berdasarkan kolom name di database
        $user = User::where('name', $request->name)->first();

        // Validasi keberadaan user dan kecocokan password terenkripsi
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password yang Anda masukkan salah.'
            ], 401);
        }

        // Membuat token akses baru via Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Mengirim respon sukses beserta data user dan token
        return response()->json([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => [
                'name' => $user->name,
                'role' => $user->role, // Mengambil data role (admin/cashier)
            ]
        ], 200);
    }

    /**
     * Menangani proses logout (Opsional - untuk menghapus token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout'
        ], 200);
    }
}