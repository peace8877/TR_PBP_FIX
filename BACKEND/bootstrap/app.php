<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. DAFTARKAN MIDDLEWARE ROLE DI SINI
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        // 2. ATUR AGAR MIDDLEWARE AUTH TIDAK MELAKUKAN REDIRECT KE RUTE 'login'
        $middleware->redirectGuestsTo(function (Request $request) {
            // Jika request mengarah ke API, jangan lakukan redirect ke halaman login
            if ($request->is('api/*')) {
                abort(response()->json([
                    'message' => 'Unauthenticated. Token tidak valid atau tidak disertakan.'
                ], 401));
            }
            
            // Fallback default jika diakses lewat rute web biasa (bisa diarahkan ke json juga)
            return response()->json(['message' => 'Unauthenticated.'], 401);
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Memaksa Laravel merender response JSON jika terjadi exception di rute API
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });
    })->create();