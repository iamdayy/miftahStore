import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
    const { name } = usePage<SharedData>().props;
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-indigo-50 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full opacity-10"
                        style={{
                            width: Math.random() * 120 + 40,
                            height: Math.random() * 120 + 40,
                            background: [
                                'linear-gradient(45deg, #ff9a9e, #fecfef)',
                                'linear-gradient(45deg, #a8edea, #fed6e3)',
                                'linear-gradient(45deg, #ffecd2, #fcb69f)',
                                'linear-gradient(45deg, #ff8a80, #ea80fc)',
                                'linear-gradient(45deg, #8fd3f4, #84fab0)',
                            ][Math.floor(Math.random() * 5)],
                        }}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            rotate: 0,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            rotate: 360,
                        }}
                        transition={{
                            duration: Math.random() * 25 + 15,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                className="absolute top-4 left-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-2"
                    >
                        <ShoppingBag className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">{name}</span>
                </Link>
            </motion.div>
            {/* Main Content */}
            {children}
        </div>
    );
}
