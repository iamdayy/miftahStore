'use client';

import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon, LayoutDashboard, LogOut, Package, Plus, ShoppingCart, Users } from 'lucide-react';
import { useState } from 'react';

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = route().current();
    const { name } = usePage<SharedData>().props;
    console.log('pathname', pathname);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', isActive: pathname === 'admin' },
        { icon: ImageIcon, label: 'Banners', href: '/admin/banners', isActive: pathname === 'admin.banners.index' },
        { icon: Plus, label: 'Discounts', href: '/admin/discounts', isActive: pathname === 'admin.discounts.index' },
        { icon: Package, label: 'Products', href: '/admin/products', isActive: pathname === 'admin.products.index' },
        { icon: Users, label: 'Users', href: '/admin/users', isActive: pathname === 'admin.users.index' },
        { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', isActive: pathname === 'admin.orders.index' },
    ];
    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
                isCollapsed ? 'w-16' : 'w-64'
            } flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300`}
        >
            {/* Header */}
            <div className="border-b border-slate-700 p-4">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent"
                        >
                            {name} - Admin
                        </motion.h1>
                    )}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-lg p-1 transition-colors hover:bg-slate-700">
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => {
                        return (
                            <motion.li
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`group flex items-center gap-3 rounded-lg p-3 transition-all duration-200 ${
                                        item.isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    {!isCollapsed && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {item.isActive && (
                                        <motion.div layoutId="activeTab" className="absolute right-0 h-8 w-1 rounded-l-full bg-white" />
                                    )}
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-slate-700 p-4">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="group flex items-center gap-3 rounded-lg p-3 text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white"
                >
                    <LogOut size={20} />
                    {!isCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                            Logout
                        </motion.span>
                    )}
                </Link>
            </div>
        </motion.div>
    );
}
