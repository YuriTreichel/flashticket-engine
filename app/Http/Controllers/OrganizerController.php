<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Tickets\ValidateTicketCheckInAction;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\JsonResponse;
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
