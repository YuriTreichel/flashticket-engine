<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\TicketTierFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $event_id
 * @property string $name
 * @property float|string $price
 * @property int $total_quantity
 * @property int|null $available_quantity
 * @property bool|null $is_available
 * @property-read Event $event
 * @property-read Collection<int, Reservation> $reservations
 * @property-read Collection<int, Ticket> $tickets
 */
class TicketTier extends Model
{
    /** @use HasFactory<TicketTierFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * @return HasMany<Reservation, $this>
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * @return HasMany<Ticket, $this>
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * @return HasMany<TicketVariant, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(TicketVariant::class);
    }
}
