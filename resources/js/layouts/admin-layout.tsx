import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <AdminSidebar />

            <div className="flex flex-1 flex-col">
                <AdminHeader />

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
