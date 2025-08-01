import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
    const { auth, categories, name } = usePage<SharedData>().props;
    const { user, cartItems } = auth;
    const links = [
        { title: 'Home', href: '/', isActive: route().current('home') },
        { title: 'Products', href: '/products', isActive: route().current('products.index') },
        ...categories.map((category) => ({
            title: category.name,
            href: route('products.category', { category: category.id }),
            isActive: route().current('products.category', { category: category.id }),
        })),
    ];
    return (
        <>
            {/* Head Section */}
            <Head title={`${links.find((link) => link.isActive)?.title}`} />
            {/* Animated Header with Iconic Colors */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-white/80"
                style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                    borderBottom: '1px solid rgba(236, 72, 153, 0.2)',
                }}
            >
                <div className="lg:px-8ner container flex h-16 w-full items-center justify-between px-2 md:px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                        >
                            <img src="/favicon.svg" alt="Logo" className="h-12 w-full rounded-full" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">{name}</span>
                    </Link>

                    <nav className="hidden items-center space-x-6 md:flex">
                        {links.map((link, index) => (
                            <motion.div
                                key={link.title}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={link.href} className="group relative text-sm font-medium transition-colors hover:text-pink-600">
                                    {link.title}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300 group-hover:w-full ${link.isActive ? 'w-full' : 'w-0'}`}
                                    ></span>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link href="/wishlist">
                                    <Button variant={route().current('wishlist') ? 'default' : 'ghost'} size="icon" className="hover:bg-pink-50">
                                        <Heart className="h-5 w-5 text-pink-500" />
                                        <AnimatePresence>
                                            {user.wishlistItems && user.wishlistItems.length > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-2 -right-2"
                                                >
                                                    <Badge className="flex h-5 w-5 items-center justify-center rounded-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 p-0 text-xs">
                                                        {user.wishlistItems.length}
                                                    </Badge>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </Link>
                            </motion.div>
                            <Link href="/cart">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                        variant={route().current('cart') ? 'default' : 'ghost'}
                                        size="icon"
                                        className="relative hover:bg-indigo-50"
                                    >
                                        <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                        <AnimatePresence>
                                            {cartItems && cartItems?.length > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-2 -right-2"
                                                >
                                                    <Badge className="flex h-5 w-5 items-center justify-center rounded-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 p-0 text-xs">
                                                        {cartItems.length}
                                                    </Badge>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href={user.role === 'admin' ? '/admin' : '/profile'}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                        Dashboard
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                        Login
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/register">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                        Register
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    )}
                </div>
            </motion.header>
        </>
    );
}
