<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\AttendanceController;
use Illuminate\Support\Facades\Route;

// --- ROUTE PUBLIK ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --- ROUTE YANG BUTUH AUTENTIKASI (Wajib login via Sanctum dulu) ---
Route::middleware('auth:sanctum')->group(function () {

    // 1. Khusus Admin (Akses menu, kategori, dan bahan baku)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('ingredients', IngredientController::class);
        
        // Daftarkan rute 'products' yang mengarah ke MenuController 
        // agar fetch('/api/products') dari React tidak lagi menghasilkan 404
        Route::apiResource('products', MenuController::class);
        Route::delete('products/{product}', [MenuController::class, 'destroy']);
        // Route::apiResource('menus', MenuController::class); 
    });

    // 2. Khusus Kasir (Proses checkout transaksi)
    Route::middleware('role:kasir')->group(function () {
        Route::post('/transactions', [TransactionController::class, 'store']);
    });

    // 3. Bisa diakses Keduanya (Admin & Kasir)
    Route::middleware('role:admin,kasir')->group(function () {
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);
        
        // --- Route Absensi Karyawan ---
        Route::get('/attendances', [AttendanceController::class, 'index']); 
        Route::post('/attendances/check-in', [AttendanceController::class, 'checkIn']); 
        Route::post('/attendances/check-out', [AttendanceController::class, 'checkOut']); 

        Route::post('/logout', [AuthController::class, 'logout']);
    });
    
});