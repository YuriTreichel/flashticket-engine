import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Calendar,
    MapPin,
    Ticket,
    AlertTriangle,
    ShieldCheck,
    ArrowLeft,
    Clock,
    Zap,
    Plus,
    Minus,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TicketVariant {
    id: number;
    name: string;
    category: string;
    discount_percent: number;
    requires_id_proof: boolean;
}

interface TicketTier {
    id: number;
    event_id: number;
    name: string;
    price: string | number;
    total_quantity: number;
    available_quantity: number;
    is_available: boolean;
    variants?: TicketVariant[];
}

interface EventItem {
    id: number;
    name: string;
    description: string | null;
    location: string;
    image_url: string | null;
    category: string;
    start_date: string;
    end_date: string | null;
    organization?: {
        id: number;
        name: string;
        business_type: string;
    };
}

interface PageProps {
    event: EventItem;
    ticketTiers: TicketTier[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function EventShow() {
    const { event, ticketTiers, auth, flash } = usePage<any>().props as PageProps;

    const [selectedTier, setSelectedTier] = useState<TicketTier | null>(
        ticketTiers?.find((tier) => tier.is_available && tier.available_quantity > 0) || null
    );
    const [selectedVariant, setSelectedVariant] = useState<TicketVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Sync selected variant when tier changes
    useEffect(() => {
        if (selectedTier?.variants && selectedTier.variants.length > 0) {
            setSelectedVariant(selectedTier.variants[0]);
        } else {
            setSelectedVariant(null);
        }
    }, [selectedTier]);

    const { data, setData, post, processing, errors } = useForm({
        ticket_tier_id: selectedTier?.id || '',
        ticket_variant_id: selectedVariant?.id || '',
        quantity: 1,
    });

    useEffect(() => {
        if (selectedTier) {
            setData((prev) => ({
                ...prev,
                ticket_tier_id: selectedTier.id,
                ticket_variant_id: selectedVariant?.id || '',
                quantity: quantity,
            }));
        }
    }, [selectedTier, selectedVariant, quantity]);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user) {
            window.location.href = '/login';
            return;
        }
        post('/reservations');
    };

    const basePrice = selectedTier ? Number(selectedTier.price) : 0;
    const discountMultiplier = selectedVariant ? (100 - selectedVariant.discount_percent) / 100 : 1;
    const effectiveUnitPrice = basePrice * discountMultiplier;
    const subtotal = effectiveUnitPrice * quantity;

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-rose-500 selection:text-white font-sans antialiased">
            <Head title={`${event.name} — FlashTicket`} />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                    <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to all events</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link href="/my-tickets">
                                <Button variant="outline" size="sm" className="gap-2 border-zinc-800 bg-zinc-900/80">
                                    <Ticket className="h-4 w-4 text-rose-400" />
                                    <span>My Tickets</span>
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-zinc-300">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Event Header Banner (Luma Style) */}
            <div className="relative border-b border-zinc-800/80 bg-zinc-950">
                <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                    <img
                        src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
                        alt={event.name}
                        className="h-full w-full object-cover object-center brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
                </div>

