<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Organization;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * SaaS Platform Admin Overview Dashboard
     */
    public function dashboard(Request $request): Response
    {
        $organizations = Organization::with('user')
            ->withCount('events')
            ->latest()
            ->get();

        $totalOrganizations = $organizations->count();
        $totalEvents = Event::count();
        $totalTicketsSold = Ticket::where('status', 'valid')->orWhere('status', 'used')->count();

        // Estimated Gross Volume (sum of tickets)
        $grossVolume = Ticket::join('ticket_tiers', 'tickets.ticket_tier_id', '=', 'ticket_tiers.id')
            ->sum('ticket_tiers.price');

        // 5% SaaS commission
        $platformEarnings = (float) $grossVolume * 0.05;

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'total_organizations' => $totalOrganizations,
                'total_events' => $totalEvents,
                'tickets_sold' => $totalTicketsSold,
                'gross_volume' => (float) $grossVolume,
                'platform_earnings' => $platformEarnings,
            ],
            'organizations' => $organizations,
        ]);
    }
}
