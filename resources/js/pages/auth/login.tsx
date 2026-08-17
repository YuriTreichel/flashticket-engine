import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
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

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Mariana Souza",
    handle: "@marianasouza",
    text: "Plataforma sensacional! A experiência de compra de ingressos é incrivelmente rápida e sem complicações."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Rodrigo Lima",
    handle: "@rodrigolima",
    text: "O melhor portal de ingressos que já usei. Design moderno, seguro e com excelente suporte para os eventos."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Felipe Neves",
    handle: "@felipeneves",
    text: "Intuitivo, confiável e muito prático para gerenciar meus ingressos salvos direto no celular."
  },
];

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { name } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const heroImageSrc = "https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80";

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-background text-foreground overflow-hidden">
            <Head title="Entrar" />

            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold tracking-tighter leading-tight">
                                Bem-vindo ao {name || 'FlashTicket'}
                            </h1>
                            <p className="animate-element animate-delay-200 text-muted-foreground">
                                Acesse sua conta e garanta seus ingressos para os melhores eventos
                            </p>
                        </div>

                        {/* Passkey authentication row */}
                        <div className="animate-element animate-delay-300">
                            <PasskeyVerify label="Entrar com chave de acesso (Passkey)" separator="Ou entre com seu e-mail" />
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="animate-element animate-delay-400 space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Endereço de E-mail</Label>
                                        <GlassInputWrapper>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="Digite seu endereço de e-mail"
                                                className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none focus:ring-0 border-0"
                                            />
                                        </GlassInputWrapper>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="animate-element animate-delay-500 space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Senha</Label>
                                        <GlassInputWrapper>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Digite sua senha"
                                                    className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none focus:ring-0 border-0"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </GlassInputWrapper>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="animate-element animate-delay-600 flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="custom-checkbox"
                                            />
                                            <span className="text-foreground/90">Manter conectado</span>
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={request()}
                                                className="hover:underline text-violet-400 transition-colors font-medium"
                                                tabIndex={5}
                                            >
                                                Esqueceu sua senha?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="animate-element animate-delay-700 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm"
                                    >
                                        {processing && <Spinner />}
                                        Entrar
                                    </button>
                                </>
                            )}
                        </Form>

                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <div className="animate-element animate-delay-800 relative flex items-center justify-center">
                            <span className="w-full border-t border-border"></span>
                            <span className="px-4 text-xs font-medium text-muted-foreground bg-background absolute uppercase tracking-wider">Ou continue com</span>
                        </div>

                        <button className="animate-element animate-delay-900 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors cursor-pointer text-sm font-medium">
                            <GoogleIcon />
                            Continuar com o Google
                        </button>

                        <p className="animate-element animate-delay-1000 text-center text-sm text-muted-foreground">
                            Novo em nossa plataforma?{' '}
                            <Link href={register()} className="text-violet-400 hover:underline transition-colors font-medium">
                                Criar Conta
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="hidden md:block flex-1 relative p-4">
                    <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
                    {sampleTestimonials.length > 0 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
                            <TestimonialCard testimonial={sampleTestimonials[0]} delay="animate-delay-1000" />
                            {sampleTestimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={sampleTestimonials[1]} delay="animate-delay-1200" /></div>}
                            {sampleTestimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={sampleTestimonials[2]} delay="animate-delay-1400" /></div>}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
