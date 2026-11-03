import { Head, Link } from '@inertiajs/react';
import {
    Ticket,
    Calendar,
    MapPin,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StorefrontLayout from '@/layouts/storefront-layout';

interface TicketItem {
    id: number;
    code: string;
    status: string;
    used_at: string | null;
    created_at: string;
    qr_payload: string;
    tier_name: string;
    event_title: string;
    event_venue: string | null;
    event_start: string | null;
}

interface MyTicketsProps {
    tickets: TicketItem[];
}

export default function MyTickets({ tickets }: MyTicketsProps) {
    const [qrUrls, setQrUrls] = useState<Record<number, string>>({});

    useEffect(() => {
        tickets.forEach(async (ticket) => {
            try {
                const url = await QRCode.toDataURL(ticket.qr_payload, {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#ffffff',
                    },
                });
                setQrUrls((prev) => ({ ...prev, [ticket.id]: url }));
            } catch (err) {
                console.error(
                    'Failed to generate QR for ticket',
                    ticket.id,
                    err,
                );
            }
        });
    }, [tickets]);

    return (
        <StorefrontLayout>
            <div className="p-6 md:p-12">
                <Head title="My Tickets - FlashTicket Engine" />

                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mb-2 gap-2 text-zinc-400 hover:text-white"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Back to
                                    Catalog
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-extrabold text-white">
                                My Digital Tickets
                            </h1>
                            <p className="text-sm text-zinc-400">
                                Cryptographically verified HMAC-SHA256 entry
                                passes. Present at venue gate.
                            </p>
                        </div>

                        <Link href="/">
                            <Button className="bg-rose-600 hover:bg-rose-500">
                                Discover More Events
                            </Button>
                        </Link>
                    </div>

                    {tickets.length === 0 ? (
                        <Card className="border-zinc-800 bg-zinc-900/60 p-12 text-center">
                            <Ticket className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
                            <h3 className="mb-2 text-lg font-bold text-white">
                                No tickets purchased yet
                            </h3>
                            <p className="mb-6 text-sm text-zinc-400">
                                Explore our live events and secure your tickets.
                            </p>
                            <Link href="/">
                                <Button className="bg-rose-600 hover:bg-rose-500">
                                    Browse Events
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {tickets.map((ticket) => {
                                const isUsed = ticket.status === 'used';

                                return (
                                    <Card
                                        key={ticket.id}
                                        className={`relative overflow-hidden border-zinc-800 bg-zinc-900/90 shadow-xl transition-all ${
                                            isUsed
                                                ? 'opacity-60'
                                                : 'hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="p-6">
                                            <div className="mb-4 flex items-start justify-between gap-4">
                                                <div>
                                                    <Badge
                                                        variant={
                                                            isUsed
                                                                ? 'secondary'
                                                                : 'default'
                                                        }
                                                        className={
                                                            isUsed
                                                                ? 'bg-zinc-800 text-zinc-400'
                                                                : 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
                                                        }
                                                    >
                                                        {isUsed
                                                            ? 'Already Checked-in'
                                                            : 'Valid Entry Pass'}
                                                    </Badge>
                                                    <h3 className="mt-2 text-xl font-bold text-white">
                                                        {ticket.event_title}
                                                    </h3>
                                                    <p className="text-sm font-semibold text-rose-400">
                                                        {ticket.tier_name}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-white p-2 shadow-inner">
                                                    {qrUrls[ticket.id] ? (
                                                        <img
                                                            src={
                                                                qrUrls[
                                                                    ticket.id
                                                                ]
                                                            }
                                                            alt="Ticket Entry QR Code"
                                                            className="h-28 w-28 object-contain"
                                                        />
                                                    ) : (
                                                        <div className="h-28 w-28 animate-pulse rounded bg-zinc-200" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 border-t border-zinc-800/80 pt-4 text-xs text-zinc-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                    <span>
                                                        {ticket.event_start
                                                            ? new Date(
                                                                  ticket.event_start,
                                                              ).toLocaleDateString(
                                                                  'en-CA',
                                                                  {
                                                                      weekday:
                                                                          'short',
                                                                      month: 'short',
                                                                      day: 'numeric',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : 'TBA'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                                                    <span>
                                                        {ticket.event_venue ||
                                                            'Metro Toronto Convention Centre'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-zinc-500">
                                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                                    <span>
                                                        UUID: {ticket.code}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
