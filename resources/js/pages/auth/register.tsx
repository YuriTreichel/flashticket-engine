import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Eye, EyeOff, Zap } from 'lucide-react';

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
        avatarSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
        name: 'Camila Ribeiro',
        handle: '@camilasocial',
        text: 'Buying tickets has never been smoother. Created my account in seconds and instantly secured my spot!',
    },
    {
        avatarSrc: 'https://randomuser.me/api/portraits/men/85.jpg',
        name: 'Thiago Silva',
        handle: '@thiagosilva',
        text: 'Bank-grade security and instant ticket generation to my phone. Truly high-performance tech.',
    },
    {
        avatarSrc: 'https://randomuser.me/api/portraits/women/12.jpg',
        name: 'Beatriz Costa',
        handle: '@biacosta',
        text: 'Zero lag, clean aesthetics, and immediate QR access. Perfect for high-demand concert drops.',
    },
];

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Concert/Event themed image for the ticket store
    const heroImageSrc =
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2160&q=80';

    return (
        <div className="font-geist flex h-[100dvh] w-[100dvw] flex-col overflow-hidden bg-background text-foreground md:flex-row">
            <Head title="Register — FlashTicket" />

            {/* Left column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="relative hidden flex-1 p-4 md:block">
                    <div
                        className="absolute inset-4 animate-slide-right rounded-3xl bg-cover bg-center animate-delay-300"
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

            {/* Right column: registration form */}
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
                                Register
                            </h1>
                            <p className="animate-element text-sm text-muted-foreground">
                                Create your account to reserve live events with zero friction
                            </p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={[
                                'password',
                                'password_confirmation',
                            ]}
                            disableWhileProcessing
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="animate-element space-y-2 animate-delay-300">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Full Name
                                        </Label>
                                        <GlassInputWrapper>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                placeholder="Enter your full name"
                                                className="w-full rounded-2xl border-0 bg-transparent p-4 text-sm focus:ring-0 focus:outline-none"
                                            />
                                        </GlassInputWrapper>
                                        <InputError message={errors.name} />
                                    </div>

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
                                                tabIndex={2}
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
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    placeholder="Create a secure password"
                                                    className="w-full rounded-2xl border-0 bg-transparent p-4 pr-12 text-sm focus:ring-0 focus:outline-none"
                                                    passwordrules={
                                                        passwordRules
                                                    }
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

                                    <div className="animate-element space-y-2 animate-delay-600">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Confirm Password
                                        </Label>
                                        <GlassInputWrapper>
                                            <div className="relative">
                                                <input
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    placeholder="Confirm your password"
                                                    className="w-full rounded-2xl border-0 bg-transparent p-4 pr-12 text-sm focus:ring-0 focus:outline-none"
                                                    passwordrules={
                                                        passwordRules
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword,
                                                        )
                                                    }
                                                    className="absolute inset-y-0 right-4 flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </GlassInputWrapper>
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full animate-element cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-600 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-colors animate-delay-700 hover:bg-rose-500"
                                    >
                                        {processing && <Spinner />}
                                        Register
                                    </button>
                                </>
                            )}
                        </Form>

                        <p className="animate-element text-center text-sm text-muted-foreground animate-delay-800">
                            Already have an account?{' '}
                            <Link
                                href={login()}
                                className="font-semibold text-rose-500 transition-colors hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
