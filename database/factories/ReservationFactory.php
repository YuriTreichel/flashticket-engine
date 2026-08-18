<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\TicketTier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'ticket_tier_id' => TicketTier::factory(),
            'quantity' => 1,
            'status' => 'pending',
            'expires_at' => now()->addMinutes(10),
        ];
    }
}
