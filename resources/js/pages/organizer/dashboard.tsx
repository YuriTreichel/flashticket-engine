import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    QrCode,
    Calendar,
    MapPin,
    Ticket,
    ArrowLeft,
    Users,
    TrendingUp,
} from 'lucide-react';

interface EventItem {
    id: number;
    title: string;
    venue: string | null;
    start_time: string | null;
    ticket_tiers: Array<{
        id: number;
        name: string;
        price: number | string;
        total_quantity: number;
        reservations: Array<{
            quantity: number;
            status: string;
        }>;
    }>;
}

interface OrganizerDashboardProps {
    events: {
        data: EventItem[];
    };
}

export default function OrganizerDashboard({
    events,
}: OrganizerDashboardProps) {
    return (
        <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100 md:p-12">
            <Head title="Organizer Portal - FlashTicket Engine" />

            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link href="/">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mb-2 gap-2 text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to
                                Storefront
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-extrabold text-white">
                            Organizer Gate Operations
                        </h1>
                        <p className="text-sm text-zinc-400">
                            Real-time tier occupancy, sales metrics, and gate
                            entry camera scanner.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {events?.data?.map((event) => {
                        const totalCapacity = event.ticket_tiers.reduce(
                            (acc, t) => acc + t.total_quantity,
                            0,
                        );
                        const confirmedTickets = event.ticket_tiers.reduce(
                            (acc, t) =>
                                acc +
                                t.reservations
                                    .filter((r) => r.status === 'confirmed')
                                    .reduce((sum, r) => sum + r.quantity, 0),
                            0,
                        );
                        const occupancyRate =
                            totalCapacity > 0
                                ? Math.round(
                                      (confirmedTickets / totalCapacity) * 100,
                                  )
                                : 0;

                        return (
                            <Card
                                key={event.id}
                                className="border-zinc-800 bg-zinc-900/80 shadow-lg"
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <div>
                                        <Badge
                                            variant="outline"
                                            className="mb-2 border-rose-500/30 bg-rose-500/10 text-rose-400"
                                        >
                                            Live Event
                                        </Badge>
                                        <CardTitle className="text-2xl text-white">
                                            {event.title}
                                        </CardTitle>
                                        <div className="mt-1 flex items-center gap-4 text-xs text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                <span>
                                                    {event.start_time
                                                        ? new Date(
                                                              event.start_time,
                                                          ).toLocaleDateString(
                                                              'en-CA',
                                                              {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  year: 'numeric',
                                                              },
                                                          )
                                                        : 'TBA'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                                                <span>
                                                    {event.venue ||
                                                        'Metro Toronto Convention Centre'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/organizer/events/${event.id}/scanner`}
                                    >
                                        <Button className="gap-2 bg-rose-600 font-bold shadow-lg shadow-rose-600/20 hover:bg-rose-500">
                                            <QrCode className="h-4 w-4" />
                                            Open Gate Scanner
                                        </Button>
                                    </Link>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid gap-4 border-t border-zinc-800 pt-2 sm:grid-cols-3">
                                        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4">
                                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                                <span>Sold Tickets</span>
                                                <Ticket className="h-4 w-4 text-rose-400" />
                                            </div>
                                            <div className="mt-1 text-2xl font-bold text-white">
                                                {confirmedTickets}{' '}
                                                <span className="text-sm font-normal text-zinc-500">
                                                    / {totalCapacity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4">
                                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                                <span>Occupancy Rate</span>
                                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <div className="mt-1 text-2xl font-bold text-emerald-400">
                                                {occupancyRate}%
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4">
                                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                                <span>Active Tiers</span>
                                                <Users className="h-4 w-4 text-amber-400" />
                                            </div>
                                            <div className="mt-1 text-2xl font-bold text-white">
                                                {event.ticket_tiers.length}{' '}
                                                Tiers
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
