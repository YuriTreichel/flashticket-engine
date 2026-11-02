<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

final readonly class HoldTicketsData
{
    public function __construct(
        public int $userId,
        public int $ticketTierId,
        public int $quantity,
        public ?string $idempotencyKey = null,
    ) {
        if ($quantity <= 0) {
            throw new \InvalidArgumentException('Quantity must be greater than zero.');
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            ticketTierId: (int) $data['ticket_tier_id'],
            quantity: (int) $data['quantity'],
            idempotencyKey: isset($data['idempotency_key']) ? (string) $data['idempotency_key'] : null,
        );
    }
}
