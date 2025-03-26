<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FinonacciController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/fibonacci/calculate',[FinonacciController::class,'calculate']);
Route::get('/fibonacci/result/{id}',[FinonacciController::class, 'getResult']);