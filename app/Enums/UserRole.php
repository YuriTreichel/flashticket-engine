<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case ORGANIZER = 'organizer';
    case CUSTOMER = 'customer';

    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    public function isOrganizer(): bool
    {
        return $this === self::ORGANIZER;
    }

    public function isCustomer(): bool
    {
        return $this === self::CUSTOMER;
    }
}
