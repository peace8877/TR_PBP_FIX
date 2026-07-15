<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    // Melihat riwayat absensi (Bisa diakses Admin/Kasir)
    public function index()
    {
        $attendances = Attendance::with('user')->latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $attendances
        ], 200);
    }

    // Proses Check-in (Dilakukan saat mulai kerja)
    public function checkIn(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $today = now()->toDateString();

        // Cek apakah user sudah absen hari ini
        $alreadyCheckedIn = Attendance::where('user_id', $request->user_id)
            ->where('attendance_date', $today)
            ->exists();

        if ($alreadyCheckedIn) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah melakukan check-in hari ini.'
            ], 422);
        }

        // Buat data absensi baru
        $attendance = Attendance::create([
            'user_id' => $request->user_id,
            'attendance_date' => $today,
            'check_in_time' => now()->toTimeString(),
            'status' => 'present' // Status default hadir
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Check-in berhasil disimpan!',
            'data' => $attendance
        ], 201);
    }

    // Proses Check-out (Dilakukan saat pulang kerja)
    public function checkOut(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $today = now()->toDateString();

        // Cari data check-in hari ini yang belum melakukan check-out
        $attendance = Attendance::where('user_id', $request->user_id)
            ->where('attendance_date', $today)
            ->first();

        if (!$attendance) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data check-in hari ini tidak ditemukan. Silakan check-in terlebih dahulu.'
            ], 404);
        }

        if ($attendance->check_out_time !== null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah melakukan check-out hari ini.'
            ], 422);
        }

        // Update jam pulang
        $attendance->update([
            'check_out_time' => now()->toTimeString()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Check-out berhasil disimpan!',
            'data' => $attendance
        ], 200);
    }
}