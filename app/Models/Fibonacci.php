<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fibonacci extends Model
{
    use HasFactory;
    protected $table = 'fibo';
    protected $fillable = ['user_id', 'index', 'value', 'status'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
