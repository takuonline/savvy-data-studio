'use client';

import AuthenticationService from '@/services/AuthenticationService';
import { redirect } from 'next/navigation';
import * as React from 'react';
import useSWR from 'swr';

import LoadingSpinner from './LoadingSpinner';

function useUserAuth() {
    const { data, error } = useSWR('verify', AuthenticationService.verify, );

    const loading = !data && !error;
    const loggedOut = error && error.status === 403;

    if (error && !loggedOut) {
        redirect('/login');
    }

    return {
        loading,
        loggedOut,
        data,
    };
}

export default function withAuth(Component: any) {
    return function WithAuth(props: any) {
        const [mounted, setMounted] = React.useState(false);
        React.useEffect(() => setMounted(true), []);

        const { data, loading, loggedOut } = useUserAuth();

        // prevents nextjs hydration errors
        if (!mounted) return null;

        if (loading) {
            return (
                <div>
                    <main className="flex h-screen w-screen items-center justify-center">
                        <LoadingSpinner />
                        <p>Loading...</p>
                    </main>
                </div>
            );
        }

        return <Component {...props} />;
    };
}
