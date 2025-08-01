'use client';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Order, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, DollarSign, Eye, Package, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// // Mock data for charts
// const salesData = [
//     { month: 'Jan', penjualan: 45000000, pesanan: 320, pelanggan: 180 },
//     { month: 'Feb', penjualan: 52000000, pesanan: 380, pelanggan: 220 },
//     { month: 'Mar', penjualan: 48000000, pesanan: 350, pelanggan: 200 },
//     { month: 'Apr', penjualan: 61000000, pesanan: 420, pelanggan: 280 },
//     { month: 'May', penjualan: 55000000, pesanan: 390, pelanggan: 250 },
//     { month: 'Jun', penjualan: 67000000, pesanan: 480, pelanggan: 320 },
//     { month: 'Jul', penjualan: 72000000, pesanan: 520, pelanggan: 350 },
// ];

// const categoryData = [
//     { name: 'Pakaian Wanita', value: 35, count: 245, color: '#8b5cf6' },
//     { name: 'Pakaian Pria', value: 28, count: 189, color: '#06b6d4' },
//     { name: 'Sepatu', value: 20, count: 134, color: '#10b981' },
//     { name: 'Aksesoris', value: 12, count: 89, color: '#f59e0b' },
//     { name: 'Tas', value: 5, count: 45, color: '#ef4444' },
// ];

// const dailyOrdersData = [
//     { day: 'Sen', pesanan: 45, pendapatan: 12500000 },
//     { day: 'Sel', pesanan: 52, pendapatan: 15200000 },
//     { day: 'Rab', pesanan: 48, pendapatan: 13800000 },
//     { day: 'Kam', pesanan: 61, pendapatan: 18900000 },
//     { day: 'Jum', pesanan: 55, pendapatan: 16700000 },
//     { day: 'Sab', pesanan: 67, pendapatan: 21200000 },
//     { day: 'Min', pesanan: 43, pendapatan: 11800000 },
// ];

// const topProducts = [
//     { name: 'Jaket Kulit Designer', terjual: 245, pendapatan: 73455000, pertumbuhan: 12 },
//     { name: 'Tas Mewah Premium', terjual: 189, pendapatan: 113211000, pertumbuhan: 8 },
//     { name: 'Sepatu Sneakers', terjual: 167, pendapatan: 33383000, pertumbuhan: 15 },
//     { name: 'Dress Elegant', terjual: 134, pendapatan: 53466000, pertumbuhan: 5 },
//     { name: 'Jam Tangan Klasik', terjual: 98, pendapatan: 78402000, pertumbuhan: -3 },
// ];

// const recentOrders = [
//     {
//         id: 'ORD-001',
//         customer: 'Sarah Johnson',
//         total: 1299000,
//         status: 'completed',
//         time: '2 menit lalu',
//     },
//     {
//         id: 'ORD-002',
//         customer: 'Ahmad Rahman',
//         total: 899000,
//         status: 'pending',
//         time: '5 menit lalu',
//     },
//     {
//         id: 'ORD-003',
//         customer: 'Maria Santos',
//         total: 1599000,
//         status: 'processing',
//         time: '8 menit lalu',
//     },
//     {
//         id: 'ORD-004',
//         customer: 'David Chen',
//         total: 749000,
//         status: 'completed',
//         time: '12 menit lalu',
//     },
// ];

interface SalesData {
    month: string;
    penjualan: number;
    pesanan: number;
    pelanggan: number;
}

interface CategoryData {
    name: string;
    value: number;
    count: number;
    color: string;
}

interface DailyOrdersData {
    day: string;
    pesanan: number;
    pendapatan: number;
}

interface TopProducts {
    name: string;
    terjual: number;
    pendapatan: number;
    pertumbuhan: number;
}

