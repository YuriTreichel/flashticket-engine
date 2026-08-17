<?php

namespace Database\Factories;

use App\Models\TicketTier;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketTier>
 */
class TicketTierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker()->sentence(2),
            'price' => $this->faker()->randomFloat(2, 100, 1000),
            'total_quantity' => $this->faker()->numberBetween(1, 100),
            'event_id' => Event::factory()
        ];
    }
}
