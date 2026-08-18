<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\TicketTier;
use Illuminate\Support\Facades\DB;
use Exception;

class ReservationService
{
    public function reserve(int $userId, int $ticketTierId, int $quantity): Reservation
    {
        return DB::transaction(function () use ($userId, $ticketTierId, $quantity) {
            $tier = TicketTier::where('id', $ticketTierId)->lockForUpdate()->firstOrFail();

            $activeReservations = $tier->reservations()->active()->sum('quantity');
            $confirmedQuantity = $tier->reservations()->where('status', 'confirmed')->sum('quantity');

            $availableTickets = $tier->total_quantity - ($confirmedQuantity + $activeReservations);

            if ($availableTickets < $quantity) {
                throw new Exception('Desculpe, não há ingressos suficientes.');
            }

            $reservation = Reservation::create([
                'user_id' => $userId,
                'ticket_tier_id' => $ticketTierId,
                'quantity' => $quantity,
                'status' => 'pending',
                'expires_at' => now()->addMinutes(10),
            ]);

            return $reservation;
        });
    }
}
