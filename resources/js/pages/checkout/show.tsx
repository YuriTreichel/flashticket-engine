import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ReservationTimer } from '@/components/domain/ReservationTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2,
    CreditCard,
    Shield,
    MapPin,
    Calendar,
    ArrowLeft,
    Loader2,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface CheckoutProps {
    reservation: {
        id: number;
        quantity: number;
        expires_at: string;
        ticket_tier: {
            id: number;
            name: string;
            price: number | string;
            event: {
                id: number;
                title: string;
                venue: string | null;
                start_time: string | null;
            };
        };
    };
}

interface TaxBreakdown {
    province: string;
    subtotal: number;
    gst_amount: number;
    pst_amount: number;
    qst_amount: number;
    hst_amount: number;
    total_tax: number;
    total_amount: number;
}

export default function CheckoutShow({ reservation }: CheckoutProps) {
    const unitPrice = Number(reservation.ticket_tier.price);
    const subtotal = reservation.quantity * unitPrice;

    const [postalCode, setPostalCode] = useState('M5V 2T6'); // Default Toronto, ON
    const [calculatingTax, setCalculatingTax] = useState(false);
    const [taxData, setTaxData] = useState<TaxBreakdown | null>(null);

    const { post, processing } = useForm();

    const handleCalculateTax = async () => {
        if (!postalCode.trim()) return;
        setCalculatingTax(true);
        try {
            const res = await axios.post(
                `/reservations/${reservation.id}/tax`,
                {
                    postal_code: postalCode,
                },
            );
            if (res.data.success) {
                setTaxData(res.data.tax);
                toast.success(
                    `Tax calculated for Province: ${res.data.tax.province}`,
                );
            }
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                    'Invalid postal code format. Use format: A1A 1A1',
            );
        } finally {
            setCalculatingTax(false);
        }
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/reservations/${reservation.id}/pay`);
    };

    const totalToPay = taxData ? taxData.total_amount : subtotal;

    return (
        <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100 md:p-12">
            <Head title={`Checkout - ${reservation.ticket_tier.event.title}`} />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={`/events/${reservation.ticket_tier.event.id}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Event
                        </Button>
                    </Link>
                    <ReservationTimer expiresAt={reservation.expires_at} />
                </div>

                <div className="grid gap-8 md:grid-cols-12">
                    {/* Left: Billing and Payment Information */}
                    <div className="space-y-6 md:col-span-7">
                        <Card className="border-zinc-800 bg-zinc-900/80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-white">
                                    <MapPin className="h-5 w-5 text-rose-500" />{' '}
                                    Canadian Billing Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-zinc-300">
                                        Canadian Postal Code (FSA Tax Rate)
                                    </Label>
                                    <div className="mt-1.5 flex gap-2">
                                        <Input
                                            value={postalCode}
                                            onChange={(e) =>
                                                setPostalCode(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            placeholder="e.g. M5V 2T6"
                                            className="border-zinc-800 bg-zinc-950 font-mono uppercase"
                                            maxLength={7}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleCalculateTax}
                                            disabled={calculatingTax}
                                        >
                                            {calculatingTax ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Apply Tax'
                                            )}
                                        </Button>
                                    </div>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        Automatic computation of HST, GST, PST,
                                        and QST by Canada Post postal code.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method Simulation */}
                        <Card className="border-zinc-800 bg-zinc-900/80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-white">
                                    <CreditCard className="h-5 w-5 text-rose-500" />{' '}
                                    Payment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-12 items-center justify-center rounded bg-zinc-800 text-xs font-bold text-zinc-300">
                                            VISA
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">
                                                •••• •••• •••• 4242
                                            </div>
                                            <div className="text-xs text-zinc-500">
                                                Stripe Sandbox / Test Card
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400"
                                    >
                                        Ready
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <Shield className="h-4 w-4 text-emerald-400" />
                                    <span>
                                        256-Bit SSL Encrypted & PCI-DSS Level 1
                                        Compliant
                                    </span>
                                </div>

                                <form onSubmit={handlePayment} className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-12 w-full bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            `Confirm & Pay CAD $${totalToPay.toFixed(2)}`
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="md:col-span-5">
                        <Card className="sticky top-24 border-zinc-800 bg-zinc-900/90">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h4 className="text-base font-semibold text-white">
                                        {reservation.ticket_tier.event.title}
                                    </h4>
                                    <div className="mt-1 space-y-1 text-xs text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                            <span>
                                                {reservation.ticket_tier.event
                                                    .start_time
                                                    ? new Date(
                                                          reservation
                                                              .ticket_tier.event
                                                              .start_time,
                                                      ).toLocaleDateString(
                                                          'en-CA',
                                                          {
                                                              month: 'short',
                                                              day: 'numeric',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : 'TBA'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                                            <span>
                                                {reservation.ticket_tier.event
                                                    .venue ||
                                                    'Metro Toronto Convention Centre'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>
                                            {reservation.ticket_tier.name} ×{' '}
                                            {reservation.quantity}
                                        </span>
                                        <span className="font-mono text-white">
                                            CAD ${subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {taxData && (
                                        <>
                                            {taxData.hst_amount > 0 && (
                                                <div className="flex justify-between text-zinc-400">
                                                    <span>
                                                        HST ({taxData.province})
                                                    </span>
                                                    <span className="font-mono text-white">
                                                        CAD $
                                                        {taxData.hst_amount.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {taxData.gst_amount > 0 && (
                                                <div className="flex justify-between text-zinc-400">
                                                    <span>GST (5%)</span>
                                                    <span className="font-mono text-white">
                                                        CAD $
                                                        {taxData.gst_amount.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {taxData.pst_amount > 0 && (
                                                <div className="flex justify-between text-zinc-400">
                                                    <span>
                                                        PST ({taxData.province})
                                                    </span>
                                                    <span className="font-mono text-white">
                                                        CAD $
                                                        {taxData.pst_amount.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {taxData.qst_amount > 0 && (
                                                <div className="flex justify-between text-zinc-400">
                                                    <span>QST (Quebec)</span>
                                                    <span className="font-mono text-white">
                                                        CAD $
                                                        {taxData.qst_amount.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Separator className="bg-zinc-800" />

                                <div className="flex items-center justify-between pt-1 text-base font-bold text-white">
                                    <span>Total (CAD)</span>
                                    <span className="font-mono text-xl font-extrabold text-rose-400">
                                        CAD ${totalToPay.toFixed(2)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
