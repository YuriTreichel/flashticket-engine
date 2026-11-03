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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StorefrontLayout from '@/layouts/storefront-layout';

export default function ArchitectureIndex() {
    return (
        <StorefrontLayout>
            <div className="p-6 md:p-12">
                <Head title="System Architecture & High-Concurrency Whitepaper" />

                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
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
                                Technical Architecture Specification
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-rose-500/30 text-rose-400"
                            >
                                Senior Level Blueprint
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-zinc-400">
                            Mathematical formalization of zero-overselling
                            inventory locks and distributed event ticketing.
                        </p>
                    </div>

                    {/* Layer Stack Grid */}
                    <div className="mb-10 grid gap-6 md:grid-cols-3">
                        <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                            <Cpu className="mb-3 h-6 w-6 text-rose-400" />
                            <h3 className="text-base font-bold text-white">
                                Backend & Domain
                            </h3>
                            <p className="mt-1 text-xs text-zinc-400">
                                Laravel 11, PHP 8.3 with strict typing
                                (`declare(strict_types=1)`),
                                Single-responsibility Actions, immutable DTOs,
                                and PHPStan Level 8 static analysis.
                            </p>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                            <Database className="mb-3 h-6 w-6 text-emerald-400" />
                            <h3 className="text-base font-bold text-white">
                                Database & Locks
                            </h3>
                            <p className="mt-1 text-xs text-zinc-400">
                                PostgreSQL 16 / InnoDB row-level pessimistic
                                locking (`SELECT ... FOR UPDATE`), transaction
                                isolation, and Redis in-memory session/cache
                                layers.
                            </p>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                            <Layers className="mb-3 h-6 w-6 text-indigo-400" />
                            <h3 className="text-base font-bold text-white">
                                Client & Reactive UI
                            </h3>
                            <p className="mt-1 text-xs text-zinc-400">
                                React 19, TypeScript, Inertia.js SPA protocol,
                                Tailwind CSS v4 design tokens, and shadcn
                                accessible primitives.
                            </p>
                        </Card>
                    </div>

                    {/* Deep Dive: Concurrency Invariant Proof */}
                    <div className="space-y-8">
                        <Card className="border-zinc-800 bg-zinc-900/80 p-8">
                            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
                                <Lock className="h-5 w-5 text-rose-400" />
                                The Inventory Invariant Theorem
                            </h2>
                            <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                                In a ticketing flash sale with capacity C, let
                                S_confirmed be the sum of confirmed sold
                                tickets, and H_active be the sum of unexpired
                                reserved holds. The system enforces the strict
                                invariant:
                            </p>

                            <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center font-mono text-sm text-rose-300 sm:text-base">
                                S_confirmed + H_active + Q_requested &le;
                                Capacity
                            </div>

                            <p className="text-sm leading-relaxed text-zinc-300">
                                Because SQLite/PostgreSQL enforces pessimistic
                                row locking, concurrent transactions are
                                serialized at the database engine level. If any
                                transaction attempts to exceed capacity, an
                                atomic rollback occurs, throwing{' '}
                                <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs text-rose-400">
                                    InsufficientTicketsException
                                </code>{' '}
                                with zero state leakage.
                            </p>
                        </Card>

                        {/* Canadian Tax Engine Specs */}
                        <Card className="border-zinc-800 bg-zinc-900/80 p-8">
                            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
                                <Scale className="h-5 w-5 text-amber-400" />
                                Canadian Statutory Tax Architecture
                            </h2>
                            <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                                Designed specifically for Canadian
                                cross-provincial ticketing compliance. The
                                engine detects Forward Sortation Areas (FSA)
                                from Canadian postal codes and applies
                                provincial rates:
                            </p>

                            <div className="grid gap-3 text-xs sm:grid-cols-2">
                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                    <span className="font-bold text-white">
                                        Ontario (HST 13%)
                                    </span>
                                    <p className="mt-1 text-zinc-400">
                                        Single harmonized rate applied across
                                        all ticket tiers.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                    <span className="font-bold text-white">
                                        British Columbia (GST 5% + PST 7%)
                                    </span>
                                    <p className="mt-1 text-zinc-400">
                                        Dual-stream tax calculation with
                                        individual ledger lines.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                    <span className="font-bold text-white">
                                        Quebec (GST 5% + QST 9.975%)
                                    </span>
                                    <p className="mt-1 text-zinc-400">
                                        Revenue Quebec compliant precision
                                        rounding formula.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                                    <span className="font-bold text-white">
                                        Alberta / Territories (GST 5% only)
                                    </span>
                                    <p className="mt-1 text-zinc-400">
                                        Zero provincial sales tax applied.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
