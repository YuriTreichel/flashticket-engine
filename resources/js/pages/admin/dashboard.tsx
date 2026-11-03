import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    DollarSign,
    Users,
    Ticket,
    Calendar,
    ArrowLeft,
    TrendingUp,
    Shield,
    CheckCircle2,
    Store,
    Film,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StorefrontLayout from '@/layouts/storefront-layout';

interface AdminDashboardProps {
    metrics: {
        total_organizations: number;
        total_events: number;
        tickets_sold: number;
        gross_volume: number;
        platform_earnings: number;
    };
    organizations: Array<{
        id: number;
        name: string;
        business_type: string;
        city: string | null;
        platform_fee_percent: number | string;
        events_count: number;
        status: string;
        user: { name: string; email: string };
    }>;
}

export default function AdminDashboard({
    metrics,
    organizations,
}: AdminDashboardProps) {
    return (
        <StorefrontLayout>
            <div className="p-6 md:p-12">
                <Head title="SaaS Platform Admin — FlashTicket Engine" />

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
                                    Platform Master Overview
                                </h1>
                                <Badge className="border-rose-500/20 bg-rose-500/10 text-rose-400">
                                    SaaS Root Operator
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-zinc-400">
                                Global health across all cinemas, circuses,
                                theaters and registered venues.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/organizer/dashboard">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-zinc-800 bg-zinc-900 text-zinc-300"
                                >
                                    Switch to Organizer View
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* SaaS Key Financial Gauges */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Registered Tenants
                                </CardTitle>
                                <Building2 className="h-4 w-4 text-rose-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-white">
                                    {metrics.total_organizations}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Cinemas, circuses & theaters
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Total Gross Volume
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-emerald-400">
                                    CAD $
                                    {metrics.gross_volume.toLocaleString(
                                        'en-CA',
                                        { minimumFractionDigits: 2 },
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Total attendee payments
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Platform Fee Revenue (5%)
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-amber-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-white">
                                    CAD $
                                    {metrics.platform_earnings.toLocaleString(
                                        'en-CA',
                                        { minimumFractionDigits: 2 },
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Your SaaS earnings
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    Active Events Hosted
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-indigo-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-black text-white">
                                    {metrics.total_events}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Live flash tiers
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Registered Client Organizations Table */}
                    <Card className="border-zinc-800 bg-zinc-900/80 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                    <Store className="h-5 w-5 text-rose-400" />
                                    Client Organizations (Cinemas, Theaters &
                                    Circuses)
                                </h3>
                                <p className="mt-0.5 text-xs text-zinc-400">
                                    Businesses hosting events using your
                                    FlashTicket engine instance.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-300">
                                <thead className="border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase">
                                    <tr>
                                        <th className="pb-3">Organization</th>
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">City</th>
                                        <th className="pb-3">Owner</th>
                                        <th className="pb-3">Commission</th>
                                        <th className="pb-3">Events</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60 text-xs">
                                    {organizations.map((org) => (
                                        <tr
                                            key={org.id}
                                            className="hover:bg-zinc-850/50 transition-colors"
                                        >
                                            <td className="py-4 font-bold text-white">
                                                {org.name}
                                            </td>
                                            <td className="py-4">
                                                <Badge
                                                    variant="outline"
                                                    className="border-zinc-700 text-[11px] uppercase"
                                                >
                                                    {org.business_type}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-zinc-400">
                                                {org.city || 'National'}
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <span className="font-medium text-white">
                                                        {org.user.name}
                                                    </span>
                                                    <span className="block text-[11px] text-zinc-500">
                                                        {org.user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 font-mono font-bold text-emerald-400">
                                                {org.platform_fee_percent}%
                                            </td>
                                            <td className="py-4 font-mono">
                                                {org.events_count} live
                                            </td>
                                            <td className="py-4">
                                                <Badge className="border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400">
                                                    {org.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </StorefrontLayout>
    );
}
