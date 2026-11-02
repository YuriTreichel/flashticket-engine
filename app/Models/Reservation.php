<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ReservationStatus;
use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $ticket_tier_id
 * @property int $quantity
 * @property ReservationStatus $status
 * @property Carbon|null $expires_at
 * @property-read TicketTier $ticketTier
 * @property-read User $user
 */
class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ticket_tier_id',
        'quantity',
        'status',
        'expires_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ReservationStatus::class,
            'expires_at' => 'datetime',
            'quantity' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<TicketTier, $this>
     */
    public function ticketTier(): BelongsTo
    {
        return $this->belongsTo(TicketTier::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param  Builder<Reservation>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', ReservationStatus::PENDING->value)
            ->where('expires_at', '>', now());
    }

    public function hasExpired(): bool
    {
        return $this->status === ReservationStatus::EXPIRED ||
            ($this->status === ReservationStatus::PENDING && $this->expires_at !== null && $this->expires_at->isPast());
    }
}
