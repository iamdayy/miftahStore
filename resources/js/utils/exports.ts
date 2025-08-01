import { Order } from '@/types';
import * as XLSX from 'xlsx';

export interface OrderExportData {
    id: number;
    customer: string;
    email: string;
    phone?: string;
    address?: string;
    items: Array<{
        name: string;
        price: number;
        pivot: {
            quantity: number;
            size: string;
        };
    }>;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    status: string;
    paymentMethod?: string;
    paymentStatus?: string;
    shippingStatus?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DailyReportData {
    date: string;
    totalOrders: number;
    totalRevenue: number;
    orders: Array<{
        id: number;
        customer: string;
        total: number;
        status: string;
        time: string;
    }>;
}

export interface WeeklyReportData {
    weekStart: string;
    weekEnd: string;
    totalOrders: number;
    totalRevenue: number;
    orders: Array<{
        id: number;
        customer: string;
        total: number;
        status: string;
        date: string;
    }>;
}

export interface MonthlyReportData {
    month: number;
    year: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    orders: Array<{
        id: number;
        customer: string;
        total: number;
        status: string;
        date: string;
    }>;
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export const exportOrderToExcel = (orderData: OrderExportData) => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Order Summary Sheet
    const orderSummary = [
        ['ID Pesanan', orderData.id],
        ['Pelanggan', orderData.customer],
        ['Email', orderData.email],
        ['Telepon', orderData.phone || '-'],
        ['Alamat', orderData.address || '-'],
        [''],
        ['Subtotal', formatPrice(orderData.subtotal)],
        ['Diskon (%)', orderData.discount],
        ['Ongkir', formatPrice(orderData.shipping)],
        ['Total', formatPrice(orderData.total)],
        [''],
        ['Status Pesanan', orderData.status],
        ['Metode Pembayaran', orderData.paymentMethod || '-'],
        ['Status Pembayaran', orderData.paymentStatus || '-'],
        ['Status Pengiriman', orderData.shippingStatus || '-'],
        [''],
        ['Dibuat', new Date(orderData.createdAt).toLocaleString('id-ID')],
        ['Diperbarui', new Date(orderData.updatedAt).toLocaleString('id-ID')],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(orderSummary);
    XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan Pesanan');

    // Order Items Sheet
    const itemsHeader = ['Nama Produk', 'Harga Satuan', 'Jumlah', 'Total'];
    const itemsData = orderData.items.map((item) => [
        item.name,
        formatPrice(item.price),
        item.pivot.quantity,
        formatPrice(item.pivot.quantity * item.price),
    ]);

    const ws2 = XLSX.utils.aoa_to_sheet([itemsHeader, ...itemsData]);
    XLSX.utils.book_append_sheet(wb, ws2, 'Item Pesanan');

    // Generate and download file
    const fileName = `Pesanan_${orderData.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

export const exportDailyReport = (reportData: DailyReportData) => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summary = [
        ['LAPORAN HARIAN'],
        ['Tanggal', new Date(reportData.date).toLocaleDateString('id-ID')],
        ['Total Pesanan', reportData.totalOrders],
        ['Total Pendapatan', formatPrice(reportData.totalRevenue)],
        ['Rata-rata per Pesanan', reportData.totalOrders > 0 ? formatPrice(reportData.totalRevenue / reportData.totalOrders) : formatPrice(0)],
        [''],
        ['DETAIL PESANAN'],
        ['ID', 'Pelanggan', 'Total', 'Status', 'Waktu'],
        ...reportData.orders.map((order) => [
            order.id,
            order.customer,
            formatPrice(order.total),
            order.status,
            new Date(order.time).toLocaleString('id-ID'),
        ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(summary);

    // Style the header
    ws['A1'] = { v: 'LAPORAN HARIAN', t: 's', s: { font: { bold: true, sz: 16 } } };

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Harian');

    const fileName = `Laporan_Harian_${reportData.date}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

export const exportWeeklyReport = (reportData: WeeklyReportData) => {
    const wb = XLSX.utils.book_new();

    const summary = [
        ['LAPORAN MINGGUAN'],
        ['Periode', `${new Date(reportData.weekStart).toLocaleDateString('id-ID')} - ${new Date(reportData.weekEnd).toLocaleDateString('id-ID')}`],
        ['Total Pesanan', reportData.totalOrders],
        ['Total Pendapatan', formatPrice(reportData.totalRevenue)],
        ['Rata-rata per Pesanan', reportData.totalOrders > 0 ? formatPrice(reportData.totalRevenue / reportData.totalOrders) : formatPrice(0)],
        [''],
        ['DETAIL PESANAN'],
        ['ID', 'Pelanggan', 'Total', 'Status', 'Tanggal'],
        ...reportData.orders.map((order) => [
            order.id,
            order.customer,
            formatPrice(order.total),
            order.status,
            new Date(order.date).toLocaleDateString('id-ID'),
        ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(summary);
    ws['A1'] = { v: 'LAPORAN MINGGUAN', t: 's', s: { font: { bold: true, sz: 16 } } };

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Mingguan');

    const fileName = `Laporan_Mingguan_${reportData.weekStart}_${reportData.weekEnd}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

export const exportMonthlyReport = (reportData: MonthlyReportData) => {
    const wb = XLSX.utils.book_new();

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const summary = [
        ['LAPORAN BULANAN'],
        ['Bulan', `${monthNames[reportData.month - 1]} ${reportData.year}`],
        ['Total Pesanan', reportData.totalOrders],
        ['Total Pendapatan', formatPrice(reportData.totalRevenue)],
        ['Rata-rata per Pesanan', formatPrice(reportData.averageOrderValue)],
        [''],
        ['DETAIL PESANAN'],
        ['ID', 'Pelanggan', 'Total', 'Status', 'Tanggal'],
        ...reportData.orders.map((order) => [
            order.id,
            order.customer,
            formatPrice(order.total),
            order.status,
            new Date(order.date).toLocaleDateString('id-ID'),
        ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(summary);
    ws['A1'] = { v: 'LAPORAN BULANAN', t: 's', s: { font: { bold: true, sz: 16 } } };

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Bulanan');

    const fileName = `Laporan_Bulanan_${monthNames[reportData.month - 1]}_${reportData.year}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

export const exportAllOrders = (orders: Order[]) => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const totalRevenue = orders.reduce((sum, order) => sum + parseInt(order.total_amount), 0);
    const statusBreakdown = {
        pending: orders.filter((o) => o.status === 'pending').length,
        completed: orders.filter((o) => o.status === 'completed').length,
        cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };

    const summary = [
        ['LAPORAN SEMUA PESANAN'],
        ['Total Pesanan', orders.length],
        ['Total Pendapatan', formatPrice(totalRevenue)],
        ['Rata-rata per Pesanan', orders.length > 0 ? formatPrice(totalRevenue / orders.length) : formatPrice(0)],
        [''],
        ['BREAKDOWN STATUS'],
        ['Menunggu', statusBreakdown.pending],
        ['Selesai', statusBreakdown.completed],
        ['Dibatalkan', statusBreakdown.cancelled],
        [''],
        ['DETAIL SEMUA PESANAN'],
        ['ID', 'Pelanggan', 'Email', 'Total', 'Diskon (%)', 'Status', 'Jumlah Item', 'Dibuat', 'Diperbarui'],
        ...orders.map((order) => [
            order.id,
            order.user.name,
            order.user.email,
            formatPrice(parseInt(order.total_amount)),
            order.discount || 0,
            order.status,
            order.products.length,
            new Date(order.created_at).toLocaleString('id-ID'),
            new Date(order.updated_at).toLocaleString('id-ID'),
        ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(summary);
    ws['A1'] = { v: 'LAPORAN SEMUA PESANAN', t: 's', s: { font: { bold: true, sz: 16 } } };

    XLSX.utils.book_append_sheet(wb, ws, 'Semua Pesanan');

    const fileName = `Laporan_Semua_Pesanan_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
};
