'use client';

import { motion, Variants } from 'framer-motion';
import { CheckCircle, Clock, CreditCard, Heart, LogOut, Package, Settings, Truck, UserIcon, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Order, SharedData, User, Wishlist } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
        },
    },
};

interface DashboardPageProps extends SharedData {
    user: User;
    recentOrders: Order[];
    wishlistItems: Wishlist[];
    totalSpend: number;
}

export default function DashboardPage() {
    const { user, recentOrders, wishlistItems, totalSpend } = usePage<DashboardPageProps>().props;
    const [activeTab, setActiveTab] = useState('overview');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white';
            case 'shipped':
                return 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white';
            case 'processing':
                return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-400 to-pink-400 text-white';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="h-4 w-4" />;
            case 'shipped':
                return <Truck className="h-4 w-4" />;
            case 'processing':
                return <Clock className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <div className="container py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="sticky top-24 border-0 bg-white/80 shadow-lg backdrop-blur">
                            <CardContent className="p-6">
                                {/* User Profile */}
                                <div className="mb-6 text-center">
                                    <Avatar className="mx-auto mb-4 h-20 w-20 ring-4 ring-pink-100">
                                        <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-xl text-white">
                                            {user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <Badge className="mt-2 border-0 bg-gradient-to-r from-emerald-400 to-teal-400 text-white">
                                        Member since{' '}
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Badge>
                                </div>

                                {/* Navigation */}
                                <nav className="space-y-2">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: UserIcon },
                                        { id: 'orders', label: 'My Orders', icon: Package },
                                        { id: 'wishlist', label: 'Wishlist', icon: Heart },
                                        { id: 'profile', label: 'Profile Settings', icon: Settings },
                                    ].map((item) => (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all ${
                                                activeTab === item.id
                                                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
                                            }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </motion.button>
                                    ))}
                                </nav>

                                {/* Logout Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6 flex w-full items-center gap-3 rounded-lg border-t px-3 py-2 pt-6 text-left text-red-600 transition-all hover:bg-red-50"
                                >
                                    <Link href="/logout" method="post">
                                        <LogOut className="h-5 w-5" />
                                        <span className="font-medium">Logout</span>
                                    </Link>
                                </motion.button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <motion.div variants={itemVariants}>
                                    <h1 className="mb-2 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
                                        Welcome back, {user.name.split(' ')[0]}!
                                    </h1>
                                    <p className="text-gray-600">Here's what's happening with your account today.</p>
                                </motion.div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <motion.div variants={itemVariants}>
                                        <Card className="border-0 bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-emerald-100">Total Orders</p>
                                                        <p className="text-3xl font-bold">{recentOrders.length}</p>
                                                    </div>
                                                    <Package className="h-10 w-10 text-emerald-100" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Card className="border-0 bg-gradient-to-br from-pink-400 to-violet-400 text-white shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-pink-100">Total Spent</p>
                                                        <p className="text-2xl font-bold">{formatPrice(totalSpend)}</p>
                                                    </div>
                                                    <CreditCard className="h-10 w-10 text-pink-100" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Recent Activity */}
                                <motion.div variants={itemVariants}>
                                    <Card className="border-0 bg-white shadow-lg">
                                        <CardContent className="p-6">
                                            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                                            <ul className="space-y-4">
                                                {recentOrders.map((order) => (
                                                    <li key={order.id} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">Order #{order.id}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className={`flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Wishlist */}
                                <motion.div variants={itemVariants}>
                                    <Card className="border-0 bg-white shadow-lg">
                                        <CardContent className="p-6">
                                            <h2 className="mb-4 text-xl font-semibold">Wishlist</h2>
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {wishlistItems.map((item) => (
                                                    <Card key={item.id} className="transition-shadow hover:shadow-lg">
                                                        <CardContent className="p-4">
                                                            <img
                                                                src={'/storage/' + item.product.photo}
                                                                alt={item.product.name}
                                                                className="mb-4 h-40 w-full rounded-md object-cover"
                                                            />
                                                            <h3 className="text-lg font-medium">{item.product.name}</h3>
                                                            <p className="mt-1 text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                                                            {item.product.stock < 1 && (
                                                                <Badge className="mt-2 bg-red-100 text-red-600">Out of Stock</Badge>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        )}
                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h2 className="mb-4 text-2xl font-bold">My Orders</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {recentOrders.map((order) => (
                                        <Card key={order.id} className="transition-shadow hover:shadow-lg">
                                            <CardContent className="p-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="font-medium">Order #{order.id}</span>
                                                    <span className={`rounded-full px-3 py-1 text-xs ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <p className="mt-2 font-semibold">{formatPrice(parseInt(order.total_amount))}</p>
                                                <p className="mt-1 text-xs text-gray-400">Items: {order.products.length}</p>
                                                {order.shipping?.tracking_number && (
                                                    <p className="mt-1 text-xs text-blue-500">Tracking: {order.shipping.tracking_number}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h2 className="mb-4 text-2xl font-bold">My Wishlist</h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {wishlistItems.map((item) => (
                                        <Card key={item.id} className="transition-shadow hover:shadow-lg">
                                            <CardContent className="p-4">
                                                <img
                                                    src={item.product.photo}
                                                    alt={item.product.name}
                                                    className="mb-4 h-40 w-full rounded-md object-cover"
                                                />
                                                <h3 className="text-lg font-medium">{item.product.name}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                                                {item.product.stock < 1 && <Badge className="mt-2 bg-red-100 text-red-600">Out of Stock</Badge>}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {/* Profile Settings Tab */}
                        {activeTab === 'profile' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h2 className="mb-4 text-2xl font-bold">Profile Settings</h2>
                                <Card className="border-0 bg-white shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={user.name}
                                                    readOnly
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    readOnly
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                                <input
                                                    type="text"
                                                    value={user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : ''}
                                                    readOnly
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
