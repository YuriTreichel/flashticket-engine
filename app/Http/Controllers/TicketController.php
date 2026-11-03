<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Services\QrCodeSigningService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function __construct(
        private readonly QrCodeSigningService $qrCodeSigningService,
    ) {}

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $tickets = Ticket::query()
            ->where('user_id', $user->id)
            ->with(['ticketTier.event'])
            ->latest()
            ->get()
            ->map(function (Ticket $ticket): array {
                return [
                    'id' => $ticket->id,
                    'code' => $ticket->code,
                    'status' => $ticket->status->value,
                    'used_at' => $ticket->used_at?->toIso8601String(),
                    'created_at' => $ticket->created_at?->toIso8601String(),
                    'qr_payload' => $this->qrCodeSigningService->generateSignedQrPayload($ticket),
                    'tier_name' => $ticket->ticketTier->name,
                    'event_title' => $ticket->ticketTier->event->title,
                    'event_venue' => $ticket->ticketTier->event->venue,
                    'event_start' => $ticket->ticketTier->event->start_time?->toIso8601String(),
                ];
            });

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }
}

