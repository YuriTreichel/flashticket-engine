import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { store as reserveStore } from '@/routes/reservations';
import { login, dashboard } from '@/routes';
import {
    Calendar,
    MapPin,
    Ticket,
    AlertTriangle,
    ChevronRight,
    User,
    LogIn,
    LayoutDashboard,
    Plus,
    Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface TicketTier {
    id: number;
    event_id: number;
    name: string;
    price: string | number;
    total_quantity: number;
    available_quantity: number;
    is_available: boolean;
}

interface Event {
    id: number;
    name: string;
    description: string | null;
    location: string;
    start_date: string;
    end_date: string | null;
}

interface PageProps {
    event: Event;
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

const GlassCard = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`rounded-3xl border border-white/10 bg-card/40 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/40 ${className}`}
    >
        {children}
    </div>
);

export default function EventShow() {
    const { event, ticketTiers, auth, flash } = usePage<any>()
        .props as PageProps;
    const [selectedTier, setSelectedTier] = useState<TicketTier | null>(
        ticketTiers.find(
            (tier) => tier.is_available && tier.available_quantity > 0,
        ) || null,
    );
    const [quantity, setQuantity] = useState(1);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        ticket_tier_id: selectedTier?.id || '',
        quantity: 1,
    });

    // Update form when selected tier or quantity changes
    useEffect(() => {
        if (selectedTier) {
            setData((prev) => ({
                ...prev,
                ticket_tier_id: selectedTier.id,
                quantity: quantity,
            }));
        }
    }, [selectedTier, quantity]);

    // Handle toast messages from session redirects
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleIncrement = () => {
        if (!selectedTier) return;
        if (quantity < selectedTier.available_quantity) {
            setQuantity((prev) => prev + 1);
        } else {
            toast.warning(
                `Limite de ${selectedTier.available_quantity} ingressos disponíveis atingido.`,
            );
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (!auth.user) {
            toast.info('Por favor, faça login para reservar seus ingressos.');
            return;
        }

        if (!selectedTier) {
            toast.error('Por favor, selecione um setor/lote.');
            return;
        }

        post(reserveStore.url(), {
            onSuccess: () => {
                toast.success(
                    'Sua reserva provisória foi criada! Você tem 10 minutos para concluir o pagamento.',
                );
                setQuantity(1);
            },
            onError: (err) => {
                if (err.quantity) {
                    toast.error(err.quantity);
                } else if (err.ticket_tier_id) {
                    toast.error(err.ticket_tier_id);
                } else {
                    toast.error('Erro ao realizar reserva. Tente novamente.');
                }
            },
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: string | number) => {
        const parsed = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(parsed);
    };

    // Immersive background images matching the event or standard high quality events
    const heroImage = `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80`;

    return (
        <div className="font-geist relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background text-foreground">
            <Head title={event.name} />

            {/* Glowing background blob */}
            <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[50dvw] w-[50dvw] rounded-full bg-violet-600/10 blur-[120px]" />
            <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[50dvw] w-[50dvw] rounded-full bg-fuchsia-600/10 blur-[120px]" />

            {/* Header Navigation */}
            <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold tracking-tighter text-foreground"
                    >
                        <Ticket className="h-6 w-6 text-violet-400" />
                        Flash<span className="text-violet-400">Ticket</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-800/40 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800/80"
                            >
                                <LayoutDashboard className="h-4 w-4 text-violet-400" />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <LogIn className="h-4 w-4" />
                                Entrar
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content container */}
            <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-start gap-8 px-6 py-8 lg:grid-cols-3">
                {/* Left side: Event Info & Description */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Event Banner */}
                    <div className="group relative h-64 overflow-hidden rounded-3xl border border-white/10 shadow-2xl md:h-96">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                        <div className="absolute right-6 bottom-6 left-6">
                            <Badge className="mb-3 border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-violet-300 uppercase backdrop-blur-md">
                                Evento Disponível
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md md:text-5xl">
                                {event.name}
                            </h1>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <GlassCard className="p-6 md:p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-400">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Data e Horário
                                    </h4>
                                    <p className="text-sm leading-relaxed font-medium">
                                        {formatDate(event.start_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-3 text-fuchsia-400">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Localização
                                    </h4>
                                    <p className="text-sm leading-relaxed font-medium">
                                        {event.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {event.description && (
                            <div className="mt-8 space-y-4 border-t border-white/5 pt-8">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Sobre o Evento
                                </h3>
                                <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {event.description}
                                </p>
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Right side: Tickets purchase card */}
                <div className="lg:col-span-1">
                    <GlassCard className="sticky top-24 space-y-6 p-6 md:p-8">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">
                                Ingressos
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Selecione o setor e a quantidade desejada
                            </p>
                        </div>

                        {/* List of Tiers */}
                        <div className="space-y-3">
                            {ticketTiers.map((tier) => {
                                const isSelected = selectedTier?.id === tier.id;
                                const isSoldOut = tier.available_quantity <= 0;

                                return (
                                    <button
                                        key={tier.id}
                                        type="button"
                                        disabled={isSoldOut}
                                        onClick={() => {
                                            setSelectedTier(tier);
                                            setQuantity(1);
                                        }}
                                        className={`group relative flex w-full flex-col gap-2 overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                                            isSoldOut
                                                ? 'cursor-not-allowed border-zinc-800/40 bg-zinc-950/20 opacity-50'
                                                : isSelected
                                                  ? 'border-violet-400/60 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                                                  : 'cursor-pointer border-white/5 bg-zinc-800/10 hover:border-white/10 hover:bg-zinc-800/20'
                                        }`}
                                    >
                                        <div className="flex w-full items-start justify-between">
                                            <div className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-violet-300">
                                                {tier.name}
                                            </div>
                                            <div className="text-sm font-bold text-violet-400">
                                                {formatPrice(tier.price)}
                                            </div>
                                        </div>

                                        <div className="flex w-full items-center justify-between text-xs">
                                            {isSoldOut ? (
                                                <Badge
                                                    variant="destructive"
                                                    className="rounded-md border border-red-500/30 bg-red-500/20 px-2 py-0.5 font-semibold text-red-300"
                                                >
                                                    Esgotado
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-md px-2 py-0.5 font-medium ${
                                                        tier.available_quantity <=
                                                        10
                                                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                                            : 'border-green-500/30 bg-green-500/10 text-green-300'
                                                    }`}
                                                >
                                                    {tier.available_quantity}{' '}
                                                    restantes
                                                </Badge>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedTier && (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 border-t border-white/5 pt-4"
                            >
                                {/* Quantity Selector */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Quantidade
                                    </label>
                                    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-800/30 p-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                            className="rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-4 text-lg font-bold">
                                            {quantity}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleIncrement}
                                            disabled={
                                                quantity >=
                                                selectedTier.available_quantity
                                            }
                                            className="rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {errors.quantity && (
                                        <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                                            <AlertTriangle className="h-3 w-3" />
                                            {errors.quantity}
                                        </p>
                                    )}
                                </div>

                                {/* Total summary */}
                                <div className="flex items-center justify-between rounded-2xl border border-violet-500/10 bg-violet-500/5 p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Total Provisório
                                    </div>
                                    <div className="text-lg font-bold text-violet-400">
                                        {formatPrice(
                                            parseFloat(
                                                selectedTier.price.toString(),
                                            ) * quantity,
                                        )}
                                    </div>
                                </div>

                                {/* Submit button */}
                                {auth.user ? (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-6 font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
                                    >
                                        {processing ? (
                                            <Spinner className="h-5 w-5 animate-spin text-current" />
                                        ) : (
                                            <Ticket className="h-4 w-4" />
                                        )}
                                        Reservar Ingressos
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href={login()}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-800 py-4 text-sm font-semibold transition-colors hover:bg-zinc-700/80"
                                        >
                                            <LogIn className="h-4 w-4 text-violet-400" />
                                            Entrar para Reservar
                                        </Link>
                                        <p className="text-center text-[10px] leading-snug text-muted-foreground">
                                            Você precisa ter uma conta no
                                            FlashTicket para garantir seus
                                            ingressos.
                                        </p>
                                    </div>
                                )}
                            </form>
                        )}
                    </GlassCard>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
                <div className="mx-auto max-w-6xl px-6">
                    <p>
                        &copy; {new Date().getFullYear()} FlashTicket. Todos os
                        direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
