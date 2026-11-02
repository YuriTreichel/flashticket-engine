<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property Carbon|null $start_time
 * @property Carbon|null $end_time
 * @property string|null $venue
 * @property string $status
 * @property-read Collection<int, TicketTier> $ticketTiers
 */
class Event extends Model
{
    /** @use HasFactory<EventFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return HasMany<TicketTier, $this>
     */
    public function ticketTiers(): HasMany
    {
        return $this->hasMany(TicketTier::class);
    }
}
