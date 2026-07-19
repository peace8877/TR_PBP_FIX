<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Mengambil semua data pengguna untuk ditampilkan di tabel.
     */
    public function index()
    {
        // Mengambil user dengan data minimal yang dibutuhkan demi efisiensi
        $users = User::select('id', 'name', 'email', 'role', 'status')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

    /**
     * POST /api/users
     * Menyimpan/membuat user baru ke database.
     */
    // app/Http/Controllers/Api/UserController.php

        public function store(Request $request)
        {
            // Pastikan validasi menyertakan email
            $validated = $request->validate([
                'name' => 'required',
                'email' => 'required|email', // <-- Tambahkan ini
                'password' => 'required',
                'role' => 'required|string|in:Admin,Kasir',
                'status' => 'required',
            ]);

            // Pastikan 'email' ada di sini
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email, // Pastikan baris ini ada
                'password' => bcrypt($request->password),
                'role' => $request->role,
                'status' => $request->status ?? 'Aktif', // Berikan default jika status tidak dikirim
            ]);

            return response()->json(['message' => 'User created', 'data' => $user], 201);
        }
    public function show($id)
    {
        $user = User::findOrFail($id);
        
        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }

    /**
     * PUT /api/users/{id}
     * Memperbarui data pengguna yang sudah ada.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validasi data (email unik diabaikan untuk user ini sendiri)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:Admin,Kasir',
            'status' => 'required|string|in:Aktif,Nonaktif',
        ]);

        // Jika form edit menyertakan paFssword baru (opsional)
        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8']);
            $user->password = Hash::make($request->password);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil diperbarui',
            'data' => $user
        ], 200);
    }

    /**
     * DELETE /api/users/{id}
     * Menghapus user dari database.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dihapus'
        ], 200);
    }
}