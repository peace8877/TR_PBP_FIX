<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public $timestamps = true; 

    protected $fillable = [
        'user_id', 
        'subtotal', 
        'tax_amount', 
        'total_amount', 
        'payment_method', 
        'status', 
        'transactions_date'
    ];

    // Tambahkan fungsi ini agar relasi 'user' bisa ditemukan
    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    public function details() 
    {
        return $this->hasMany(TransactionDetail::class);
    }
}