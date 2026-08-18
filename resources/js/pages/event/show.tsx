import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { store as reserveStore } from '@/routes/reservations';
import { login, dashboard } from '@/routes';
import { Calendar, MapPin, Ticket, AlertTriangle, ChevronRight, User, LogIn, LayoutDashboard, Plus, Minus } from 'lucide-react';
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

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-3xl bg-card/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl ${className}`}>
        {children}
    </div>
);

export default function EventShow() {
    const { event, ticketTiers, auth, flash } = usePage<any>().props as PageProps;
    const [selectedTier, setSelectedTier] = useState<TicketTier | null>(
        ticketTiers.find(tier => tier.is_available && tier.available_quantity > 0) || null
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
                quantity: quantity
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
            setQuantity(prev => prev + 1);
        } else {
            toast.warning(`Limite de ${selectedTier.available_quantity} ingressos disponíveis atingido.`);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
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
                toast.success('Sua reserva provisória foi criada! Você tem 10 minutos para concluir o pagamento.');
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
            }
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
            minute: '2-digit'
        });
    };

    const formatPrice = (price: string | number) => {
        const parsed = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parsed);
    };

    // Immersive background images matching the event or standard high quality events
    const heroImage = `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80`;

    return (
        <div className="min-h-screen bg-background text-foreground font-geist relative overflow-x-hidden flex flex-col justify-between">
            <Head title={event.name} />

            {/* Glowing background blob */}
            <div className="absolute top-[-10%] left-[-10%] w-[50dvw] h-[50dvw] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50dvw] h-[50dvw] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Header Navigation */}
            <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-md px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-foreground flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-violet-400" />
                        Flash<span className="text-violet-400">Ticket</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="flex items-center gap-2 rounded-2xl bg-zinc-800/40 hover:bg-zinc-800/80 border border-white/10 px-4 py-2 text-sm font-medium transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 text-violet-400" />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="flex items-center gap-2 rounded-2xl bg-primary py-2 px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Entrar
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content container */}
            <main className="max-w-6xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                {/* Left side: Event Info & Description */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Banner */}
                    <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${heroImage})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 backdrop-blur-md mb-3 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                                Evento Disponível
                            </Badge>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                                {event.name}
                            </h1>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <GlassCard className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data e Horário</h4>
                                    <p className="text-sm font-medium leading-relaxed">{formatDate(event.start_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Localização</h4>
                                    <p className="text-sm font-medium leading-relaxed">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        {event.description && (
                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <h3 className="text-lg font-semibold tracking-tight">Sobre o Evento</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Right side: Tickets purchase card */}
                <div className="lg:col-span-1">
                    <GlassCard className="p-6 md:p-8 sticky top-24 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Ingressos</h3>
                            <p className="text-xs text-muted-foreground mt-1">Selecione o setor e a quantidade desejada</p>
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
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden group ${
                                            isSoldOut 
                                                ? 'bg-zinc-950/20 border-zinc-800/40 opacity-50 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-violet-500/10 border-violet-400/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                                                    : 'bg-zinc-800/10 border-white/5 hover:border-white/10 hover:bg-zinc-800/20 cursor-pointer'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <div className="font-semibold text-sm tracking-tight text-foreground group-hover:text-violet-300 transition-colors">
                                                {tier.name}
                                            </div>
                                            <div className="font-bold text-sm text-violet-400">
                                                {formatPrice(tier.price)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center w-full text-xs">
                                            {isSoldOut ? (
                                                <Badge variant="destructive" className="bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-md font-semibold">
                                                    Esgotado
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className={`px-2 py-0.5 rounded-md font-medium ${
                                                    tier.available_quantity <= 10 
                                                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                                        : 'bg-green-500/10 text-green-300 border-green-500/30'
                                                }`}>
                                                    {tier.available_quantity} restantes
                                                </Badge>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedTier && (
                            <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-white/5">
                                {/* Quantity Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                                        Quantidade
                                    </label>
                                    <div className="flex items-center justify-between bg-zinc-800/30 border border-white/5 rounded-2xl p-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                            className="rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="font-bold text-lg px-4">{quantity}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleIncrement}
                                            disabled={quantity >= selectedTier.available_quantity}
                                            className="rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {errors.quantity && (
                                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            {errors.quantity}
                                        </p>
                                    )}
                                </div>

                                {/* Total summary */}
                                <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/10 p-4 rounded-2xl">
                                    <div className="text-xs text-muted-foreground">Total Provisório</div>
                                    <div className="font-bold text-lg text-violet-400">
                                        {formatPrice(parseFloat(selectedTier.price.toString()) * quantity)}
                                    </div>
                                </div>

                                {/* Submit button */}
                                {auth.user ? (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-2xl bg-primary py-6 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                    >
                                        {processing ? <Spinner className="w-5 h-5 text-current animate-spin" /> : <Ticket className="w-4 h-4" />}
                                        Reservar Ingressos
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href={login()}
                                            className="w-full inline-flex items-center justify-center rounded-2xl bg-zinc-800 border border-white/10 hover:bg-zinc-700/80 py-4 text-sm font-semibold transition-colors gap-2"
                                        >
                                            <LogIn className="w-4 h-4 text-violet-400" />
                                            Entrar para Reservar
                                        </Link>
                                        <p className="text-[10px] text-center text-muted-foreground leading-snug">
                                            Você precisa ter uma conta no FlashTicket para garantir seus ingressos.
                                        </p>
                                    </div>
                                )}
                            </form>
                        )}
                    </GlassCard>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground mt-12">
                <div className="max-w-6xl mx-auto px-6">
                    <p>&copy; {new Date().getFullYear()} FlashTicket. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
