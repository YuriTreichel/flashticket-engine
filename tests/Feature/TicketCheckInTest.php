<?php

declare(strict_types=1);

use App\Actions\Tickets\ValidateTicketCheckInAction;
use App\Enums\TicketStatus;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketTier;
use App\Models\User;
use App\Services\QrCodeSigningService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->organizer = User::factory()->create();
    $this->attendee = User::factory()->create();
    $this->event = Event::factory()->create();
    $this->tier = TicketTier::factory()->create(['event_id' => $this->event->id]);
    $this->qrService = app(QrCodeSigningService::class);
    $this->checkInAction = app(ValidateTicketCheckInAction::class);
});

test('it successfully validates and checks in a valid ticket', function () {
    $ticket = Ticket::create([
        'user_id' => $this->attendee->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::VALID,
    ]);

    $payload = $this->qrService->generateSignedQrPayload($ticket);

    $result = $this->checkInAction->execute($payload, $this->organizer->id);

    expect($result['success'])->toBeTrue()
        ->and($result['message'])->toContain('successfully verified')
        ->and($ticket->fresh()->status)->toBe(TicketStatus::USED)
        ->and($ticket->fresh()->used_at)->not->toBeNull();
});

test('it prevents duplicate check-in of an already used ticket', function () {
    $ticket = Ticket::create([
        'user_id' => $this->attendee->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::USED,
        'used_at' => now()->subMinutes(10),
    ]);

    $payload = $this->qrService->generateSignedQrPayload($ticket);

    $result = $this->checkInAction->execute($payload, $this->organizer->id);

    expect($result['success'])->toBeFalse()
        ->and($result['message'])->toContain('Current status: used');
});

test('it rejects check-in for cancelled or refunded tickets', function () {
    $ticket = Ticket::create([
        'user_id' => $this->attendee->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::REFUNDED,
    ]);

    $payload = $this->qrService->generateSignedQrPayload($ticket);

    $result = $this->checkInAction->execute($payload, $this->organizer->id);

    expect($result['success'])->toBeFalse()
        ->and($result['message'])->toContain('Current status: refunded');
});

test('organizer controller check-in endpoint handles authorization and input', function () {
    $ticket = Ticket::create([
        'user_id' => $this->attendee->id,
        'ticket_tier_id' => $this->tier->id,
        'code' => (string) Str::uuid(),
        'status' => TicketStatus::VALID,
    ]);

    $payload = $this->qrService->generateSignedQrPayload($ticket);

    $response = $this->actingAs($this->organizer)
        ->postJson(route('organizer.events.check-in', $this->event), [
            'qr_payload' => $payload,
        ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    expect($ticket->fresh()->status)->toBe(TicketStatus::USED);
});