interface DashboardPageProps extends SharedData {
    salesData: SalesData[];
    categoryData: CategoryData[];
    dailyOrdersData: DailyOrdersData[];
    topProducts: TopProducts[];
    recentOrders: Order[];
}

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const { salesData, categoryData, dailyOrdersData, topProducts, recentOrders } = usePage<DashboardPageProps>().props;
    console.log('Dashboard Data:', { salesData, categoryData, dailyOrdersData, topProducts, recentOrders });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <AdminSidebar />

            <div className="flex flex-1 flex-col">
                <AdminHeader />

                <main className="flex-1 p-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                                    Dashboard Admin
                                </h1>
                                <p className="mt-2 text-gray-600">Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{new Date().toLocaleDateString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <Card className="relative overflow-hidden border-0 shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10" />
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatPrice(salesData[0]?.penjualan || 0)}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <Card className="relative overflow-hidden border-0 shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-10" />
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                                        <ShoppingCart className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatPrice(salesData[0]?.pesanan || 0)}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <Card className="relative overflow-hidden border-0 shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-10" />
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Rata-rata Pesanan</CardTitle>
                                        <Package className="h-4 w-4 text-orange-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatPrice(
                                                recentOrders.map((order) => parseInt(order.total_amount)).reduce((acc, curr) => acc + curr, 0) || 0,
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Charts Section */}
                        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Sales Trend Chart */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-blue-600" />
                                            Tren Penjualan
                                        </CardTitle>
                                        <CardDescription>Penjualan bulanan dalam 7 bulan terakhir</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer
                                            config={{
                                                penjualan: {
                                                    label: 'Penjualan',
                                                    color: 'hsl(var(--chart-1))',
                                                },
                                                pesanan: {
                                                    label: 'Pesanan',
                                                    color: 'hsl(var(--chart-2))',
                                                },
                                            }}
                                            className="h-[300px]"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={salesData}>
                                                    <defs>
                                                        <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                                    <ChartTooltip
                                                        content={<ChartTooltipContent />}
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        formatter={(value: any, name: string) => [
                                                            name === 'penjualan' ? formatPrice(value) : value,
                                                            name === 'penjualan' ? 'Penjualan' : 'Pesanan',
                                                        ]}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="penjualan"
                                                        stroke="#8884d8"
                                                        fillOpacity={1}
                                                        fill="url(#colorPenjualan)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Category Distribution */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5 text-green-600" />
                                            Distribusi Kategori
                                        </CardTitle>
                                        <CardDescription>Penjualan berdasarkan kategori produk</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer
                                            config={{
                                                value: {
                                                    label: 'Persentase',
                                                    color: 'hsl(var(--chart-1))',
                                                },
                                            }}
                                            className="h-[300px]"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <ChartTooltip
                                                        content={({ active, payload }) => {
                                                            if (active && payload && payload.length) {
                                                                const data = payload[0].payload;
                                                                return (
                                                                    <div className="rounded-lg border bg-white p-3 shadow-lg">
                                                                        <p className="font-medium">{data.name}</p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {data.value}% ({data.count} produk)
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                    <Legend
                                                        verticalAlign="bottom"
                                                        height={36}
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        formatter={(value, entry: any) => <span style={{ color: entry.color }}>{value}</span>}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Daily Orders Chart */}
                        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="lg:col-span-2"
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-purple-600" />
                                            Pesanan Harian
                                        </CardTitle>
                                        <CardDescription>Jumlah pesanan dan pendapatan per hari dalam seminggu</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer
                                            config={{
                                                pesanan: {
                                                    label: 'Pesanan',
                                                    color: 'hsl(var(--chart-1))',
                                                },
                                                pendapatan: {
                                                    label: 'Pendapatan',
                                                    color: 'hsl(var(--chart-2))',
                                                },
                                            }}
                                            className="h-[300px]"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={dailyOrdersData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="day" />
                                                    <YAxis yAxisId="left" />
                                                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value / 1000000}M`} />
                                                    <ChartTooltip
                                                        content={<ChartTooltipContent />}
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        formatter={(value: any, name: string) => [
                                                            name === 'pendapatan' ? formatPrice(value) : value,
                                                            name === 'pendapatan' ? 'Pendapatan' : 'Pesanan',
                                                        ]}
                                                    />
                                                    <Legend />
                                                    <Bar yAxisId="left" dataKey="pesanan" fill="#8884d8" name="Pesanan" />
                                                    <Bar yAxisId="right" dataKey="pendapatan" fill="#82ca9d" name="Pendapatan" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Recent Orders */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Eye className="h-5 w-5 text-orange-600" />
                                            Pesanan Terbaru
                                        </CardTitle>
                                        <CardDescription>Aktivitas pesanan terkini</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentOrders.map((order, index) => (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-3"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{order.user.name}</p>
                                                        <p className="text-xs text-gray-600">{order.id}</p>
                                                        <Badge className={`mt-1 text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold">{formatPrice(parseInt(order.total_amount))}</p>
                                                        <p className="text-xs text-gray-500">{order.created_at}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <Link href={route('admin.orders.index')}>
                                            <Button variant="outline" className="mt-4 w-full bg-transparent">
                                                Lihat Semua Pesanan
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Top Products Table */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        Produk Terlaris
                                    </CardTitle>
                                    <CardDescription>Produk dengan performa terbaik bulan ini</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="p-3 text-left font-semibold text-gray-700">Produk</th>
                                                    <th className="p-3 text-left font-semibold text-gray-700">Terjual</th>
                                                    <th className="p-3 text-left font-semibold text-gray-700">Pendapatan</th>
                                                    <th className="p-3 text-left font-semibold text-gray-700">Pertumbuhan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topProducts.map((product, index) => (
                                                    <motion.tr
                                                        key={product.name}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        className="border-b border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                                                    >
                                                        <td className="p-3">
                                                            <div className="font-medium text-gray-900">{product.name}</div>
                                                        </td>
                                                        <td className="p-3 text-gray-700">{product.terjual}</td>
                                                        <td className="p-3 font-semibold text-gray-900">{formatPrice(product.pendapatan)}</td>
                                                        <td className="p-3">
                                                            <div
                                                                className={`flex items-center gap-1 ${
                                                                    product.pertumbuhan >= 0 ? 'text-green-600' : 'text-red-600'
                                                                }`}
                                                            >
                                                                {product.pertumbuhan >= 0 ? (
                                                                    <TrendingUp className="h-3 w-3" />
                                                                ) : (
                                                                    <TrendingDown className="h-3 w-3" />
                                                                )}
                                                                {Math.abs(product.pertumbuhan)}%
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
