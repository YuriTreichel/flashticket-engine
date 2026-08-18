<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function show(Event $event)
    {
        $event->load('ticketTiers');

        $ticketTiers = $event->ticketTiers->map(function ($tier) {
            $activeReservations = $tier->reservations()->active()->sum('quantity');
            $confirmedQuantity = $tier->reservations()->where('status', 'confirmed')->sum('quantity');
            
            $available = $tier->total_quantity - ($confirmedQuantity + $activeReservations);
            
            // Append virtual properties for the frontend
            $tier->available_quantity = max(0, (int) $available);
            $tier->is_available = $available > 0;
            
            return $tier;
        });

        return Inertia::render('event/show', [
            'event' => $event,
            'ticketTiers' => $ticketTiers,
        ]);
    }
}
