'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <div className="flex min-h-screen bg-fill-base">
            {!isAuthPage && <Sidebar />}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
