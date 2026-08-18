import { usePage } from '@inertiajs/react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const { component } = usePage();
    const layout = (component === 'auth/login' ? 'split' : 'simple') as 'simple' | 'card' | 'split';
    const Template = layout === 'split' ? AuthSplitLayout : (layout === 'card' ? AuthCardLayout : AuthSimpleLayout);

    return (
        <Template title={title} description={description}>
            {children}
        </Template>
    );
}
