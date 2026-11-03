import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ShieldCheck,
    Zap,
    Cpu,
    Database,
    Clock,
    Lock,
    Users,
    ArrowLeft,
    CheckCircle2,
    BarChart3,
    Server,
    Flame,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import StorefrontLayout from '@/layouts/storefront-layout';

interface MetricsProps {
    metrics: {
        total_events: number;
        total_tiers: number;
        tickets_issued: number;
        holds_processed: number;
        p95_latency_ms: number;
        overselling_incident_rate: string;
        concurrency_capacity_rps: string;
    };
    recentTransactions: Array<{
        id: number;
        code: string;
        status: string;
        created_at: string;
        user: { name: string; email: string };
        ticket_tier: {
            name: string;
            price: number | string;
            event: { name: string };
        };
    }>;
}

export default function MetricsIndex({
    metrics,
    recentTransactions,
}: MetricsProps) {
    return (
        <StorefrontLayout>
            <div className="p-6 md:p-12">
                <Head title="Live Engine Telemetry & Concurrency Metrics" />

                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-white">
                                    System Telemetry
                                </h1>
                                <Badge className="animate-pulse gap-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    All Systems Operational
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-zinc-400">
                                Real-time database lock performance, flash sale
                                throughput, and audit trail.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/architecture">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 border-zinc-800 bg-zinc-900 text-zinc-300"
                                >
                                    <Cpu className="h-4 w-4 text-rose-400" />
                                    View Architecture Spec
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Key Metric Gauges */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    P95 Checkout Latency
                                </CardTitle>
                                <Clock className="h-4 w-4 text-emerald-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-white">
                                    {metrics.p95_latency_ms} ms
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Sub-200ms lock duration target
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Overselling Rate
                                </CardTitle>
                                <ShieldCheck className="h-4 w-4 text-rose-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-rose-400">
                                    {metrics.overselling_incident_rate}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Mathematical zero error proof
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Stress Capacity
                                </CardTitle>
                                <Zap className="h-4 w-4 text-amber-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-white">
                                    {metrics.concurrency_capacity_rps}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    k6 benchmarked under load
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Total Tickets Issued
                                </CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-white">
                                    {metrics.tickets_issued}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    HMAC-SHA256 verified passes
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Concurrency Mechanism Visualizer */}
                    <div className="mb-8 grid gap-6 lg:grid-cols-12">
                        <Card className="border-zinc-800 bg-zinc-900/80 p-6 lg:col-span-7">
                            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-white">
                                <Lock className="h-4 w-4 text-rose-400" />
                                Two-Phase Concurrency Mitigation
                            </h3>
                            <p className="mb-6 text-xs leading-relaxed text-zinc-400">
                                How FlashTicket Engine handles high-velocity
                                flash sales when 5,000 users click reserve
                                within 500 milliseconds.
                            </p>

                            <div className="space-y-4">
                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-bold text-white">
                                            1. Pre-Hold Isolation (Pessimistic
                                            Lock)
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="border-rose-500/30 text-[10px] text-rose-400"
                                        >
                                            Active
                                        </Badge>
                                    </div>
                                    <code className="block rounded bg-zinc-900/60 p-2 font-mono text-[11px] text-zinc-400">
                                        {
                                            "TicketTier::where('id', $tierId)->lockForUpdate()->firstOrFail();"
                                        }
                                    </code>
                                    <p className="mt-2 text-xs text-zinc-400">
                                        Blocks subsequent write requests on the
                                        row until the transaction commits,
                                        ensuring atomic reads of available
                                        capacity.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-bold text-white">
                                            2. Auto-Reclaim Daemon (TTL 10m)
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="border-amber-500/30 text-[10px] text-amber-400"
                                        >
                                            Horizon Worker
                                        </Badge>
                                    </div>
                                    <code className="block rounded bg-zinc-900/60 p-2 font-mono text-[11px] text-zinc-400">
                                        {
                                            "Reservation::where('status', 'pending')->where('expires_at', '<=', now())->update(['status' => 'expired']);"
                                        }
                                    </code>
                                    <p className="mt-2 text-xs text-zinc-400">
                                        Restores inventory to real-time buyers
                                        immediately without waiting for cron
                                        latency.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Live Recent Transactions */}
                        <Card className="border-zinc-800 bg-zinc-900/80 p-6 lg:col-span-5">
                            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-white">
                                <Activity className="h-4 w-4 text-emerald-400" />
                                Recent Ticket Minting Ledger
                            </h3>
                            <p className="mb-4 text-xs text-zinc-400">
                                Real-time immutable issuance log.
                            </p>

                            <div className="space-y-3">
                                {recentTransactions.length === 0 ? (
                                    <p className="py-8 text-center text-xs text-zinc-500">
                                        No tickets minted yet.
                                    </p>
                                ) : (
                                    recentTransactions.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="space-y-1 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-3 text-xs"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="max-w-[180px] truncate font-bold text-white">
                                                    {tx.ticket_tier.event.name}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] ${
                                                        tx.status === 'valid'
                                                            ? 'border-emerald-500/30 text-emerald-400'
                                                            : 'text-zinc-400'
                                                    }`}
                                                >
                                                    {tx.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-zinc-400">
                                                <span>
                                                    {tx.ticket_tier.name} · CAD
                                                    $
                                                    {Number(
                                                        tx.ticket_tier.price,
                                                    ).toFixed(2)}
                                                </span>
                                                <span className="max-w-[100px] truncate font-mono text-[10px] text-zinc-500">
                                                    {tx.code.slice(0, 8)}...
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
