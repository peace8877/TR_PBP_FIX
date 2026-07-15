<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Pastikan user sudah login via Sanctum
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthorized. Silakan login terlebih dahulu.'
            ], 401);
        }

        // Periksa apakah role user ada di dalam daftar parameter middleware
        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden. Anda tidak memiliki akses ke halaman ini.'
            ], 403);
        }

        return $next($request);
    }
}