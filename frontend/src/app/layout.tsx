import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/features/provider';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Savvy Analytics',
    description: 'Advanced analytics app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${poppins.className} `}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        <main className="h-full ">{children}</main>
                    </Providers>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
