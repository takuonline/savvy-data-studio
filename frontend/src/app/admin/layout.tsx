'use client';

import NavigationBar from '@/components/custom/NavigationBar';
import SideBar from '@/components/custom/SideBar';
import withAuth from '@/components/custom/withAuth';
import { ReactFlowProvider } from 'reactflow';

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className=" flex space-x-8  ">
            <SideBar />

            <main className="flex h-screen w-full flex-col">
                <ReactFlowProvider>
                    <NavigationBar />
                    <div className=" mt-3 rounded-tl-3xl bg-muted ">
                        {children}
                    </div>
                </ReactFlowProvider>
            </main>
        </div>
    );
    // return <main className=" mt-3 rounded-tl-3xl bg-muted ">{children}</main>;
}

export default withAuth(RootLayout);
