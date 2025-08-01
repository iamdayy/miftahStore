'use client';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { Order, PaginatedResponse, SharedData } from '@/types';
import { exportAllOrders, exportDailyReport, exportMonthlyReport, exportWeeklyReport } from '@/utils/exports';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, DollarSign, Download, Eye, FileText, MoreHorizontal, Printer, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderPageProps extends SharedData {
    orders: PaginatedResponse<Order>;
}

export default function OrdersManagement() {
    const { orders } = usePage<OrderPageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredOrders = orders.data.filter((order) => {
        const matchesSearch =
            order.id.toString().includes(searchTerm.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleUpdateOrderStatus = (id: number, status: Order['status']) => {
        router.put(route('admin.orders.change-status', { id, status }));
    };

    const handleSetTrackingNumber = (id: number, trackingNumber: string) => {
        router.post(
            route('admin.shipping.add-tracking'),
            { tracking_number: trackingNumber, order_id: id },
            {
                preserveScroll: true,
            },
        );
    };

    const handleSetDelivered = (id: number) => {
        router.post(
            route('admin.shipping.set-delivered', id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return Clock;
            case 'completed':
                return CheckCircle;
            case 'cancelled':
                return MoreHorizontal;
            default:
                return Clock;
        }
    };
    const handleExportDaily = () => {
        const today = new Date().toISOString().split('T')[0];
        const dailyOrders = orders.data.filter((order) => order.created_at.split('T')[0] === today);

        const exportData = {
            date: today,
            totalOrders: dailyOrders.length,
            totalRevenue: dailyOrders.reduce((sum, order) => sum + parseInt(order.total_amount), 0),
            orders: dailyOrders.map((order) => ({
                id: order.id,
                customer: order.user.name,
                total: parseInt(order.total_amount),
                status: order.status,
                time: order.created_at,
            })),
        };

        exportDailyReport(exportData);
        alert(`Laporan harian untuk ${new Date(today).toLocaleDateString('id-ID')} berhasil diekspor!`);
    };

    const handleExportWeekly = () => {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));

        const weeklyOrders = orders.data.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= weekStart && orderDate <= weekEnd;
        });

        const exportData = {
            weekStart: weekStart.toISOString().split('T')[0],
            weekEnd: weekEnd.toISOString().split('T')[0],
            totalOrders: weeklyOrders.length,
            totalRevenue: weeklyOrders.reduce((sum, order) => sum + parseInt(order.total_amount), 0),
            orders: weeklyOrders.map((order) => ({
                id: order.id,
                customer: order.user.name,
                total: parseInt(order.total_amount),
                status: order.status,
                date: order.created_at.split('T')[0],
            })),
        };

        exportWeeklyReport(exportData);
        alert(`Laporan mingguan berhasil diekspor!`);
    };

    const handleExportMonthly = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const monthlyOrders = orders.data.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        const exportData = {
            month: currentMonth + 1,
            year: currentYear,
            totalOrders: monthlyOrders.length,
            totalRevenue: monthlyOrders.reduce((sum, order) => sum + parseInt(order.total_amount), 0),
            averageOrderValue:
                monthlyOrders.length > 0 ? monthlyOrders.reduce((sum, order) => sum + parseInt(order.total_amount), 0) / monthlyOrders.length : 0,
            orders: monthlyOrders.map((order) => ({
                id: order.id,
                customer: order.user.name,
                total: parseInt(order.total_amount),
                status: order.status,
                date: order.created_at.split('T')[0],
            })),
        };

        exportMonthlyReport(exportData);
        alert(
            `Laporan bulanan untuk ${new Date(currentYear, currentMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} berhasil diekspor!`,
        );
    };

    const handleExportAllOrders = () => {
        // const exportData = {
        //     totalOrders: orders.data.length,
        //     totalRevenue: orders.data.reduce((sum, order) => sum + parseInt(order.total_amount), 0),
        //     statusBreakdown: {
        //         pending: orders.data.filter((o) => o.status === 'pending').length,
        //         completed: orders.data.filter((o) => o.status === 'completed').length,
        //         cancelled: orders.data.filter((o) => o.status === 'cancelled').length,
        //     },
        //     orders: orders.data.map((order) => ({
        //         id: order.id,
        //         customer: order.user.name,
        //         email: order.user.email,
        //         total: parseInt(order.total_amount),
        //         discount: order.discount?.value || 0,
        //         status: order.status,
        //         itemCount: order.products.length,
        //         createdAt: order.created_at,
        //         updatedAt: order.updated_at,
        //     })),
        // };

        exportAllOrders(orders.data);
        alert('Semua pesanan berhasil diekspor!');
    };

    const printReport = () => {
        window.print();
    };

    if (!mounted) return null;

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
                                    Manajemen Pesanan
                                </h1>
                                <p className="mt-2 text-gray-600">Lacak dan kelola pesanan pelanggan</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="bg-white">
                                            <Download className="mr-2 h-4 w-4" />
                                            Ekspor Laporan
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleExportDaily}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Laporan Harian
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleExportWeekly}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Laporan Mingguan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleExportMonthly}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Laporan Bulanan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleExportAllOrders}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Semua Pesanan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={printReport}>
                                            <Printer className="mr-2 h-4 w-4" />
                                            Cetak Laporan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{orders.data.length}</div>
                                        <p className="text-xs text-green-600">+12% from last month</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{orders.data.filter((o) => o.status === 'pending').length}</div>
                                        <p className="text-xs text-yellow-600">Needs attention</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{orders.data.filter((o) => o.status === 'completed').length}</div>
                                        <p className="text-xs text-green-600">Successfully delivered</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            Rp. {orders.data.reduce((sum, o) => sum + parseInt(o.total_amount), 0).toLocaleString()}
                                        </div>
                                        <p className="text-xs text-green-600">Total value</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Filters */}
                        <Card className="mb-6 border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Search orders..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Orders Table */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <tr>
                                                <th className="p-4 text-left font-semibold text-gray-700">Order ID</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Customer</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Products</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Total</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Discount</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {filteredOrders.map((order, index) => {
                                                    const StatusIcon = getStatusIcon(order.status);
                                                    return (
                                                        <motion.tr
                                                            key={order.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                                            className="border-b border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                                                        >
                                                            <td className="p-4">
                                                                <div className="font-medium text-gray-900">#{order.id}</div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={order.user.avatar || '/placeholder.svg?height=32&width=32'}
                                                                        alt={order.user.name}
                                                                        className="h-8 w-8 rounded-full object-cover"
                                                                    />
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{order.user.name}</p>
                                                                        <p className="text-sm text-gray-500">{order.user.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="space-y-1">
                                                                    {order.products.slice(0, 2).map((product, idx) => (
                                                                        <p key={idx} className="text-sm text-gray-600">
                                                                            {product.name}
                                                                        </p>
                                                                    ))}
                                                                    {order.products.length > 2 && (
                                                                        <p className="text-xs text-gray-400">+{order.products.length - 2} more</p>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 font-semibold text-gray-900">
                                                                Rp. {parseInt(order.total_amount).toFixed(2)}
                                                            </td>
                                                            <td className="p-4 text-gray-700">{order.discount ? `${order.discount}%` : 'None'}</td>
                                                            <td className="p-4">
                                                                <Badge className={`${getStatusColor(order.status)} flex w-fit items-center gap-1`}>
                                                                    <StatusIcon className="h-3 w-3" />
                                                                    {order.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-4 text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                                                            <td className="p-4">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem>
                                                                            <Link
                                                                                href={route('admin.orders.show', order.id)}
                                                                                className="flex items-center"
                                                                            >
                                                                                <Eye className="mr-2 h-4 w-4" />
                                                                                View Details
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        {order.status === 'pending' && (
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                                                            >
                                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                                Mark Completed
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {order.status === 'pending' && (
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleSetTrackingNumber(
                                                                                        order.id,
                                                                                        prompt('Enter tracking number') || '',
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Clock className="mr-2 h-4 w-4" />
                                                                                Set Tracking Number
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {order.status === 'pending' && (
                                                                            <DropdownMenuItem onClick={() => handleSetDelivered(order.id)}>
                                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                                Mark as Delivered
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {order.status !== 'completed' && (
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                                                                                className="text-yellow-600"
                                                                            >
                                                                                <Clock className="mr-2 h-4 w-4" />
                                                                                Set to Pending
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {order.status !== 'cancelled' && (
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                                                                className="text-red-600"
                                                                            >
                                                                                Cancel Order
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
