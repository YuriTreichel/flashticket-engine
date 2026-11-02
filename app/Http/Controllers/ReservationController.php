<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ReservationController extends Controller
{
    public function __construct(private readonly ReservationService $reservationService) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ticket_tier_id' => 'required|integer|exists:ticket_tiers,id',
            'quantity'       => 'required|integer|min:1',
        ]);

        /** @var User $user */
        $user = $request->user();

        try {
            $this->reservationService->reserve(
                $user->id,
                (int) $validated['ticket_tier_id'],
                (int) $validated['quantity']
            );

            return redirect()->back()->with('success', 'Ingressos reservados com sucesso!');
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'quantity' => $e->getMessage(),
            ]);
        }
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

        return inertia('Reservation/Index', [
            'reservations' => $reservations,
        ]);
    }
}
