<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->text('name');
        $table->timestamps(); // otomatis mencakup created_at & updated_at dengan tipe timestamptz bawaan Laravel/Postgres jika dikonfigurasi
    });
}
};
