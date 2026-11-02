<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class InsufficientTicketsException extends Exception
{
    public static function forTier(string $tierName, int $requested, int $available): self
    {
        return new self("Cannot reserve {$requested} tickets for tier '{$tierName}'. Only {$available} available.");
    }
}
