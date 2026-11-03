import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Zap, Ticket, Activity, Lock, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StorefrontLayoutProps {
    children: ReactNode;
}

export function StorefrontLayout({ children }: StorefrontLayoutProps) {
    const { auth } = usePage<any>().props as {
        auth?: { user: { id: number; name: string; email: string } | null };
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-rose-500 selection:text-white font-sans antialiased flex flex-col justify-between">
            {/* Global Sticky Blurred Navbar */}
            <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-md shadow-rose-600/25 transition-transform group-hover:scale-105">
                                <Zap className="h-4.5 w-4.5 text-white fill-white" />
                            </div>
                            <div className="flex items-baseline tracking-tight">
                                <span className="text-lg font-black text-white">flash</span>
                                <span className="text-lg font-light text-zinc-400">ticket</span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
                            <Link href="/metrics" className="hover:text-white transition-colors flex items-center gap-1.5">
                                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Live Telemetry</span>
                            </Link>
                            <Link href="/architecture" className="hover:text-white transition-colors flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5 text-rose-400" />
                                <span>Architecture Proof</span>
                            </Link>
                            <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
                                <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />
                                <span>FAQ</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <>
                                <Link href="/my-tickets">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800"
                                    >
                                        <Ticket className="h-4 w-4 text-rose-400" />
                                        <span>My Tickets</span>
                                    </Button>
                                </Link>
                                <Link href="/organizer/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    >
                                        Organizer Gate
                                    </Button>
                                </Link>
                                <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-xs font-bold text-white shadow-inner">
                                    {auth.user.name.charAt(0)}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-300 hover:text-white hover:bg-zinc-900"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="bg-white font-semibold text-zinc-950 hover:bg-zinc-200 shadow-md shadow-white/10"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Page Content Body */}
            <main className="flex-1">{children}</main>

            {/* Global Standardized Footer */}
            <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-6 text-xs text-zinc-500 mt-auto">
                <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-rose-500 fill-rose-500" />
                        <span className="font-bold text-zinc-300">FlashTicket Engine</span>
                        <span>· High-Concurrency Ticketmaster Alternative</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-zinc-300 transition-colors">
                            Storefront
                        </Link>
                        <Link href="/architecture" className="hover:text-zinc-300 transition-colors">
                            Architecture Whitepaper
                        </Link>
                        <Link href="/metrics" className="hover:text-zinc-300 transition-colors">
                            Live Telemetry
                        </Link>
                        <Link href="/faq" className="hover:text-zinc-300 transition-colors">
                            FAQ
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StorefrontLayout;
