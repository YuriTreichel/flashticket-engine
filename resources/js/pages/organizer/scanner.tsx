import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Camera,
    RefreshCw,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScannerProps {
    event: {
        id: number;
        title: string;
    };
}

interface ScanResultState {
    success: boolean;
    message: string;
    ticket?: {
        code: string;
        user?: {
            name: string;
            email: string;
        };
        ticket_tier?: {
            name: string;
        };
    };
}

export default function OrganizerScanner({ event }: ScannerProps) {
    const [scanResult, setScanResult] = useState<ScanResultState | null>(null);
    const [scanningActive, setScanningActive] = useState(true);
    const [manualPayload, setManualPayload] = useState('');
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const handleVerifyPayload = async (payload: string) => {
        try {
            const res = await axios.post(
                `/organizer/events/${event.id}/check-in`,
                {
                    qr_payload: payload,
                },
            );

            setScanResult({
                success: true,
                message: res.data.message || 'Ticket checked-in successfully!',
                ticket: res.data.ticket,
            });
        } catch (err: any) {
            setScanResult({
                success: false,
                message:
                    err.response?.data?.message ||
                    'Check-in failed / Invalid ticket.',
                ticket: err.response?.data?.ticket,
            });
        }
    };

    useEffect(() => {
        if (!scanningActive) {
            return;
        }

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            false,
        );

        scanner.render(
            (decodedText) => {
                handleVerifyPayload(decodedText);
            },
            (errorMessage) => {
                // scanning frame error (ignore continuous scan noise)
            },
        );

        scannerRef.current = scanner;

        return () => {
            scanner.clear().catch(console.error);
        };
    }, [scanningActive, event.id]);

    return (
        <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100 md:p-12">
            <Head title={`Gate Scanner - ${event.title}`} />

            <div className="mx-auto max-w-xl">
                <div className="mb-6">
                    <Link href="/organizer/dashboard">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-2 gap-2 text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Organizer
                            Portal
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-white">
                        Gate Admission Scanner
                    </h1>
                    <p className="text-xs text-zinc-400">{event.title}</p>
                </div>

                {/* Scan Feedback Banner */}
                {scanResult && (
                    <div
                        className={`mb-6 rounded-2xl border p-5 shadow-xl transition-all ${
                            scanResult.success
                                ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                                : 'border-red-500/40 bg-red-950/40 text-red-300'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {scanResult.success ? (
                                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
                            ) : (
                                <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-400" />
                            )}
                            <div className="space-y-1">
                                <h3 className="text-base font-bold">
                                    {scanResult.message}
                                </h3>
                                {scanResult.ticket?.user && (
                                    <p className="text-xs text-zinc-300">
                                        Attendee:{' '}
                                        <strong>
                                            {scanResult.ticket.user.name}
                                        </strong>{' '}
                                        ({scanResult.ticket.user.email})
                                    </p>
                                )}
                                {scanResult.ticket?.ticket_tier && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        Tier:{' '}
                                        {scanResult.ticket.ticket_tier.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Camera Viewport */}
                <Card className="overflow-hidden border-zinc-800 bg-zinc-900/90 shadow-2xl">
                    <CardHeader className="border-b border-zinc-800 pb-3">
                        <CardTitle className="flex items-center justify-between text-base text-white">
                            <span className="flex items-center gap-2">
                                <Camera className="h-4 w-4 text-rose-500" />{' '}
                                Live Optical Viewport
                            </span>
                            <Badge
                                variant="secondary"
                                className="bg-zinc-800 text-zinc-300"
                            >
                                Auto-Scanning
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div
                            id="qr-reader"
                            className="w-full overflow-hidden rounded-xl bg-black text-black"
                        />

                        {/* Manual Fallback for testing */}
                        <div className="mt-6 border-t border-zinc-800 pt-4">
                            <label className="mb-1.5 block text-xs text-zinc-400">
                                Or Paste Scanned QR Payload manually:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={manualPayload}
                                    onChange={(e) =>
                                        setManualPayload(e.target.value)
                                    }
                                    placeholder="Paste Base64 HMAC QR payload..."
                                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-rose-500 focus:outline-none"
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                        handleVerifyPayload(manualPayload)
                                    }
                                    disabled={!manualPayload.trim()}
                                >
                                    Validate
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
