import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Eye, EyeOff, Zap } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 48 48"
    >
        <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
        />
        <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
        />
    </svg>
);

export interface Testimonial {
    avatarSrc: string;
    name: string;
    handle: string;
    text: string;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
        {children}
    </div>
);

const TestimonialCard = ({
    testimonial,
    delay,
}: {
    testimonial: Testimonial;
    delay: string;
}) => (
    <div
        className={`animate-testimonial ${delay} flex w-64 items-start gap-3 rounded-3xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl dark:bg-zinc-800/40`}
    >
        <img
            src={testimonial.avatarSrc}
            className="h-10 w-10 rounded-2xl object-cover"
            alt="avatar"
        />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-medium">
                {testimonial.name}
            </p>
            <p className="text-muted-foreground">{testimonial.handle}</p>
            <p className="mt-1 text-foreground/80">{testimonial.text}</p>
        </div>
    </div>
);

const sampleTestimonials: Testimonial[] = [
    {
        avatarSrc: 'https://randomuser.me/api/portraits/women/57.jpg',
        name: 'Sarah Jenkins',
        handle: '@sarahj_tech',
        text: 'Lightning-fast checkout experience. Reserved my seats in seconds with zero queues or hiccups.',
    },
    {
        avatarSrc: 'https://randomuser.me/api/portraits/men/64.jpg',
        name: 'Marcus Vance',
        handle: '@marcusvance',
        text: 'The best ticketing engine I have used. Sleek, secure, and fraud-proof digital wallet delivery.',
    },
    {
        avatarSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
        name: 'David Chen',
        handle: '@dchen_live',
        text: 'Intuitive, highly dependable, and flawless real-time mobile QR passes right on my phone.',
    },
];

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const heroImageSrc =
        'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80';

    return (
        <div className="font-geist flex h-[100dvh] w-[100dvw] flex-col overflow-hidden bg-background text-foreground md:flex-row">
            <Head title="Sign In — FlashTicket" />

            {/* Left column: sign-in form */}
            <section className="relative flex flex-1 items-center justify-center overflow-y-auto p-8">
                <div className="w-full max-w-md py-8">
                    <div className="flex flex-col gap-6">
                        {/* Logo Link to home */}
                        <div className="animate-element">
                            <Link href="/" className="inline-flex items-center gap-2.5 group">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-md shadow-rose-600/25 transition-transform group-hover:scale-105">
                                    <Zap className="h-4.5 w-4.5 text-white fill-white" />
                                </div>
                                <div className="flex items-baseline tracking-tight">
                                    <span className="text-xl font-black text-foreground">flash</span>
                                    <span className="text-xl font-light text-muted-foreground">ticket</span>
                                </div>
                            </Link>
                        </div>

                        <div className="space-y-1">
                            <h1 className="animate-element text-3xl sm:text-4xl leading-tight font-bold tracking-tight text-foreground">
                                Sign In
                            </h1>
                            <p className="animate-element text-sm text-muted-foreground">
                                Access your account to manage your reservations and tickets
                            </p>
                        </div>

                        {/* Passkey authentication row */}
                        <div className="animate-element animate-delay-300">
                            <PasskeyVerify
                                label="Sign in with Passkey"
                                separator="Or sign in with email"
                            />
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="animate-element space-y-2 animate-delay-400">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Email Address
                                        </Label>
                                        <GlassInputWrapper>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="name@example.com"
                                                className="w-full rounded-2xl border-0 bg-transparent p-4 text-sm focus:ring-0 focus:outline-none"
                                            />
                                        </GlassInputWrapper>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="animate-element space-y-2 animate-delay-500">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Password
                                        </Label>
                                        <GlassInputWrapper>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="w-full rounded-2xl border-0 bg-transparent p-4 pr-12 text-sm focus:ring-0 focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute inset-y-0 right-4 flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </GlassInputWrapper>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex animate-element items-center justify-between text-sm animate-delay-600">
                                        <label className="flex cursor-pointer items-center gap-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="custom-checkbox"
                                            />
                                            <span className="text-foreground/90">
                                                Remember me
                                            </span>
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={request()}
                                                className="font-medium text-rose-500 transition-colors hover:underline"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full animate-element cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-600 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-colors animate-delay-700 hover:bg-rose-500"
                                    >
                                        {processing && <Spinner />}
                                        Sign In
                                    </button>
                                </>
                            )}
                        </Form>

                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-emerald-500">
                                {status}
                            </div>
                        )}

                        <div className="relative flex animate-element items-center justify-center animate-delay-800">
                            <span className="w-full border-t border-border"></span>
                            <span className="absolute bg-background px-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                Or continue with
                            </span>
                        </div>

                        <button className="flex w-full animate-element cursor-pointer items-center justify-center gap-3 rounded-2xl border border-border py-4 text-sm font-medium transition-colors animate-delay-900 hover:bg-secondary">
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <p className="animate-element text-center text-sm text-muted-foreground animate-delay-1000">
                            Don't have an account?{' '}
                            <Link
                                href={register()}
                                className="font-semibold text-rose-500 transition-colors hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="relative hidden flex-1 p-4 md:block">
                    <div
                        className="absolute inset-4 animate-slide-left rounded-3xl bg-cover bg-center animate-delay-300"
                        style={{ backgroundImage: `url(${heroImageSrc})` }}
                    ></div>
                    {sampleTestimonials.length > 0 && (
                        <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 justify-center gap-4 px-8">
                            <TestimonialCard
                                testimonial={sampleTestimonials[0]}
                                delay="animate-delay-1000"
                            />
                            {sampleTestimonials[1] && (
                                <div className="hidden xl:flex">
                                    <TestimonialCard
                                        testimonial={sampleTestimonials[1]}
                                        delay="animate-delay-1200"
                                    />
                                </div>
                            )}
                            {sampleTestimonials[2] && (
                                <div className="hidden 2xl:flex">
                                    <TestimonialCard
                                        testimonial={sampleTestimonials[2]}
                                        delay="animate-delay-1400"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
