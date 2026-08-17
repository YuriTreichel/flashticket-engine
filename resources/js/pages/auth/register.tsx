import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Eye, EyeOff } from 'lucide-react';

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
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Camila Ribeiro",
    handle: "@camilasocial",
    text: "Comprar ingressos nunca foi tão simples. Criei minha conta em segundos e já garanti minha entrada!"
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/85.jpg",
    name: "Thiago Silva",
    handle: "@thiagosilva",
    text: "Segurança total no pagamento e envio instantâneo dos ingressos para o celular. Recomendo muito!"
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Beatriz Costa",
    handle: "@biacosta",
    text: "O cadastro é super intuitivo. Ideal para quem não quer perder tempo na fila virtual."
  },
];

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const { name } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Concert/Event themed image for the ticket store
    const heroImageSrc = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2160&q=80";

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-background text-foreground overflow-hidden">
            <Head title="Criar Conta" />

            {/* Left column: hero image + testimonials */}
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

            {/* Right column: registration form */}
            <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold tracking-tighter leading-tight">
                                Criar Conta no {name || 'FlashTicket'}
                            </h1>
                            <p className="animate-element animate-delay-200 text-muted-foreground">
                                Crie sua conta e garanta acesso aos melhores eventos
                            </p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="animate-element animate-delay-300 space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
                                        <GlassInputWrapper>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                placeholder="Digite seu nome completo"
                                                className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none focus:ring-0 border-0"
                                            />
                                        </GlassInputWrapper>
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="animate-element animate-delay-400 space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Endereço de E-mail</Label>
                                        <GlassInputWrapper>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                tabIndex={2}
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
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    placeholder="Digite sua senha"
                                                    className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none focus:ring-0 border-0"
                                                    passwordrules={passwordRules}
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

                                    <div className="animate-element animate-delay-600 space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-muted-foreground">Confirmar Senha</Label>
                                        <GlassInputWrapper>
                                            <div className="relative">
                                                <input
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    placeholder="Confirme sua senha"
                                                    className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none focus:ring-0 border-0"
                                                    passwordrules={passwordRules}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </GlassInputWrapper>
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="animate-element animate-delay-700 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm"
                                    >
                                        {processing && <Spinner />}
                                        Criar Conta
                                    </button>
                                </>
                            )}
                        </Form>

                        <p className="animate-element animate-delay-800 text-center text-sm text-muted-foreground">
                            Já possui uma conta?{' '}
                            <Link href={login()} className="text-violet-400 hover:underline transition-colors font-medium">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
