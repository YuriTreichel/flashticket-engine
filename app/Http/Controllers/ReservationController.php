<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Tickets\IssueTicketsAction;
use App\Models\Reservation;
use App\Models\User;
use App\Services\CanadianTaxService;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService,
        private readonly CanadianTaxService $taxService,
        private readonly IssueTicketsAction $issueTicketsAction,
    ) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ticket_tier_id' => 'required|integer|exists:ticket_tiers,id',
            'quantity' => 'required|integer|min:1',
        ]);

        /** @var User $user */
        $user = $request->user();

        try {
            $reservation = $this->reservationService->reserve(
                $user->id,
                (int) $validated['ticket_tier_id'],
                (int) $validated['quantity']
            );

            return redirect()->route('reservations.checkout', $reservation)
                ->with('success', 'Hold acquired! Complete your checkout within 10 minutes.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'quantity' => $e->getMessage(),
            ]);
        }
    }

    public function checkout(Request $request, Reservation $reservation): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($reservation->user_id !== $user->id) {
            abort(403);
        }

        if ($reservation->hasExpired()) {
            return redirect()->route('events.show', $reservation->ticket_tier_id)
                ->with('error', 'Your reservation has expired.');
        }

        $reservation->load(['ticketTier.event']);

        return Inertia::render('checkout/show', [
            'reservation' => $reservation,
        ]);
    }

    public function calculateTax(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'postal_code' => 'required|string',
        ]);

        $subtotal = (float) ($reservation->quantity * (float) $reservation->ticketTier->price);

        try {
            $province = $this->taxService->detectProvinceFromPostalCode($validated['postal_code']);
            $taxResult = $this->taxService->calculate($subtotal, $province);

            return response()->json([
                'success' => true,
                'tax' => $taxResult->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function completeCheckout(Request $request, Reservation $reservation): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($reservation->user_id !== $user->id) {
            abort(403);
        }

        if ($reservation->hasExpired()) {
            return redirect()->route('home')->with('error', 'Reservation expired.');
        }

        // Issue tickets in ACID transaction
        $this->issueTicketsAction->execute($reservation);

        return redirect()->route('tickets.index')->with('success', 'Payment successful! Your tickets are ready.');
    }

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $reservations = $user
            ->reservations()
            ->with(['ticketTier.event'])
            ->active()
            ->latest()
            ->paginate(15);

        return Inertia::render('Reservation/Index', [
            'reservations' => $reservations,
        ]);
    }
}
