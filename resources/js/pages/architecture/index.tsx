import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Layers,
    Cpu,
    Database,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Zap,
    Scale,
    FileCode,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArchitectureIndex() {
    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased p-6 md:p-12">
            <Head title="System Architecture & High-Concurrency Whitepaper" />

            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white mb-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Storefront
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white tracking-tight">Technical Architecture Specification</h1>
                        <Badge variant="outline" className="text-rose-400 border-rose-500/30">
                            Senior Level Blueprint
                        </Badge>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1">
                        Mathematical formalization of zero-overselling inventory locks and distributed event ticketing.
                    </p>
                </div>

                {/* Layer Stack Grid */}
                <div className="grid gap-6 md:grid-cols-3 mb-10">
                    <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                        <Cpu className="h-6 w-6 text-rose-400 mb-3" />
                        <h3 className="font-bold text-white text-base">Backend & Domain</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            Laravel 11, PHP 8.3 with strict typing (`declare(strict_types=1)`), Single-responsibility Actions,
                            immutable DTOs, and PHPStan Level 8 static analysis.
                        </p>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                        <Database className="h-6 w-6 text-emerald-400 mb-3" />
                        <h3 className="font-bold text-white text-base">Database & Locks</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            PostgreSQL 16 / InnoDB row-level pessimistic locking (`SELECT ... FOR UPDATE`), transaction isolation,
                            and Redis in-memory session/cache layers.
                        </p>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                        <Layers className="h-6 w-6 text-indigo-400 mb-3" />
                        <h3 className="font-bold text-white text-base">Client & Reactive UI</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            React 19, TypeScript, Inertia.js SPA protocol, Tailwind CSS v4 design tokens, and shadcn accessible
                            primitives.
                        </p>
                    </Card>
                </div>

                {/* Deep Dive: Concurrency Invariant Proof */}
                <div className="space-y-8">
                    <Card className="border-zinc-800 bg-zinc-900/80 p-8">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-rose-400" />
                            The Inventory Invariant Theorem
                        </h2>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                            In a ticketing flash sale with capacity C, let S_confirmed be the sum of confirmed sold
                            tickets, and H_active be the sum of unexpired reserved holds. The system enforces the strict
                            invariant:
                        </p>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-center text-rose-300 text-sm sm:text-base my-4">
                            S_confirmed + H_active + Q_requested &le; Capacity
                        </div>

                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Because SQLite/PostgreSQL enforces pessimistic row locking, concurrent transactions are serialized at
                            the database engine level. If any transaction attempts to exceed capacity, an atomic rollback occurs,
                            throwing <code className="text-rose-400 bg-zinc-800 px-1 py-0.5 rounded text-xs">InsufficientTicketsException</code> with zero state leakage.
                        </p>
                    </Card>

                    {/* Canadian Tax Engine Specs */}
                    <Card className="border-zinc-800 bg-zinc-900/80 p-8">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <Scale className="h-5 w-5 text-amber-400" />
                            Canadian Statutory Tax Architecture
                        </h2>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                            Designed specifically for Canadian cross-provincial ticketing compliance. The engine detects Forward
                            Sortation Areas (FSA) from Canadian postal codes and applies provincial rates:
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2 text-xs">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                <span className="font-bold text-white">Ontario (HST 13%)</span>
                                <p className="text-zinc-400 mt-1">Single harmonized rate applied across all ticket tiers.</p>
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                <span className="font-bold text-white">British Columbia (GST 5% + PST 7%)</span>
                                <p className="text-zinc-400 mt-1">Dual-stream tax calculation with individual ledger lines.</p>
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                <span className="font-bold text-white">Quebec (GST 5% + QST 9.975%)</span>
                                <p className="text-zinc-400 mt-1">Revenue Quebec compliant precision rounding formula.</p>
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                <span className="font-bold text-white">Alberta / Territories (GST 5% only)</span>
                                <p className="text-zinc-400 mt-1">Zero provincial sales tax applied.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
