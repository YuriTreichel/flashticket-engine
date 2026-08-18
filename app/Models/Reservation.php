<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'ticket_tier_id',
        'quantity',
        'expires_at',
    ];

    public function ticketTier()
    {
        return $this->belongsTo(TicketTier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'pending')->where('expires_at', '>', now());
    }

    public function hasExpired()
    {
        return $this->status === 'expired' || ($this->status === 'pending' && $this->expires_at <= now());
    }
}
