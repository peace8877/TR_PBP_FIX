<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- 1. PASTIKAN IMPORT INI ADA

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // <--- 2. PASTIKAN TRAIT INI DIGUNAKAN DI SINI

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
    'name', 
    'email', 
    'password', 
    'role', 
    'status',           // Pastikan ini ada
    'last_active_at',   // Pastikan ini ada
    'last_inactive_at', // Pastikan ini ada
];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}