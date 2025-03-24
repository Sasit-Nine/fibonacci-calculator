<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
});

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->stateless()->user();
        $user = User::where('email', $googleUser->email)->first();
        if(!$user)
        {
            $user = User::create(['name' => $googleUser->name, 'email' => $googleUser->email, 'password' => \Hash::make(rand(100000,999999))]);
        }
    Auth::login($user);
    return redirect('/');
});

Route::middleware(['auth', 'verified'])->get('/', function () {
        return Inertia::render('dashboard');
})->name('home');;

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
