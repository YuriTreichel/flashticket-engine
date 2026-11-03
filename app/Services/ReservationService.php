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

    public function reserve(int $userId, int $ticketTierId, int $quantity, ?int $ticketVariantId = null): Reservation
    {
        $dto = new HoldTicketsData(
            userId: $userId,
            ticketTierId: $ticketTierId,
            quantity: $quantity,
            ticketVariantId: $ticketVariantId,
        );

        return $this->holdTicketsAction->execute($dto);
    }
}
