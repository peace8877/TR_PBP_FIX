<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // <-- IMPORT MODEL USER
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // <-- IMPORT FACADE HASH

class AuthController extends Controller
{
   public function login(Request $request)
{
    // Validasi input
    $request->validate([
        'name'     => 'required|string',
        'password' => 'required|string',
    ]);

    // Cari user berdasarkan name
    $user = User::where('name', $request->name)->first();

    // Cek apakah user ditemukan
    if (!$user) {
        return response()->json([
            'message' => 'Username atau password salah.'
        ], 401);
    }

    // Verifikasi password
    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Username atau password salah.'
        ], 401);
    }

    $user->update([
        'status' => 'Aktif',
        'last_active_at' => now(),
    ]);
    
    $token = $user->createToken('auth_token')->plainTextToken;
    return response()->json(['token' => $token, 'user' => $user], 200);
}

public function logout(Request $request)
{
    $user = $request->user();
    
    $user->update([
        'status' => 'Non aktif', // Pastikan pakai tanda hubung
        'last_inactive_at' => now(),
    ]);

    $user->currentAccessToken()->delete();
    return response()->json(['message' => 'Berhasil logout']);
}

    public function register(Request $request)
    {
        // 1. Validasi WAJIB menyertakan email dan role agar tidak error
        $request->validate([
            'name'     => 'required|string|max:255|unique:users,name',
            'email'    => 'required|string|email|max:255|unique:users,email', // Email harus ada
            'password' => 'required|string|min:8',
            'role'     => 'required|string|in:Admin,Kasir',                // Role harus ada
        ]);

        // 2. Logika pembuatan user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role, // Mengambil role dari request (bisa admin atau cashier)
            'status'   => 'Aktif',        // Default status
        ]);

        return response()->json([
            'message' => 'User berhasil didaftarkan sebagai ' . $request->role,
            'user'    => $user
        ], 201);
    }

    
    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'id'               => $user->id,
            'name'             => $user->name,
            'email'            => $user->email,
            'role'             => $user->role,
            'status'           => $user->status,
            'last_active_at'   => $user->last_active_at,
            'last_inactive_at' => $user->last_inactive_at,
        ], 200);
}
}

