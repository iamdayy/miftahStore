'use client';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import type { Order, Payment, Shipping } from '@/types';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    FileText,
    Mail,
    MapPin,
    Package,
    Phone,
    Printer,
    Share2,
    Truck,
    User,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderDetailPageProps extends SharedData {
    order: Order;
    payment: Payment;
    shipping: Shipping;
}
export default function OrderDetail() {
    const { order: mockOrder, payment: mockPayment, shipping: mockShipping } = usePage<OrderDetailPageProps>().props;
    // const params = route().params as { id: string };
    const [order, setOrder] = useState<Order>(mockOrder);
    const [payment] = useState<Payment>(mockPayment);
    const [shipping] = useState<Shipping>(mockShipping);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleStatusUpdate = (newStatus: Order['status']) => {
        setOrder({ ...order, status: newStatus, updated_at: new Date().toISOString() });
    };

    const exportOrderPDF = () => {
        // Simulate PDF export
        const orderData = {
            orderId: order.id,
            customer: order.user.name,
            date: new Date(order.created_at).toLocaleDateString('id-ID'),
            items: order.products.map((p) => ({
                name: p.name,
                price: formatPrice(p.price),
                quantity: 1,
            })),
            total: formatPrice(parseInt(order.total_amount)),
            status: order.status,
        };

        console.log('Exporting order to PDF:', orderData);
        alert(`Ekspor PDF untuk Pesanan #${order.id} berhasil! File akan diunduh dalam beberapa detik.`);
    };

    const exportOrderExcel = () => {
        // Simulate Excel export
        const orderData = {
            orderId: order.id,
            customer: order.user.name,
            email: order.user.email,
            phone: shipping.phone,
            address: `${shipping.address}, ${shipping.city}, ${shipping.province}`,
            items: order.products.map((p) => ({
                name: p.name,
                price: p.price,
                quantity: 1,
                total: p.price,
            })),
            subtotal: order.products.reduce((sum, p) => sum + p.price, 0),
            discount: order.discount || null,
            shipping: shipping.shipping_cost,
            total: order.total_amount,
            status: order.status,
            paymentMethod: payment.payment_method,
            paymentStatus: payment.status,
            shippingStatus: shipping.status,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
        };

        console.log('Exporting order to Excel:', orderData);
        alert(`Ekspor Excel untuk Pesanan #${order.id} berhasil! File akan diunduh dalam beberapa detik.`);
    };

    const printOrder = () => {
        // Simulate print functionality
        window.print();
    };

    const shareOrder = () => {
        // Simulate share functionality
        const shareData = {
            title: `Pesanan #${order.id}`,
            text: `Detail pesanan dari ${order.user.name} dengan total ${formatPrice(parseInt(order.total_amount))}`,
            url: window.location.href,
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link pesanan telah disalin ke clipboard!');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getShippingStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const orderTimeline = [
        {
            id: 1,
            title: 'Pesanan Diterima',
            description: 'Pesanan Anda telah diterima dan sedang diproses.',
            status: 'completed',
            icon: Package,
            timestamp: order.created_at,
        },
        {
            id: 2,
            title: 'Pembayaran Diterima',
            description: 'Pembayaran untuk pesanan ini telah diterima.',
            status: payment.status === 'paid' ? 'completed' : 'pending',
            icon: CreditCard,
            timestamp: payment.paid_at || null,
        },
        {
            id: 3,
            title: 'Pengiriman Dijadwalkan',
            description: 'Pengiriman pesanan Anda telah dijadwalkan.',
            status: shipping.status === 'shipped' ? 'completed' : 'pending',
            icon: Truck,
            timestamp: shipping.shipped_at || null,
        },
        {
            id: 4,
            title: 'Pesanan Terkirim',
            description: 'Pesanan Anda telah berhasil dikirim.',
            status: shipping.status === 'delivered' ? 'completed' : 'pending',
            icon: CheckCircle,
            timestamp: shipping.delivered_at || null,
        },
    ];

    if (!mounted) return null;

    const subtotal = order.products.reduce((sum, product) => sum + product.price, 0);
    const discountAmount = order.discount
        ? order.discount.type === 'percentage'
            ? (subtotal * order.discount.value) / 100
            : order.discount.value
        : 0;
    const finalTotal = subtotal - discountAmount + parseInt(shipping.shipping_cost as unknown as string);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <AdminSidebar />

            <div className="flex flex-1 flex-col">
                <AdminHeader />

                <main className="flex-1 p-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href={route('admin.orders.index')} className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-white/50" asChild>
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                                        Pesanan #{order.id}
                                    </h1>
                                    <p className="mt-1 text-gray-600">
                                        Dibuat pada{' '}
                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={`${getStatusColor(order.status)} border px-3 py-1`}>
                                    {order.status === 'pending'
                                        ? 'Menunggu'
                                        : order.status === 'completed'
                                          ? 'Selesai'
                                          : order.status === 'cancelled'
                                            ? 'Dibatalkan'
                                            : order.status}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Ekspor
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={exportOrderPDF}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Ekspor ke PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={exportOrderExcel}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Ekspor ke Excel
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={printOrder}>
                                            <Printer className="mr-2 h-4 w-4" />
                                            Cetak Pesanan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={shareOrder}>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Bagikan Link
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Column */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Order Items */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5 text-purple-600" />
                                            Item Pesanan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {order.products.map((product, index) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="flex items-center gap-4 rounded-lg bg-gray-50 p-4"
                                                >
                                                    <img
                                                        src={'/storage/' + product.photo || '/placeholder.svg'}
                                                        alt={product.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <span className="text-sm text-gray-500">Ukuran: {product.pivot.size}</span>
                                                            <span className="text-sm text-gray-500">Jumlah: {product.pivot.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Timeline */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-purple-600" />
                                            Timeline Pesanan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {orderTimeline.map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        className="flex items-start gap-4"
                                                    >
                                                        <div
                                                            className={`rounded-full p-2 ${
                                                                item.status === 'completed'
                                                                    ? 'bg-green-100 text-green-600'
                                                                    : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                        >
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                            <p className="text-sm text-gray-600">{item.description}</p>
                                                            {item.timestamp && (
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    {new Date(item.timestamp).toLocaleString('id-ID')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Order Actions */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Aksi Pesanan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button
                                            onClick={() => handleStatusUpdate('completed')}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            disabled={order.status === 'completed' || order.status === 'cancelled'}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Tandai Selesai
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('cancelled')}
                                            variant="destructive"
                                            className="w-full"
                                            disabled={order.status === 'cancelled' || order.status === 'completed'}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Batalkan Pesanan
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Customer Information */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-purple-600" />
                                            Pelanggan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 flex items-center gap-3">
                                            <img
                                                src={'/storage/' + order.user.avatar || '/placeholder.svg?height=40&width=40'}
                                                alt={order.user.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{order.user.name}</p>
                                                <p className="text-sm text-gray-600">{order.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span>{order.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>Pelanggan sejak {new Date(order.user.created_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Information */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-purple-600" />
                                            Pembayaran
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Metode:</span>
                                                <span className="text-sm font-medium">{payment.payment_method}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Status:</span>
                                                <Badge className={`${getPaymentStatusColor(payment.status)} text-xs`}>
                                                    {payment.status === 'paid'
                                                        ? 'Berhasil'
                                                        : payment.status === 'pending'
                                                          ? 'Menunggu'
                                                          : payment.status === 'failed'
                                                            ? 'Gagal'
                                                            : payment.status}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">ID Transaksi:</span>
                                                <span className="font-mono text-sm">{payment.transaction_id}</span>
                                            </div>
                                            {payment.paid_at && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Dibayar Pada:</span>
                                                    <span className="text-sm">{new Date(payment.paid_at).toLocaleString('id-ID')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Information */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-purple-600" />
                                            Pengiriman
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Status:</span>
                                                <Badge className={`${getShippingStatusColor(shipping.status)} text-xs`}>
                                                    {shipping.status === 'pending'
                                                        ? 'Menunggu'
                                                        : shipping.status === 'shipped'
                                                          ? 'Dikirim'
                                                          : shipping.status === 'delivered'
                                                            ? 'Terkirim'
                                                            : shipping.status === 'cancelled'
                                                              ? 'Dibatalkan'
                                                              : shipping.status}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Kurir:</span>
                                                <span className="text-sm font-medium">{shipping.courier}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Layanan:</span>
                                                <span className="text-sm">{shipping.service}</span>
                                            </div>
                                            {shipping.tracking_number && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Resi:</span>
                                                    <span className="font-mono text-sm">{shipping.tracking_number}</span>
                                                </div>
                                            )}
                                            <Separator />
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                                    <div className="text-sm">
                                                        <p className="font-medium">{shipping.address}</p>
                                                        <p className="text-gray-600">
                                                            {shipping.city}, {shipping.province} {shipping.postal_code}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{shipping.phone}</span>
                                                </div>
                                            </div>
                                            {shipping.note && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <p className="mb-1 text-sm text-gray-600">Catatan Pengiriman:</p>
                                                        <p className="rounded bg-gray-50 p-2 text-sm">{shipping.note}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Summary */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-purple-600" />
                                            Ringkasan Pesanan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Subtotal:</span>
                                                <span className="text-sm">{formatPrice(subtotal)}</span>
                                            </div>
                                            {order.discount && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        Diskon (
                                                        {order.discount.type === 'percentage'
                                                            ? `${order.discount.value}%`
                                                            : formatPrice(order.discount.value)}
                                                        ):
                                                    </span>
                                                    <span className="text-sm text-green-600">-{formatPrice(discountAmount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Ongkir:</span>
                                                <span className="text-sm">{formatPrice(shipping.shipping_cost)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Total:</span>
                                                <span className="text-lg font-semibold">{formatPrice(finalTotal)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
