<?php

declare(strict_types=1);

namespace App\Services;

use App\Actions\Inventory\HoldTicketsAction;
use App\DataTransferObjects\HoldTicketsData;
use App\Models\Reservation;

class ReservationService
{
    public function __construct(
        private readonly HoldTicketsAction $holdTicketsAction,
    ) {}

    public function reserve(int $userId, int $ticketTierId, int $quantity): Reservation
    {
        $dto = new HoldTicketsData(
            userId: $userId,
            ticketTierId: $ticketTierId,
            quantity: $quantity,
        );

        return $this->holdTicketsAction->execute($dto);
    }
}
