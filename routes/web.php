<?php

declare(strict_types=1);

use App\Http\Controllers\EventController;
use App\Http\Controllers\OrganizerController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Organizer Portal & Gate Check-in
    Route::prefix('organizer')->name('organizer.')->group(function () {
        Route::get('/dashboard', [OrganizerController::class, 'dashboard'])->name('dashboard');
        Route::get('/events/{event}/scanner', [OrganizerController::class, 'scanner'])->name('events.scanner');
        Route::post('/events/{event}/check-in', [OrganizerController::class, 'checkIn'])->name('events.check-in');
    });
});

require __DIR__.'/settings.php';
