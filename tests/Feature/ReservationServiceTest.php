<?php

use App\Models\User;
use App\Models\TicketTier;
use App\Models\Reservation;
use App\Services\ReservationService;

test('it can reserve tickets when stock is available', function () {
    $user = User::factory()->create();
    $tier = TicketTier::factory()->create(['total_quantity' => 10]);
    $service = new ReservationService();
    
    $reservation = $service->reserve($user->id, $tier->id, 2);
    
    $this->assertEquals(2, $reservation->quantity);
    $this->assertEquals($user->id, $reservation->user_id);
    $this->assertEquals('pending', $reservation->status);
    $this->assertNotNull($reservation->expires_at);
});

test('it throws an exception when there are not enough tickets available', function () {
    $user = User::factory()->create();
    $tier = TicketTier::factory()->create(['total_quantity' => 5]);
    $service = new ReservationService();

    $this->expectException(Exception::class);
    $service->reserve($user->id, $tier->id, 6);
});

test('it ignores expired reservations when calculating available stock', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $tier = TicketTier::factory()->create(['total_quantity' => 5]);

    Reservation::factory()->create([
        'user_id'        => $user1->id,
        'ticket_tier_id' => $tier->id,
        'quantity'       => 5,
        'status'         => 'pending',
        'expires_at'     => now()->subMinutes(15),
    ]);

    $service = new ReservationService();

    $reservation = $service->reserve($user2->id, $tier->id, 1);

    $this->assertNotEquals(0, $reservation->quantity);
});

