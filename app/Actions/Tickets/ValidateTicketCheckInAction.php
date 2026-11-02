<?php

declare(strict_types=1);

namespace App\Actions\Tickets;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\QrCodeSigningService;
use Illuminate\Support\Facades\DB;

final class ValidateTicketCheckInAction
{
    public function __construct(
        private readonly QrCodeSigningService $qrCodeSigningService,
    ) {}

    /**
     * Verifies the QR signature and performs an atomic check-in of the ticket.
     *
     * @return array{
     *     success: bool,
     *     message: string,
     *     ticket?: Ticket,
     *     already_used_at?: string
     * }
     */
    public function execute(string $qrPayload, int $organizerId): array
    {
        $verification = $this->qrCodeSigningService->verifyScannedPayload($qrPayload);

        if (! $verification['valid']) {
            return [
                'success' => false,
                'message' => $verification['reason'] ?? 'Invalid QR payload.',
            ];
        }

        /** @var Ticket $ticket */
        $ticket = $verification['ticket'];

        return DB::transaction(function () use ($ticket): array {
            /** @var Ticket $lockedTicket */
            $lockedTicket = Ticket::query()
                ->where('id', $ticket->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedTicket->status === TicketStatus::USED) {
                return [
                    'success' => false,
                    'message' => 'Ticket already checked-in!',
                    'ticket' => $lockedTicket,
                    'already_used_at' => $lockedTicket->used_at?->toIso8601String(),
                ];
            }

            if ($lockedTicket->status !== TicketStatus::VALID) {
                return [
                    'success' => false,
                    'message' => "Ticket cannot be used (Status: {$lockedTicket->status->value}).",
                    'ticket' => $lockedTicket,
                ];
            }

            $lockedTicket->update([
                'status' => TicketStatus::USED,
                'used_at' => now(),
            ]);

            return [
                'success' => true,
                'message' => 'Ticket successfully verified and checked-in!',
                'ticket' => $lockedTicket->fresh(['user', 'ticketTier.event']),
            ];
        });
    }
}
