import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Ticket,
    Zap,
    ArrowRight,
    ShieldCheck,
    Flame,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface EventItem {
    id: number;
    title: string;
    description: string | null;
    venue: string | null;
    start_time: string | null;
    ticket_tiers?: Array<{
        id: number;
        name: string;
        price: number | string;
        total_quantity: number;
    }>;
}

interface WelcomeProps {
    events: {
        data: EventItem[];
        links: any[];
    };
    auth: {
        user: { id: number; name: string } | null;
    };
}

export default function Welcome({ events, auth }: WelcomeProps) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-rose-500 selection:text-white">
            <Head title="FlashTicket Engine - High Concurrency Ticketing" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 shadow-lg shadow-rose-500/20">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight text-white">
                                FlashTicket
                            </span>
                            <span className="ml-1 text-xs font-semibold tracking-wider text-rose-400 uppercase">
                                Engine
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <>
                                <Link href="/my-tickets">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                                    >
                                        <Ticket className="h-4 w-4 text-rose-400" />
                                        My Tickets
                                    </Button>
                                </Link>
                                <Link href="/organizer/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        Organizer Portal
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-300 hover:text-white"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="bg-rose-600 font-semibold shadow-md shadow-rose-600/30 hover:bg-rose-500"
                                    >
                                        Create Account
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 pt-16 pb-20 text-center">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-zinc-950 to-zinc-950" />

                <div className="mx-auto max-w-3xl">
                    <Badge
                        variant="outline"
                        className="mb-4 gap-2 border-rose-500/30 bg-rose-500/10 px-3 py-1 text-rose-300"
                    >
                        <Flame className="h-3.5 w-3.5" /> High-Concurrency Event
                        Ticketing
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        Lightning-Fast Ticketing. <br />
                        <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">
                            Zero Overselling Guarantee.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                        Experience real-time ticket holds, automated 10-minute
                        cart releases, Canadian multi-province tax computation,
                        and HMAC-signed mobile QR gate scanners.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <span>Pessimistic DB Row Locking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-amber-400" />
                            <span>500+ Req/Sec Flash Sale Tested</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-rose-400" />
                            <span>Cryptographic QR Anti-Fraud</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Catalog */}
            <main className="mx-auto max-w-7xl px-6 pb-24">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            Live & Upcoming Events
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Reserve your spot before flash tiers sell out.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events?.data?.map((event) => {
                        const lowestPrice = event.ticket_tiers?.length
                            ? Math.min(
                                  ...event.ticket_tiers.map((t) =>
                                      Number(t.price),
                                  ),
                              )
                            : null;

                        return (
                            <Card
                                key={event.id}
                                className="group relative overflow-hidden border-zinc-800 bg-zinc-900/60 backdrop-blur transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-rose-950/20"
                            >
                                <div className="relative flex h-40 w-full flex-col justify-end bg-gradient-to-br from-zinc-800 to-zinc-900 p-6">
                                    <div className="absolute top-4 right-4">
                                        <Badge
                                            variant="secondary"
                                            className="bg-zinc-800/80 text-zinc-300"
                                        >
                                            {event.ticket_tiers?.length || 0}{' '}
                                            Tiers
                                        </Badge>
                                    </div>
                                    <h3 className="line-clamp-1 text-xl font-bold text-white transition-colors group-hover:text-rose-400">
                                        {event.title}
                                    </h3>
                                </div>

                                <CardContent className="p-6">
                                    <p className="mb-4 line-clamp-2 min-h-[40px] text-sm text-zinc-400">
                                        {event.description ||
                                            'Exclusive live experience with state-of-the-art production.'}
                                    </p>

                                    <div className="mb-6 space-y-2 text-sm text-zinc-300">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-zinc-500" />
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
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-zinc-500" />
                                            <span>
                                                {event.venue ||
                                                    'Metro Toronto Convention Centre'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                                        <div>
                                            <span className="text-xs text-zinc-500">
                                                Starting from
                                            </span>
                                            <div className="text-lg font-bold text-white">
                                                {lowestPrice !== null
                                                    ? `CAD $${lowestPrice.toFixed(2)}`
                                                    : 'Free'}
                                            </div>
                                        </div>
                                        <Link href={`/events/${event.id}`}>
                                            <Button
                                                size="sm"
                                                className="gap-1.5 bg-rose-600 font-semibold hover:bg-rose-500"
                                            >
                                                Book Tickets
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
