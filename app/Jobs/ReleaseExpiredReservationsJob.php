<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Actions\Inventory\ReleaseExpiredReservationsAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ReleaseExpiredReservationsJob implements ShouldQueue
{
    use Queueable;

    public function handle(ReleaseExpiredReservationsAction $action): void
    {
        $released = $action->execute();

        if ($released > 0) {
            Log::info("Released {$released} expired ticket reservations back to inventory pool.");
        }
    }
}
