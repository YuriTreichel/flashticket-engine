import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Plus,
    Trash2,
    Sparkles,
    Image as ImageIcon,
    Tag,
    DollarSign,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TierInput {
    name: string;
    price: string | number;
    total_quantity: number;
}

export default function CreateEvent() {
    const [tiers, setTiers] = useState<TierInput[]>([
        { name: 'General Admission', price: 50, total_quantity: 150 },
        { name: 'VIP Pass', price: 120, total_quantity: 30 },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        location: 'Metro Toronto Convention Centre, ON',
        category: 'Technology',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
        start_date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 16),
        end_date: '',
        tiers: tiers,
    });

    const addTier = () => {
        const newTiers = [...tiers, { name: 'New Tier', price: 60, total_quantity: 50 }];
        setTiers(newTiers);
        setData('tiers', newTiers);
    };

    const removeTier = (index: number) => {
        if (tiers.length <= 1) return;
        const newTiers = tiers.filter((_, i) => i !== index);
        setTiers(newTiers);
        setData('tiers', newTiers);
    };

    const updateTier = (index: number, field: keyof TierInput, value: any) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setTiers(newTiers);
        setData('tiers', newTiers);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/organizer/events');
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased p-6 md:p-12">
            <Head title="Create New Event & Tiers — FlashTicket Organizer" />

            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <Link href="/organizer/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white mb-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-tight">Create New Event</h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Publish an event with custom ticket tiers and instant high-concurrency inventory locking.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event Details Card */}
                    <Card className="border-zinc-800 bg-zinc-900/80 p-6">
                        <CardHeader className="p-0 pb-6">
                            <CardTitle className="text-lg text-white">Event Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <div>
                                <Label className="text-zinc-300">Event Title</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Toronto AI & Concurrency Summit 2026"
                                    className="mt-1.5 bg-zinc-950 border-zinc-800 text-white"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-zinc-300">Category</Label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                                    >
                                        <option value="Technology">Technology</option>
                                        <option value="Music">Music & Shows</option>
                                        <option value="Food & Drink">Food & Drink</option>
                                        <option value="Arts & Film">Arts & Film</option>
                                    </select>
                                </div>

                                <div>
                                    <Label className="text-zinc-300">Venue & City</Label>
                                    <Input
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Metro Toronto Convention Centre, ON"
                                        className="mt-1.5 bg-zinc-950 border-zinc-800 text-white"
                                        required
                                    />
                                    {errors.location && <p className="text-xs text-rose-400 mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            <div>
                                <Label className="text-zinc-300">Banner Cover Image URL (Unsplash)</Label>
                                <Input
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="mt-1.5 bg-zinc-950 border-zinc-800 text-white"
                                />
                            </div>

                            <div>
                                <Label className="text-zinc-300">Start Date & Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1.5 bg-zinc-950 border-zinc-800 text-white w-full sm:w-80"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="text-zinc-300">Description</Label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the experience, schedule, and key attractions..."
                                    rows={4}
                                    className="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ticket Tiers Card */}
                    <Card className="border-zinc-800 bg-zinc-900/80 p-6">
                        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg text-white">Ticket Tiers & Capacity</CardTitle>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Configure pricing and finite inventory quotas.
                                </p>
                            </div>
                            <Button type="button" onClick={addTier} variant="outline" size="sm" className="gap-1.5 border-zinc-700 bg-zinc-800">
                                <Plus className="h-4 w-4" /> Add Tier
                            </Button>
                        </CardHeader>

                        <CardContent className="p-0 space-y-4 pt-2">
                            {tiers.map((tier, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/60">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <Label className="text-xs text-zinc-400">Tier Name</Label>
                                        <Input
                                            value={tier.name}
                                            onChange={(e) => updateTier(idx, 'name', e.target.value)}
                                            placeholder="General Admission"
                                            className="mt-1 bg-zinc-900 border-zinc-800 text-xs text-white"
                                            required
                                        />
                                    </div>

                                    <div className="w-full sm:w-36">
                                        <Label className="text-xs text-zinc-400">Price (CAD $)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={tier.price}
                                            onChange={(e) => updateTier(idx, 'price', e.target.value)}
                                            className="mt-1 bg-zinc-900 border-zinc-800 text-xs text-white"
                                            required
                                        />
                                    </div>

                                    <div className="w-full sm:w-36">
                                        <Label className="text-xs text-zinc-400">Total Quantity</Label>
                                        <Input
                                            type="number"
                                            value={tier.total_quantity}
                                            onChange={(e) => updateTier(idx, 'total_quantity', parseInt(e.target.value) || 0)}
                                            className="mt-1 bg-zinc-900 border-zinc-800 text-xs text-white"
                                            required
                                        />
                                    </div>

                                    <div className="pt-5 sm:pt-6">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={tiers.length <= 1}
                                            onClick={() => removeTier(idx)}
                                            className="text-zinc-500 hover:text-rose-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Publish Submit */}
                    <div className="flex items-center justify-end gap-4">
                        <Link href="/organizer/dashboard">
                            <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 px-8 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 gap-2"
                        >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
