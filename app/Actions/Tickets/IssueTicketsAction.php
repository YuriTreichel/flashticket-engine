<?php

declare(strict_types=1);

namespace App\Actions\Tickets;

use App\Enums\ReservationStatus;
use App\Enums\TicketStatus;
use App\Models\Reservation;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class IssueTicketsAction
{
    /**
     * Issues individual tickets for a confirmed reservation inside an ACID transaction.
     *
     * @return Collection<int, Ticket>
     */
    public function execute(Reservation $reservation): Collection
    {
        return DB::transaction(function () use ($reservation): Collection {
            $reservation->refresh();

            if ($reservation->status !== ReservationStatus::CONFIRMED) {
                $reservation->update(['status' => ReservationStatus::CONFIRMED]);
            }

            $createdTickets = [];

            for ($i = 0; $i < $reservation->quantity; $i++) {
                $createdTickets[] = Ticket::create([
                    'user_id' => $reservation->user_id,
                    'ticket_tier_id' => $reservation->ticket_tier_id,
                    'code' => (string) Str::uuid(),
                    'status' => TicketStatus::VALID,
                ]);
            }

            return new Collection($createdTickets);
        });
    }
}

