import { Link, usePage, router } from '@inertiajs/react';
import {
    Zap,
    Ticket,
    Search,
    Compass,
    Calendar,
    HelpCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface StorefrontLayoutProps {
    children: ReactNode;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export function StorefrontLayout({
    children,
    searchQuery,
    onSearchChange,
}: StorefrontLayoutProps) {
    const { auth } = usePage<any>().props as {
        auth?: { user: { id: number; name: string; email: string } | null };
    };

    const [internalSearch, setInternalSearch] = useState(searchQuery ?? '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (onSearchChange) {
            onSearchChange(internalSearch);
        } else {
            router.get('/', { q: internalSearch }, { preserveState: true });
        }
    };

    const handleInputChange = (val: string) => {
        setInternalSearch(val);

        if (onSearchChange) {
            onSearchChange(val);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#09090b] font-sans text-zinc-100 antialiased selection:bg-rose-500 selection:text-white">
            {/* Global Sticky Blurred Navbar */}
            <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    {/* Left: Brand Logo & Main Navigation */}
                    <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-md shadow-rose-600/25 transition-transform group-hover:scale-105">
                                <Zap className="h-4 w-4 fill-white text-white" />
                            </div>
                            <div className="flex items-baseline tracking-tight">
                                <span className="text-base font-black text-white sm:text-lg">
                                    flash
                                </span>
                                <span className="text-base font-light text-zinc-400 sm:text-lg">
                                    ticket
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-4 text-xs font-semibold text-zinc-400 lg:flex">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 py-1 transition-colors hover:text-white"
                            >
                                <Compass className="h-3.5 w-3.5 text-zinc-400" />
                                <span>Explorar</span>
                            </Link>
                            <Link
                                href="/my-tickets"
                                className="flex items-center gap-1.5 py-1 transition-colors hover:text-white"
                            >
                                <Ticket className="h-3.5 w-3.5 text-zinc-400" />
                                <span>Meus Ingressos</span>
                            </Link>
                            <Link
                                href="/faq"
                                className="flex items-center gap-1.5 py-1 transition-colors hover:text-white"
                            >
                                <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
                                <span>Ajuda</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Center: Search Field */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="mx-2 max-w-md flex-1 sm:mx-4"
                    >
                        <div className="relative w-full">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                value={
                                    onSearchChange !== undefined
                                        ? (searchQuery ?? '')
                                        : internalSearch
                                }
                                onChange={(e) =>
                                    handleInputChange(e.target.value)
                                }
                                placeholder="Buscar eventos, shows, teatros..."
                                className="h-9 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pr-3 pl-9 text-xs text-zinc-200 transition-all placeholder:text-zinc-500 focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </form>

                    {/* Right: User Actions */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                        {auth?.user ? (
                            <>
                                <Link href="/my-tickets" className="sm:hidden">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 border-zinc-800 bg-zinc-900/80 text-zinc-200"
                                        title="Meus Ingressos"
                                    >
                                        <Ticket className="h-3.5 w-3.5 text-rose-400" />
                                    </Button>
                                </Link>
                                <Link
                                    href="/my-tickets"
                                    className="hidden sm:inline-flex"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/80 px-3 text-xs text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800"
                                    >
                                        <Ticket className="h-3.5 w-3.5 text-rose-400" />
                                        <span>Ingressos</span>
                                    </Button>
                                </Link>
                                <Link
                                    href="/organizer/dashboard"
                                    className="hidden md:inline-flex"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                    >
                                        Produtor
                                    </Button>
                                </Link>
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-xs font-bold text-white shadow-inner sm:h-8 sm:w-8">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white sm:px-3"
                                    >
                                        Entrar
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="h-8 bg-white px-3 text-xs font-semibold text-zinc-950 shadow-md shadow-white/10 hover:bg-zinc-200"
                                    >
                                        Cadastre-se
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
            <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 px-6 py-12 text-xs text-zinc-500">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 fill-rose-500 text-rose-500" />
                        <span className="font-bold text-zinc-300">
                            FlashTicket Engine
                        </span>
                        <span>· High-Concurrency Ticketmaster Alternative</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="transition-colors hover:text-zinc-300"
                        >
                            Storefront
                        </Link>
                        <Link
                            href="/architecture"
                            className="transition-colors hover:text-zinc-300"
                        >
                            Architecture Whitepaper
                        </Link>
                        <Link
                            href="/metrics"
                            className="transition-colors hover:text-zinc-300"
                        >
                            Live Telemetry
                        </Link>
                        <Link
                            href="/faq"
                            className="transition-colors hover:text-zinc-300"
                        >
                            FAQ
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StorefrontLayout;
