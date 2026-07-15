<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['user_id', 'subtotal', 'tax_amount', 'total_amount', 'payment_method', 'status', 'transactions_date'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function details() {
        return $this->hasMany(TransactionDetail::class);
    }
}
