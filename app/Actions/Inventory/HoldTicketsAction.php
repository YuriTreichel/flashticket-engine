<?php

declare(strict_types=1);

namespace App\Actions\Inventory;

use App\DataTransferObjects\HoldTicketsData;
use App\Enums\ReservationStatus;
use App\Exceptions\InsufficientTicketsException;
use App\Models\Reservation;
use App\Models\TicketTier;
use Illuminate\Support\Facades\DB;

final class HoldTicketsAction
{
    public const int DEFAULT_HOLD_MINUTES = 10;

    /**
     * Atomically holds a requested quantity of tickets for a user.
     * Utilizes pessimistic row locking (lockForUpdate) inside a database transaction
     * to guarantee zero overselling under heavy concurrency.
     *
     * @throws InsufficientTicketsException
     */
    public function execute(HoldTicketsData $data, int $holdMinutes = self::DEFAULT_HOLD_MINUTES): Reservation
    {
        return DB::transaction(function () use ($data, $holdMinutes): Reservation {
            /** @var TicketTier $tier */
            $tier = TicketTier::query()
                ->where('id', $data->ticketTierId)
                ->lockForUpdate()
                ->firstOrFail();

            $activeHoldsCount = (int) $tier->reservations()
                ->active()
                ->sum('quantity');

            $confirmedSalesCount = (int) $tier->reservations()
                ->where('status', ReservationStatus::CONFIRMED->value)
                ->sum('quantity');

            $availableTickets = $tier->total_quantity - ($confirmedSalesCount + $activeHoldsCount);

            if ($availableTickets < $data->quantity) {
                throw InsufficientTicketsException::forTier(
                    tierName: (string) $tier->name,
                    requested: $data->quantity,
                    available: max(0, $availableTickets),
                );
            }

            /** @var Reservation $reservation */
            $reservation = Reservation::query()->create([
                'user_id' => $data->userId,
                'ticket_tier_id' => $data->ticketTierId,
                'quantity' => $data->quantity,
                'status' => ReservationStatus::PENDING,
                'expires_at' => now()->addMinutes($holdMinutes),
            ]);

            return $reservation;
        });
    }
}
