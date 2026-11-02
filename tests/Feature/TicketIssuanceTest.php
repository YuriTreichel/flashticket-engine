<?php

declare(strict_types=1);

use App\Actions\Tickets\IssueTicketsAction;
use App\Enums\ReservationStatus;
use App\Enums\TicketStatus;
use App\Models\Event;
use App\Models\Reservation;
use App\Models\Ticket;
use App\Models\TicketTier;
use App\Models\User;
use App\Services\QrCodeSigningService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->event = Event::factory()->create();
    $this->tier = TicketTier::factory()->create([
        'event_id' => $this->event->id,
        'total_quantity' => 20,
    ]);
});

test('it issues unique tickets for a confirmed reservation', function () {
    $reservation = Reservation::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'quantity' => 3,
        'status' => ReservationStatus::PENDING,
        'expires_at' => now()->addMinutes(10),
    ]);

    $action = app(IssueTicketsAction::class);
    $tickets = $action->execute($reservation);

    expect($tickets)->toHaveCount(3)
        ->and($reservation->fresh()->status)->toBe(ReservationStatus::CONFIRMED);

    foreach ($tickets as $ticket) {
        expect($ticket->user_id)->toBe($this->user->id)
            ->and($ticket->ticket_tier_id)->toBe($this->tier->id)
            ->and($ticket->status)->toBe(TicketStatus::VALID)
            ->and($ticket->code)->toBeString();
    }
});

test('it signs and verifies authentic QR codes', function () {
    $ticket = Ticket::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::VALID,
    ]);

    $qrService = app(QrCodeSigningService::class);
    $payload = $qrService->generateSignedQrPayload($ticket, validityMinutes: 30);

    $verification = $qrService->verifyScannedPayload($payload);

    expect($verification['valid'])->toBeTrue()
        ->and($verification['ticket']->id)->toBe($ticket->id);
});

test('it rejects tampered QR payloads', function () {
    $ticket = Ticket::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::VALID,
    ]);

    $qrService = app(QrCodeSigningService::class);
    $payload = $qrService->generateSignedQrPayload($ticket);

    // Tamper the payload JSON
    $decoded = json_decode(base64_decode($payload), true);
    $decoded['code'] = (string) Str::uuid(); // Alter code without re-signing
    $tamperedPayload = base64_encode(json_encode($decoded));

    $verification = $qrService->verifyScannedPayload($tamperedPayload);

    expect($verification['valid'])->toBeFalse()
        ->and($verification['reason'])->toContain('Tampered ticket signature');
});

test('it rejects expired QR codes', function () {
    $ticket = Ticket::create([
        'user_id' => $this->user->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::VALID,
    ]);

    $qrService = app(QrCodeSigningService::class);
    // Negative validity (already expired)
    $payload = $qrService->generateSignedQrPayload($ticket, validityMinutes: -5);

    $verification = $qrService->verifyScannedPayload($payload);

    expect($verification['valid'])->toBeFalse()
        ->and($verification['reason'])->toContain('QR code expired');
});

