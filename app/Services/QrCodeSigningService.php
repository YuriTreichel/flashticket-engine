<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TicketStatus;
use App\Models\Ticket;

class QrCodeSigningService
{
    /**
     * Generate an HMAC signed payload for a ticket to prevent forgery.
     * Contains ticket code, expiration timestamp, and cryptographic signature.
     */
    public function generateSignedQrPayload(Ticket $ticket, int $validityMinutes = 60): string
    {
        $appKey = (string) config('app.key');
        $expiresAt = now()->addMinutes($validityMinutes)->timestamp;
        $dataToSign = "{$ticket->code}|{$expiresAt}";

        $signature = hash_hmac('sha256', $dataToSign, $appKey);

        return base64_encode(json_encode([
            'code' => $ticket->code,
            'expires_at' => $expiresAt,
            'sig' => $signature,
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * Validate an incoming scanned QR code payload.
     *
     * @return array{valid: bool, reason?: string, ticket?: Ticket}
     */
    public function verifyScannedPayload(string $base64Payload): array
    {
        $decodedJson = base64_decode($base64Payload, true);
        if ($decodedJson === false) {
            return ['valid' => false, 'reason' => 'Invalid QR encoding.'];
        }

        try {
            /** @var array{code: string, expires_at: int, sig: string} $payload */
            $payload = json_decode($decodedJson, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['valid' => false, 'reason' => 'Malformed QR data.'];
        }

        if (! isset($payload['code'], $payload['expires_at'], $payload['sig'])) {
            return ['valid' => false, 'reason' => 'Incomplete QR payload.'];
        }

        $appKey = (string) config('app.key');
        $expectedSignature = hash_hmac('sha256', "{$payload['code']}|{$payload['expires_at']}", $appKey);

        if (! hash_equals($expectedSignature, $payload['sig'])) {
            return ['valid' => false, 'reason' => 'Tampered ticket signature. Potential counterfeit.'];
        }

        if (time() > $payload['expires_at']) {
            return ['valid' => false, 'reason' => 'QR code expired. Please refresh ticket screen.'];
        }

        /** @var Ticket|null $ticket */
        $ticket = Ticket::with(['ticketTier.event', 'user'])->where('code', $payload['code'])->first();

        if ($ticket === null) {
            return ['valid' => false, 'reason' => 'Ticket code not found.'];
        }

        if ($ticket->status !== TicketStatus::VALID) {
            return [
                'valid' => false,
                'reason' => "Ticket is not valid (Current status: {$ticket->status->value}).",
                'ticket' => $ticket,
            ];
        }

        return ['valid' => true, 'ticket' => $ticket];
    }
}
