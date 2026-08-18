<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\EventController;

Route::inertia('/', 'welcome')->name('home');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
