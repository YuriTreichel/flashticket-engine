import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Ticket,
    Zap,
    ArrowRight,
    Search,
    Sparkles,
    Flame,
    Music,
    Cpu,
    Utensils,
    Film,
    Filter,
    ShieldCheck,
    Clock,
    Lock,
    QrCode,
    Activity,
    CreditCard,
    CheckCircle2,
    Users,
    Compass,
    HelpCircle,
    ChevronRight,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/storefront-layout';

interface EventItem {
    id: number;
    name: string;
    description: string | null;
    location: string;
    image_url: string | null;
    category: string;
    start_date: string;
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
    };
    auth: {
        user: { id: number; name: string; email: string } | null;
    };
}

const CATEGORIES = [
    { label: 'All Events', icon: Sparkles, value: 'All' },
    { label: 'Technology', icon: Cpu, value: 'Technology' },
    { label: 'Music & Shows', icon: Music, value: 'Music' },
    { label: 'Food & Drink', icon: Utensils, value: 'Food & Drink' },
    { label: 'Arts & Film', icon: Film, value: 'Arts & Film' },
];

const CITIES = [
    { name: 'Toronto, ON', eventsCount: '3 Events' },
    { name: 'Vancouver, BC', eventsCount: '1 Event' },
    { name: 'Montréal, QC', eventsCount: '1 Event' },
    { name: 'Calgary, AB', eventsCount: '1 Event' },
];

