import { Head, Link } from '@inertiajs/react';
import {
    HelpCircle,
    ArrowLeft,
    Clock,
    Lock,
    ShieldCheck,
    QrCode,
    CreditCard,
    MapPin,
    AlertCircle,
    ChevronDown,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import StorefrontLayout from '@/layouts/storefront-layout';

const FAQS = [
    {
        q: 'How does the 10-minute ticket hold work?',
        a: 'When you select your tickets and initiate checkout, our engine executes a pessimistic row-level lock (`SELECT ... FOR UPDATE`) in the database. This guarantees that your requested inventory is reserved exclusively for your session for exactly 10 minutes. If payment is not completed before the countdown expires, our background queue daemon automatically restores the tickets to the public inventory pool with zero manual intervention.',
    },
    {
        q: 'How does FlashTicket guarantee zero overselling during flash sales?',
        a: 'Unlike traditional systems that read availability and write updates in separate non-atomic steps (causing race conditions where 100 people buy the last 10 tickets), FlashTicket processes holding transactions inside strict ACID database transactions. Available tickets are calculated as `Total - (Confirmed + Active Unexpired Holds)`. Parallel requests competing for the same tier are queued and serialized at the database engine level.',
    },
    {
        q: 'How are Canadian sales taxes calculated?',
        a: 'We automatically detect your province via the Forward Sortation Area (FSA) of your Canadian postal code. The engine calculates the exact statutory rates: 13% HST for Ontario, 15% HST for Atlantic provinces (NS, NB, PE, NL), 5% GST + 7% PST for British Columbia & Manitoba, 5% GST + 6% PST for Saskatchewan, 5% GST + 9.975% QST for Quebec, and 5% GST only for Alberta and the Territories.',
    },
    {
        q: 'Are digital ticket QR codes secure against screenshots and counterfeiting?',
        a: 'Yes. Each ticket payload is dynamically signed using HMAC-SHA256 with the server application secret. The payload contains the ticket UUID, an expiration timestamp, and the cryptographic signature. Venue staff scan passes using our optical camera scanner, which rejects tampered codes, expired passes, and duplicate check-in attempts in real-time.',
    },
    {
        q: 'Can event organizers add custom ticket tiers?',
        a: 'Yes. Organizers can access the Organizer Portal to publish events, define tiered pricing (e.g. Early Bird, General Admission, VIP Pass), manage capacity quotas, view real-time occupancy rates, and operate the mobile admission scanner directly from their smartphone browser.',
    },
];

export default function FaqIndex() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <StorefrontLayout>
            <div className="p-6 md:p-12">
                <Head title="Frequently Asked Questions — FlashTicket Engine" />

                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white mb-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Storefront
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h1>
                            <Badge variant="outline" className="text-rose-400 border-rose-500/30">
                                Support & FAQ
                            </Badge>
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">
                            Learn how our concurrency engine, checkout locks, and fraud prevention work.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, idx) => {
                            const isOpen = openIndex === idx;

                            return (
                                <Card
                                    key={idx}
                                    className="border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all duration-200 cursor-pointer hover:border-zinc-700"
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                >
                                    <div className="p-6 flex items-center justify-between gap-4">
                                        <h3 className="font-bold text-white text-base flex items-center gap-2">
                                            <HelpCircle className="h-4 w-4 text-rose-400 shrink-0" />
                                            {faq.q}
                                        </h3>
                                        <ChevronDown
                                            className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180 text-white' : ''
                                            }`}
                                        />
                                    </div>

                                    {isOpen && (
                                        <CardContent className="px-6 pb-6 pt-0 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 mt-2 pt-4">
                                            {faq.a}
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}