                <div className="mx-auto max-w-7xl px-6 -mt-24 relative z-10 pb-8">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">
                            {event.category || 'Special Event'}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-zinc-300">
                            Pessimistic Hold Guaranteed
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl leading-tight">
                        {event.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-rose-400" />
                            <span>
                                {new Date(event.start_date).toLocaleDateString('en-CA', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-rose-400" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Ticket Selection Layout */}
            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Left Column: Event Description & Highlights */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-3">About this Event</h2>
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {event.description || 'Join us for this premier live event experience.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                FlashTicket Safe Checkout Promise
                            </h3>
                            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>
                                        <strong>10-Minute Cart Hold:</strong> Once you click reserve, your tickets are locked
                                        exclusively for you while you check out.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Zero Overselling:</strong> Real-time database locking prevents double-booking
                                        even during millisecond traffic spikes.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Cryptographic QR Codes:</strong> Fraud-resistant tickets delivered instantly to
                                        your wallet upon payment.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Ticket Tier Selector & Booking Card */}
                    <div className="lg:col-span-5">
                        <Card className="sticky top-24 border-zinc-800 bg-zinc-900/90 shadow-2xl rounded-2xl overflow-hidden backdrop-blur">
                            <div className="p-6 border-b border-zinc-800">
                                <h3 className="text-lg font-bold text-white">Select Tickets</h3>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Choose your tier and reserve instantly.
                                </p>
                            </div>

                            <CardContent className="p-6 space-y-6">
                                {/* Ticket Tiers List */}
                                <div className="space-y-3">
                                    {ticketTiers?.map((tier) => {
                                        const isSelected = selectedTier?.id === tier.id;
                                        const isSoldOut = !tier.is_available || tier.available_quantity <= 0;

                                        return (
                                            <div
                                                key={tier.id}
                                                onClick={() => !isSoldOut && setSelectedTier(tier)}
                                                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                                    isSoldOut
                                                        ? 'opacity-40 cursor-not-allowed border-zinc-800 bg-zinc-950/40'
                                                        : isSelected
                                                          ? 'border-rose-500 bg-rose-500/10 shadow-md shadow-rose-500/10'
                                                          : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-sm text-white">{tier.name}</h4>
                                                        {isSoldOut ? (
                                                            <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400">
                                                                Sold Out
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[11px] text-emerald-400 font-medium">
                                                                {tier.available_quantity} available
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-zinc-500">Includes all venue fees</span>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-base font-black text-white font-mono">
                                                        CAD ${Number(tier.price).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedTier && (
                                    <>
                                        {/* Ticket Variant Selector (Adult, Student 50%, Child, Senior) */}
                                        {selectedTier.variants && selectedTier.variants.length > 0 && (
                                            <div className="space-y-2 border-t border-zinc-800 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                        Attendee Type & Discounts
                                                    </span>
                                                    {selectedVariant && selectedVariant.discount_percent > 0 && (
                                                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
                                                            {selectedVariant.discount_percent}% OFF applied
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {selectedTier.variants.map((v) => {
                                                        const isVarSelected = selectedVariant?.id === v.id;
                                                        const varUnitPrice = Number(selectedTier.price) * ((100 - v.discount_percent) / 100);

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={v.id}
                                                                onClick={() => setSelectedVariant(v)}
                                                                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all text-xs ${
                                                                    isVarSelected
                                                                        ? 'border-rose-500 bg-rose-500/10 text-white font-medium ring-1 ring-rose-500/30'
                                                                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="font-semibold text-zinc-200">{v.name}</span>
                                                                    <span className="font-mono text-zinc-100 font-bold">
                                                                        CAD ${varUnitPrice.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                {v.requires_id_proof && (
                                                                    <span className="text-[10px] text-zinc-500 mt-1">
                                                                        ID verification at gate
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quantity Selector */}
                                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                                            <span className="text-sm font-medium text-zinc-300">Quantity</span>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={quantity <= 1}
                                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                    className="h-8 w-8 rounded-lg border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </Button>
                                                <span className="font-mono font-bold text-base text-white w-6 text-center">
                                                    {quantity}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={quantity >= Math.min(8, selectedTier.available_quantity)}
                                                    onClick={() => setQuantity((q) => q + 1)}
                                                    className="h-8 w-8 rounded-lg border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Subtotal & Action */}
                                        <div className="space-y-4 border-t border-zinc-800 pt-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-zinc-400">Subtotal ({quantity} tickets)</span>
                                                <span className="font-bold text-lg text-white font-mono">
                                                    CAD ${subtotal.toFixed(2)}
                                                </span>
                                            </div>

                                            {errors.quantity && (
                                                <p className="text-xs text-rose-400">{errors.quantity}</p>
                                            )}

                                            <form onSubmit={handleSubmit}>
                                                <Button
                                                    type="submit"
                                                    disabled={processing || !selectedTier.is_available}
                                                    className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-lg shadow-rose-600/30 gap-2"
                                                >
                                                    <Zap className="h-4 w-4 fill-white" />
                                                    {auth.user ? 'Hold & Proceed to Checkout' : 'Sign in to Reserve'}
                                                </Button>
                                            </form>

                                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>10-minute hold starts upon checkout redirect</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
