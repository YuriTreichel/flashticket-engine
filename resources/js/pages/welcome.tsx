import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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
                event.category?.toLowerCase() === selectedCategory.toLowerCase();

            const matchesSearch =
                event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [events?.data, selectedCategory, searchQuery]);

    const featuredEvent = events?.data?.[0];

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-rose-500 selection:text-white font-sans antialiased">
            <Head title="FlashTicket — Experience Live Events Without the Queue" />

            {/* 1. Global Navigation Bar */}
            <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-md shadow-rose-600/25 transition-transform group-hover:scale-105">
                                <Zap className="h-4.5 w-4.5 text-white fill-white" />
                            </div>
                            <div className="flex items-baseline tracking-tight">
                                <span className="text-lg font-black text-white">flash</span>
                                <span className="text-lg font-light text-zinc-400">ticket</span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
                            <Link href="/metrics" className="hover:text-white transition-colors flex items-center gap-1.5">
                                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Live Telemetry</span>
                            </Link>
                            <Link href="/architecture" className="hover:text-white transition-colors flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5 text-rose-400" />
                                <span>Architecture Proof</span>
                            </Link>
                            <Link href="/faq" className="hover:text-white transition-colors">
                                FAQ
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <>
                                <Link href="/my-tickets">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800"
                                    >
                                        <Ticket className="h-4 w-4 text-rose-400" />
                                        <span>My Tickets</span>
                                    </Button>
                                </Link>
                                <Link href="/organizer/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    >
                                        Organizer Gate
                                    </Button>
                                </Link>
                                <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-xs font-bold text-white shadow-inner">
                                    {auth.user.name.charAt(0)}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-300 hover:text-white hover:bg-zinc-900"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="bg-white font-semibold text-zinc-950 hover:bg-zinc-200 shadow-md shadow-white/10"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* 2. Hero Spotlight Banner */}
            {featuredEvent && (
                <section className="relative px-6 pt-6 pb-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/50 shadow-2xl group">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={featuredEvent.image_url || ''}
                                    alt={featuredEvent.name}
                                    className="h-full w-full object-cover object-center brightness-40 transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent" />
                            </div>

                            <div className="relative z-10 flex flex-col justify-end p-8 sm:p-14 min-h-[440px] max-w-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 gap-1.5 px-3 py-1 font-semibold backdrop-blur-md">
                                        <Flame className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
                                        Trending Flash Sale
                                    </Badge>
                                    <Badge variant="outline" className="border-white/20 text-zinc-300 backdrop-blur-md">
                                        {featuredEvent.category}
                                    </Badge>
                                </div>

                                <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white leading-tight">
                                    {featuredEvent.name}
                                </h1>

                                <p className="mt-4 text-zinc-300 text-sm sm:text-base line-clamp-2 leading-relaxed">
                                    {featuredEvent.description}
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-rose-400" />
                                        <span>
                                            {new Date(featuredEvent.start_date).toLocaleDateString('en-CA', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-rose-400" />
                                        <span className="truncate max-w-[280px]">{featuredEvent.location}</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-4">
                                    <Link href={`/events/${featuredEvent.id}`}>
                                        <Button className="h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold gap-2 shadow-lg shadow-rose-600/30">
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

            {/* 3. Search & Filter Bar */}
            <section className="px-6 pb-6">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                                        isSelected
                                            ? 'bg-zinc-100 text-zinc-950 shadow-md'
                                            : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:text-white hover:bg-zinc-850'
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative min-w-[280px] md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events, cities, venues..."
                            className="h-10 pl-10 bg-zinc-900/70 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 rounded-xl focus:border-rose-500"
                        />
                    </div>
                </div>
            </section>

            {/* 4. Events Grid */}
            <main className="mx-auto max-w-7xl px-6 pb-20">
                {filteredEvents.length === 0 ? (
                    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center">
                        <Filter className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
                        <h3 className="text-lg font-bold text-white">No matching events found</h3>
                        <p className="text-sm text-zinc-400 mt-1">Try resetting filters or adjusting your search keyword.</p>
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
                            const month = eventDate.toLocaleDateString('en-CA', { month: 'short' }).toUpperCase();
                            const day = eventDate.toLocaleDateString('en-CA', { day: '2-digit' });

                            const lowestPrice = event.ticket_tiers?.length
                                ? Math.min(...event.ticket_tiers.map((t) => Number(t.price)))
                                : null;

                            return (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-rose-950/20"
                                >
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-800">
                                        <img
                                            src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                                            alt={event.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-90"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-black/60 text-zinc-200 border border-white/10 backdrop-blur-md text-xs font-semibold">
                                                {event.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 p-5 gap-4">
                                        <div className="flex flex-col items-center justify-center h-14 w-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 shrink-0">
                                            <span className="text-[10px] font-bold text-rose-400 tracking-wider">
                                                {month}
                                            </span>
                                            <span className="text-lg font-black text-white leading-none mt-0.5">
                                                {day}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-between flex-1 min-w-0">
                                            <div>
                                                <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                                                    {event.name}
                                                </h3>
                                                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 truncate">
                                                    <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
                                                <span className="text-xs text-zinc-500 font-medium">
                                                    {event.ticket_tiers?.length || 0} Tiers available
                                                </span>
                                                <div className="text-sm font-bold text-white font-mono">
                                                    {lowestPrice !== null ? `From CAD $${lowestPrice.toFixed(0)}` : 'Free'}
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
            <section className="border-t border-zinc-800/80 bg-zinc-950/70 py-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <Badge variant="outline" className="text-rose-400 border-rose-500/30 mb-3">
                            The Engine Difference
                        </Badge>
                        <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
                            Engineered for Millisecond Traffic Surges
                        </h2>
                        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                            Traditional ticketing portals crash or oversell when high-demand drops occur. FlashTicket
                            replaces fragile optimistic locks with atomic database guarantees.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-zinc-800 bg-zinc-900/60 p-6">
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">10-Minute Cart Lock</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Once you enter checkout, your tickets are held exclusively for your session. Unpaid holds
                                are reclaimed automatically by background queue workers.
                            </p>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 p-6">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Mathematical Zero Overselling</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Pessimistic row locking (`SELECT ... FOR UPDATE`) serializes parallel buyers, ensuring
                                that 100 tickets are sold to exactly 100 people. Zero over-allocations.
                            </p>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 p-6">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Cryptographic QR Passes</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Digital tickets signed with HMAC-SHA256 prevent counterfeiting and screenshot reuse.
                                Scanned by gate staff directly via smartphone browsers.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 6. NEW SECTION: Popular Canadian Event Hubs */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Explore by Canadian City</h2>
                            <p className="text-xs text-zinc-400 mt-1">Discover what’s happening in major cultural centers.</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {CITIES.map((city, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSearchQuery(city.name.split(',')[0])}
                                className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-850 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 group-hover:text-rose-400 transition-colors">
                                        <Compass className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                                            {city.name}
                                        </h4>
                                        <span className="text-[11px] text-zinc-500">{city.eventsCount}</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. NEW SECTION: Organizer CTA Banner */}
            <section className="px-6 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 mb-3">
                                For Promoters & Venue Operators
                            </Badge>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Hosting an event? Launch your flash sale in minutes.
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                                Create multi-tier tickets, monitor real-time capacity and scan guest tickets at the gate
                                without expensive dedicated scanning hardware.
                            </p>
                        </div>

                        <Link href="/organizer/events/create">
                            <Button className="h-12 px-6 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 shrink-0 shadow-lg">
                                Publish an Event
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 8. Global Footer */}
            <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-6 text-xs text-zinc-500">
                <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-rose-500 fill-rose-500" />
                        <span className="font-bold text-zinc-300">FlashTicket Engine</span>
                        <span>· High-Concurrency Ticketmaster Alternative</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/architecture" className="hover:text-zinc-300 transition-colors">
                            Architecture Whitepaper
                        </Link>
                        <Link href="/metrics" className="hover:text-zinc-300 transition-colors">
                            Live Telemetry
                        </Link>
                        <Link href="/faq" className="hover:text-zinc-300 transition-colors">
                            FAQ
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
