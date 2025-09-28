import LoginForm from '@/components/custom/LoginForm';
import AuthenticationService from '@/services/AuthenticationService';
import { redirect } from 'next/navigation';

export default async function LoginPage({
    params,
}: {
    params: Promise<{ error: string }>;
}) {
    const { error } = await params;
    let user = null;

    try {
        user = await AuthenticationService.me();
    } catch (error) {
        // Log error server-side (consider using a proper logging service)
        console.error('Authentication error:', error);
    }

    // Redirect after the try/catch block
    if (user) {
        redirect('/admin/dashboard');
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
            <LoginForm error={error} />
        </div>
    );
}
