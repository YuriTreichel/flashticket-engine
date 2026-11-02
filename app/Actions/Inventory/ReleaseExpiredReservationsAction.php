<?php

declare(strict_types=1);

namespace App\Actions\Inventory;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

final class ReleaseExpiredReservationsAction
{
    /**
     * Atomically marks all overdue pending reservations as expired,
     * immediately returning inventory to available pool.
     *
     * @return int Count of expired reservations released
     */
    public function execute(): int
    {
        return DB::transaction(function (): int {
            return Reservation::query()
                ->where('status', ReservationStatus::PENDING->value)
                ->where('expires_at', '<=', now())
                ->lockForUpdate()
                ->update([
                    'status' => ReservationStatus::EXPIRED->value,
                    'updated_at' => now(),
                ]);
        });
    }
}
