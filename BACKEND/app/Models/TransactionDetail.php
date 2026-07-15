<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    protected $fillable = ['menu_id', 'transaction_id', 'quantity', 'price', 'subtotal'];

    public function transaction() {
        return $this->belongsTo(Transaction::class);
    }

    public function menu() {
        return $this->belongsTo(Menu::class);
    }
}