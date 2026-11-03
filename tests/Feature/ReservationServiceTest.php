<?php

declare(strict_types=1);

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\TicketTier;
use App\Models\User;
use App\Services\ReservationService;

test('it can reserve tickets when stock is available', function () {
    $user = User::factory()->create();
    $tier = TicketTier::factory()->create(['total_quantity' => 10]);
    $service = app(ReservationService::class);

    $reservation = $service->reserve($user->id, $tier->id, 2);

    $this->assertEquals(2, $reservation->quantity);
    $this->assertEquals($user->id, $reservation->user_id);
    $this->assertEquals(ReservationStatus::PENDING, $reservation->status);
    $this->assertNotNull($reservation->expires_at);
});

test('it throws an exception when there are not enough tickets available', function () {
    $user = User::factory()->create();
    $tier = TicketTier::factory()->create(['total_quantity' => 5]);
    $service = app(ReservationService::class);

    $this->expectException(Exception::class);
    $service->reserve($user->id, $tier->id, 6);
});

test('it ignores expired reservations when calculating available stock', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $tier = TicketTier::factory()->create(['total_quantity' => 5]);

    Reservation::factory()->create([
        'user_id' => $user1->id,
        'ticket_tier_id' => $tier->id,
        'quantity' => 5,
        'status' => 'pending',
        'expires_at' => now()->subMinutes(15),
    ]);

    $service = app(ReservationService::class);

    $reservation = $service->reserve($user2->id, $tier->id, 1);

    $this->assertNotEquals(0, $reservation->quantity);
});
