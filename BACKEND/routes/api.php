<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ReportController; // <-- TAMBAHKAN IMPORT INI
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SettingController;

// --- ROUTE PUBLIK ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --- ROUTE YANG BUTUH AUTENTIKASI (Wajib login via Sanctum dulu) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Pindahkan rute reports ke dalam role admin jika laporan hanya boleh diakses oleh Admin
    Route::middleware('role:Admin')->group(function () {
        Route::get('/reports', [ReportController::class, 'index']); // <-- Taruh di sini agar aman
        Route::apiResource('users', UserController::class);
        Route::apiResource('ingredients', IngredientController::class);
        
        // Daftarkan rute 'products' yang mengarah ke MenuController 
        // agar fetch('/api/products') dari React tidak lagi menghasilkan 404
        
        Route::delete('products/{product}', [MenuController::class, 'destroy']);

        Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);
    });

    // 2. Khusus Kasir (Proses checkout transaksi)
    Route::middleware('role:Kasir')->group(function () {
        Route::post('/transactions', [TransactionController::class, 'store']);
    });

    // 3. Bisa diakses Keduanya (Admin & Kasir)
    Route::middleware('role:Admin,Kasir')->group(function () {
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);
        Route::get('/profile', [AuthController::class, 'profile']);
        // --- Route Absensi Karyawan ---
        Route::get('/attendances', [AttendanceController::class, 'index']); 
        Route::post('/attendances/check-in', [AttendanceController::class, 'checkIn']); 
        Route::post('/attendances/check-out', [AttendanceController::class, 'checkOut']); 
        Route::apiResource('products', MenuController::class);
        Route::apiResource('categories', CategoryController::class);


        Route::post('/logout', [AuthController::class, 'logout']);
    });
    
});