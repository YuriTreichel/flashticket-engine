<?php

namespace App\Http\Controllers;

use App\Services\ReservationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function __construct(private ReservationService $reservationService) {}

    public function store(Request $request)
    {
        $request->validate([
            'ticket_tier_id' => 'required|exists:ticket_tiers,id',
            'quantity'       => 'required|integer|min:1',
        ]);

        try {
            $reservation = $this->reservationService->reserve(
                $request->user()->id,
                $request->ticket_tier_id,
                $request->quantity
            );

            return redirect()->back()->with('success', 'Ingressos reservados com sucesso!');
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'quantity' => $e->getMessage(),
            ]);
        }
    }

    public function index(Request $request)
    {
        $reservations = $request->user()
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
