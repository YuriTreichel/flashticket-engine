<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $ticket_tier_id
 * @property string $name
 * @property string $category
 * @property float|string $discount_percent
 * @property bool $requires_id_proof
 * @property-read TicketTier $ticketTier
 */
class TicketVariant extends Model
{
    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discount_percent' => 'float',
            'requires_id_proof' => 'boolean',
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
     * Calculate adjusted price after discount.
     */
    public function calculateFinalPrice(float $basePrice): float
    {
        $discount = ($basePrice * (float) $this->discount_percent) / 100.0;

        return max(0.0, round($basePrice - $discount, 2));
    }
}
