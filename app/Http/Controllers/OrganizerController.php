<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Tickets\ValidateTicketCheckInAction;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizerController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $events = Event::with('ticketTiers.reservations')
            ->latest()
            ->paginate(10);

        return Inertia::render('organizer/dashboard', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('organizer/events/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'category' => 'required|string',
            'image_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'tiers' => 'required|array|min:1',
            'tiers.*.name' => 'required|string',
            'tiers.*.price' => 'required|numeric|min:0',
            'tiers.*.total_quantity' => 'required|integer|min:1',
        ]);

        $event = Event::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'],
            'category' => $validated['category'],
            'image_url' => $validated['image_url'] ?? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
        ]);

        foreach ($validated['tiers'] as $tier) {
            TicketTier::create([
                'event_id' => $event->id,
                'name' => $tier['name'],
                'price' => $tier['price'],
                'total_quantity' => $tier['total_quantity'],
            ]);
        }

        return redirect()->route('organizer.dashboard')->with('success', 'Event successfully created and published!');
    }

    public function scanner(Event $event): Response
    {
        return Inertia::render('organizer/scanner', [
            'event' => $event,
        ]);
    }

    public function checkIn(
        Request $request,
        Event $event,
        ValidateTicketCheckInAction $action
    ): JsonResponse {
        $validated = $request->validate([
            'qr_payload' => 'required|string',
        ]);

        /** @var User $user */
        $user = $request->user();

        $result = $action->execute(
            qrPayload: (string) $validated['qr_payload'],
            organizerId: $user->id
        );

        $status = $result['success'] ? 200 : 422;

        return response()->json($result, $status);
    }
}
