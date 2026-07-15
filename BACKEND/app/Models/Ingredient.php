<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = ['name', 'stock_quantity', 'unit', 'image_url'];

    public function menus() {
        return $this->belongsToMany(Menu::class, 'menu_ingredients')
                    ->withPivot('quantity_needed')
                    ->withTimestamps();
    }
}