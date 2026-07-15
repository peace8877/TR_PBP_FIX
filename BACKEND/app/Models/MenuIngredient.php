<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class MenuIngredient extends Pivot
{
    protected $table = 'menu_ingredients';
    protected $fillable = ['menu_id', 'ingredient_id', 'quantity_needed'];
}