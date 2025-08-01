import { FloatingActionButton } from '@/components/floating-action-button';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { type BreadcrumbItem } from '@/types';
import { Link } from 'lucide-react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs }: AppLayoutProps) => (
    <>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
            <Header />
            <main>
                {breadcrumbs && (
                    <nav className="mb-4">
                        <ol className="flex space-x-2 text-sm text-gray-600">
                            {breadcrumbs.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    {item.href ? (
                                        <Link href={item.href} className="hover:text-pink-600">
                                            {item.title}
                                        </Link>
                                    ) : (
                                        <span>{item.title}</span>
                                    )}
                                    {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
                {children}
            </main>
            <Footer />
            <FloatingActionButton />
        </div>
    </>
);
