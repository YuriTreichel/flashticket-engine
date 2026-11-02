<?php

declare(strict_types=1);

use App\Actions\Inventory\HoldTicketsAction;
use App\Actions\Inventory\ReleaseExpiredReservationsAction;
use App\DataTransferObjects\HoldTicketsData;
use App\Enums\ReservationStatus;
use App\Exceptions\InsufficientTicketsException;
use App\Models\Event;
use App\Models\Reservation;
use App\Models\TicketTier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->event = Event::factory()->create();
    $this->tier = TicketTier::factory()->create([
        'event_id' => $this->event->id,
        'name' => 'General Admission',
        'total_quantity' => 10,
        'price' => 50.00,
    ]);
});

test('it holds tickets successfully when capacity is available', function () {
    $action = app(HoldTicketsAction::class);
    $data = new HoldTicketsData(
        userId: $this->user->id,
        ticketTierId: $this->tier->id,
        quantity: 4,
    );

    $reservation = $action->execute($data, holdMinutes: 10);

    expect($reservation)->toBeInstanceOf(Reservation::class)
        ->and($reservation->user_id)->toBe($this->user->id)
        ->and($reservation->ticket_tier_id)->toBe($this->tier->id)
        ->and($reservation->quantity)->toBe(4)
        ->and($reservation->status)->toBe(ReservationStatus::PENDING)
        ->and($reservation->expires_at)->toBeGreaterThan(now())
        ->and($reservation->hasExpired())->toBeFalse();
});

test('it throws InsufficientTicketsException when requested exceeds total quantity', function () {
    $action = app(HoldTicketsAction::class);
    $data = new HoldTicketsData(
        userId: $this->user->id,
        ticketTierId: $this->tier->id,
        quantity: 11, // Total is 10
    );

    $action->execute($data);
})->throws(InsufficientTicketsException::class);

test('it accounts for active unexpired reservations when checking availability', function () {
    $action = app(HoldTicketsAction::class);

    // User 1 holds 7 tickets
    $action->execute(new HoldTicketsData(
        userId: $this->user->id,
        ticketTierId: $this->tier->id,
        quantity: 7,
    ));

    $user2 = User::factory()->create();

    // User 2 tries to hold 4 tickets (only 3 left) -> should fail
    $action->execute(new HoldTicketsData(
        userId: $user2->id,
        ticketTierId: $this->tier->id,
        quantity: 4,
    ));
})->throws(InsufficientTicketsException::class);

test('it ignores expired reservations when calculating availability', function () {
    // Manually create an expired reservation of 8 tickets
    Reservation::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'quantity' => 8,
        'status' => ReservationStatus::PENDING,
        'expires_at' => now()->subMinutes(5),
    ]);

    $action = app(HoldTicketsAction::class);
    $user2 = User::factory()->create();

    // Available should still be 10 because the hold expired
    $reservation = $action->execute(new HoldTicketsData(
        userId: $user2->id,
        ticketTierId: $this->tier->id,
        quantity: 5,
    ));

    expect($reservation->quantity)->toBe(5);
});

test('it releases expired reservations in batch', function () {
    // Create 2 expired reservations
    Reservation::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'quantity' => 3,
        'status' => ReservationStatus::PENDING,
        'expires_at' => now()->subMinute(),
    ]);

    Reservation::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'quantity' => 2,
        'status' => ReservationStatus::PENDING,
        'expires_at' => now()->subMinutes(15),
    ]);

    // Create 1 active reservation
    Reservation::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'quantity' => 1,
        'status' => ReservationStatus::PENDING,
        'expires_at' => now()->addMinutes(10),
    ]);

    $releaseAction = app(ReleaseExpiredReservationsAction::class);
    $releasedCount = $releaseAction->execute();

    expect($releasedCount)->toBe(2)
        ->and(Reservation::where('status', ReservationStatus::EXPIRED)->count())->toBe(2)
        ->and(Reservation::where('status', ReservationStatus::PENDING)->count())->toBe(1);
});
