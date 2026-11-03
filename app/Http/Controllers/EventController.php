<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ReservationStatus;
use App\Models\Event;
use App\Models\TicketTier;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $events = Event::query()
            ->with('ticketTiers')
            ->latest()
            ->paginate(12);

        return Inertia::render('welcome', [
            'events' => $events,
        ]);
    }

    public function show(Event $event): Response
    {
        $event->load('ticketTiers');

        $ticketTiers = $event->ticketTiers->map(function (TicketTier $tier): TicketTier {
            $activeReservations = (int) $tier->reservations()->active()->sum('quantity');
            $confirmedQuantity = (int) $tier->reservations()->where('status', ReservationStatus::CONFIRMED->value)->sum('quantity');

            $available = $tier->total_quantity - ($confirmedQuantity + $activeReservations);

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
