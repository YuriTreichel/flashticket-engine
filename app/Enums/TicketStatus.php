<?php

declare(strict_types=1);

namespace App\Enums;

enum TicketStatus: string
{
    case VALID = 'valid';
    case USED = 'used';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';

    public function isUsable(): bool
    {
        return $this === self::VALID;
    }
}
