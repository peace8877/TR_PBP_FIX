<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = ['category_id', 'name', 'description', 'price', 'is_available', 'image_url'];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function ingredients() {
        return $this->belongsToMany(Ingredient::class, 'menu_ingredients')
                    ->withPivot('quantity_needed')
                    ->withTimestamps();
    }
}