export default function Welcome({ events, auth }: WelcomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredEvents = useMemo(() => {
        return (events?.data || []).filter((event) => {
            const matchesCategory =
                selectedCategory === 'All' ||
                event.category?.toLowerCase() ===
                    selectedCategory.toLowerCase();

            const matchesSearch =
                event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                event.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [events?.data, selectedCategory, searchQuery]);

    const featuredEvent = events?.data?.[0];

    return (
        <StorefrontLayout
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        >
            <Head title="FlashTicket — Experience Live Events Without the Queue" />

            {/* 2. Hero Spotlight Banner */}
            {featuredEvent && (
                <section className="relative px-6 pt-6 pb-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/50 shadow-2xl">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={featuredEvent.image_url || ''}
                                    alt={featuredEvent.name}
                                    className="h-full w-full object-cover object-center brightness-40 transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent" />
                            </div>

                            <div className="relative z-10 flex min-h-[440px] max-w-2xl flex-col justify-end p-8 sm:p-14">
                                <div className="mb-3 flex items-center gap-2">
                                    <Badge className="gap-1.5 border-rose-500/30 bg-rose-500/20 px-3 py-1 font-semibold text-rose-300 backdrop-blur-md">
                                        <Flame className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
                                        Trending Flash Sale
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-white/20 text-zinc-300 backdrop-blur-md"
                                    >
                                        {featuredEvent.category}
                                    </Badge>
                                </div>

                                <h1 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl">
                                    {featuredEvent.name}
                                </h1>

                                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
                                    {featuredEvent.description}
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-rose-400" />
                                        <span>
                                            {new Date(
                                                featuredEvent.start_date,
                                            ).toLocaleDateString('en-CA', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-rose-400" />
                                        <span className="max-w-[280px] truncate">
                                            {featuredEvent.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-4">
                                    <Link href={`/events/${featuredEvent.id}`}>
                                        <Button className="h-11 gap-2 rounded-xl bg-rose-600 px-6 font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500">
                                            Reserve Tickets
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 3. Category Filter Pills */}
            <section className="px-6 pb-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.value;

                            return (
                                <button
                                    key={cat.value}
                                    onClick={() =>
                                        setSelectedCategory(cat.value)
                                    }
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                                        isSelected
                                            ? 'bg-zinc-100 text-zinc-950 shadow-md'
                                            : 'hover:bg-zinc-850 border border-zinc-800/80 bg-zinc-900/60 text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Events Grid */}
            <main className="mx-auto max-w-7xl px-6 pb-20">
                {filteredEvents.length === 0 ? (
                    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center">
                        <Filter className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
                        <h3 className="text-lg font-bold text-white">
                            No matching events found
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                            Try resetting filters or adjusting your search
                            keyword.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="mt-4 border-zinc-700 bg-zinc-800"
                        >
                            Reset Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => {
                            const eventDate = new Date(event.start_date);
                            const month = eventDate
                                .toLocaleDateString('en-CA', { month: 'short' })
                                .toUpperCase();
                            const day = eventDate.toLocaleDateString('en-CA', {
                                day: '2-digit',
                            });

                            const lowestPrice = event.ticket_tiers?.length
                                ? Math.min(
                                      ...event.ticket_tiers.map((t) =>
                                          Number(t.price),
                                      ),
                                  )
                                : null;

                            return (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-rose-950/20"
                                >
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-800">
                                        <img
                                            src={
                                                event.image_url ||
                                                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
                                            }
                                            alt={event.name}
                                            className="h-full w-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="border border-white/10 bg-black/60 text-xs font-semibold text-zinc-200 backdrop-blur-md">
                                                {event.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 gap-4 p-5">
                                        <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60">
                                            <span className="text-[10px] font-bold tracking-wider text-rose-400">
                                                {month}
                                            </span>
                                            <span className="mt-0.5 text-lg leading-none font-black text-white">
                                                {day}
                                            </span>
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                                            <div>
                                                <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-rose-400">
                                                    {event.name}
                                                </h3>
                                                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-zinc-400">
                                                    <MapPin className="h-3 w-3 shrink-0 text-zinc-500" />
                                                    <span className="truncate">
                                                        {event.location}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
                                                <span className="text-xs font-medium text-zinc-500">
                                                    {event.ticket_tiers
                                                        ?.length || 0}{' '}
                                                    Tiers available
                                                </span>
                                                <div className="font-mono text-sm font-bold text-white">
                                                    {lowestPrice !== null
                                                        ? `From CAD $${lowestPrice.toFixed(0)}`
                                                        : 'Free'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* 5. NEW SECTION: Why FlashTicket (Engineering & Trust Pillars) */}
            <section className="border-t border-zinc-800/80 bg-zinc-950/70 px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-3 border-rose-500/30 text-rose-400"
                        >
                            The Engine Difference
                        </Badge>
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Engineered for Millisecond Traffic Surges
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                            Traditional ticketing portals crash or oversell when
                            high-demand drops occur. FlashTicket replaces
                            fragile optimistic locks with atomic database
                            guarantees.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-zinc-800 bg-zinc-900/60 p-6">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">
                                10-Minute Cart Lock
                            </h3>
                            <p className="text-xs leading-relaxed text-zinc-400">
                                Once you enter checkout, your tickets are held
                                exclusively for your session. Unpaid holds are
                                reclaimed automatically by background queue
                                workers.
                            </p>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 p-6">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">
                                Mathematical Zero Overselling
                            </h3>
                            <p className="text-xs leading-relaxed text-zinc-400">
                                Pessimistic row locking (`SELECT ... FOR
                                UPDATE`) serializes parallel buyers, ensuring
                                that 100 tickets are sold to exactly 100 people.
                                Zero over-allocations.
                            </p>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 p-6">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">
                                Cryptographic QR Passes
                            </h3>
                            <p className="text-xs leading-relaxed text-zinc-400">
                                Digital tickets signed with HMAC-SHA256 prevent
                                counterfeiting and screenshot reuse. Scanned by
                                gate staff directly via smartphone browsers.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 6. NEW SECTION: Popular Canadian Event Hubs */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white">
                                Explore by Canadian City
                            </h2>
                            <p className="mt-1 text-xs text-zinc-400">
                                Discover what’s happening in major cultural
                                centers.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {CITIES.map((city, idx) => (
                            <div
                                key={idx}
                                onClick={() =>
                                    setSearchQuery(city.name.split(',')[0])
                                }
                                className="group hover:bg-zinc-850 flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-zinc-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-400 transition-colors group-hover:text-rose-400">
                                        <Compass className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white transition-colors group-hover:text-rose-400">
                                            {city.name}
                                        </h4>
                                        <span className="text-[11px] text-zinc-500">
                                            {city.eventsCount}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. NEW SECTION: Organizer CTA Banner */}
            <section className="px-6 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 p-8 sm:p-12 md:flex-row">
                        <div className="max-w-xl">
                            <Badge className="mb-3 border-rose-500/30 bg-rose-500/20 text-rose-300">
                                For Promoters & Venue Operators
                            </Badge>
                            <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Hosting an event? Launch your flash sale in
                                minutes.
                            </h3>
                            <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
                                Create multi-tier tickets, monitor real-time
                                capacity and scan guest tickets at the gate
                                without expensive dedicated scanning hardware.
                            </p>
                        </div>

                        <Link href="/organizer/events/create">
                            <Button className="h-12 shrink-0 rounded-xl bg-white px-6 font-bold text-zinc-950 shadow-lg hover:bg-zinc-200">
                                Publish an Event
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
