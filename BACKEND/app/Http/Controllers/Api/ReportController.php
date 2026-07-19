<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());

        $startDateTime = $startDate . ' 00:00:00';
        $endDateTime = $endDate . ' 23:59:59';

        try {
            // 1. Total Penjualan (Sesuaikan kolom total_price jika berbeda di DB Anda)
            $totalSales = DB::table('transactions')
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->sum('total_amount'); // <-- Kolom disesuaikan

            // 2. Total Transaksi
            $totalTransactions = DB::table('transactions')
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count();

            // 3. Total Produk Terjual (Gunakan join sederhana)
            $productsSold = DB::table('transaction_details')
                ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
                ->whereBetween('transactions.created_at', [$startDateTime, $endDateTime])
                ->sum('transaction_details.quantity');

            // 4. Top Selling (Kita sederhanakan kalkulasi salesnya agar tidak crash jika kolom 'price' tidak ada di detail)
            // 4. Top Selling (Sertakan kalkulasi total sales per menu agar React tidak crash)
            $topSelling = DB::table('transaction_details')
                ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
                ->join('menus', 'transaction_details.menu_id', '=', 'menus.id')
                ->select(
                    'menus.name', 
                    DB::raw('SUM(transaction_details.quantity) as quantity'),
                    DB::raw('SUM(transaction_details.quantity * transaction_details.price) as sales') // <-- TAMBAHKAN INI (Sesuaikan nama kolom 'price' di detail jika berbeda)
                )
                ->whereBetween('transactions.created_at', [$startDateTime, $endDateTime])
                ->groupBy('menus.id', 'menus.name')
                ->orderBy('quantity', 'desc')
                ->limit(5)
                ->get();

            // 5. Tren Grafik Penjualan Harian
            $chartData = DB::table('transactions')
                ->select(
                    DB::raw("DATE(created_at) as date"),
                    DB::raw('SUM(total_amount) as value') // <-- Kolom disesuaikan
                )
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->groupBy(DB::raw("DATE(created_at)"))
                ->orderBy('date', 'asc')
                ->get();

            $categories = DB::table('categories')
                ->join('menus', 'categories.id', '=', 'menus.category_id')
                ->join('transaction_details', 'menus.id', '=', 'transaction_details.menu_id')
                ->select('categories.name', DB::raw('SUM(transaction_details.quantity) as value'))
                ->groupBy('categories.name')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_sales' => (int) $totalSales,
                    'total_transactions' => $totalTransactions,
                    'products_sold' => (int) $productsSold,
                    'top_selling' => $topSelling,
                    'sales_chart_data' => $chartData,
                    'category_data' => $categories,
                                   ]
            ], 200);

        } catch (\Exception $e) {
            // Jika terjadi kegagalan query, exception ini akan menangkap detailnya
            return response()->json([
                'status' => 'error',
                'message' => 'Detail Error: ' . $e->getMessage()
            ], 500);
        }
    }
}