<?php

declare(strict_types=1);

use App\Http\Controllers\EventController;
use App\Http\Controllers\OrganizerController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// Public Showcase & Catalog
Route::get('/', [EventController::class, 'index'])->name('home');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
Route::get('/architecture', [PlatformController::class, 'architecture'])->name('architecture');
Route::get('/metrics', [PlatformController::class, 'metrics'])->name('metrics');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations/{reservation}/checkout', [ReservationController::class, 'checkout'])->name('reservations.checkout');
    Route::post('/reservations/{reservation}/tax', [ReservationController::class, 'calculateTax'])->name('reservations.tax');
    Route::post('/reservations/{reservation}/pay', [ReservationController::class, 'completeCheckout'])->name('reservations.pay');

    Route::get('/my-tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Organizer Portal & Gate Check-in
    Route::prefix('organizer')->name('organizer.')->group(function () {
        Route::get('/dashboard', [OrganizerController::class, 'dashboard'])->name('dashboard');
        Route::get('/events/create', [OrganizerController::class, 'create'])->name('events.create');
        Route::post('/events', [OrganizerController::class, 'store'])->name('events.store');
        Route::get('/events/{event}/scanner', [OrganizerController::class, 'scanner'])->name('events.scanner');
        Route::post('/events/{event}/check-in', [OrganizerController::class, 'checkIn'])->name('events.check-in');
    });
});

require __DIR__.'/settings.php';
