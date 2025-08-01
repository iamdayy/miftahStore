'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Calendar, DollarSign, Edit, Eye, EyeOff, Percent, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { DiscountForm } from '@/components/discount-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Discount, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';

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

interface DiscountsPageProps extends SharedData {
    discounts: Discount[];
}
export default function AdminDiscountsPage() {
    const { discounts } = usePage<DiscountsPageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

    const filteredDiscounts = discounts.filter(
        (discount) =>
            discount.title.toLowerCase().includes(searchTerm.toLowerCase()) || discount.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleAddDiscount = () => {
        setEditingDiscount(null);
        setShowForm(true);
    };

    const handleEditDiscount = (discount: Discount) => {
        setEditingDiscount(discount);
        setShowForm(true);
    };

    const handleDeleteDiscount = (id: number) => {
        if (confirm('Are you sure you want to delete this discount?')) {
            router.delete(route('admin.discounts.destroy', id));
        }
    };

    const handleToggleStatus = (id: number) => {
        router.put(route('admin.discounts.update', id), {
            status: discounts.find((discount) => discount.id === id)?.status === 'active' ? 'inactive' : 'active',
        });
    };

    const handleSaveDiscount = () => {
        setShowForm(false);
        setEditingDiscount(null);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                        {/* Header */}
                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                            <div>
                                <h1 className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
                                    Discount Management
                                </h1>
                                <p className="mt-1 text-gray-600">Create and manage discount codes for your store</p>
                            </div>
                            <Button
                                onClick={handleAddDiscount}
                                className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Discount
                            </Button>
                        </motion.div>

                        {/* Search */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Search discounts by title or code..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-200 pl-10 focus:border-pink-400 focus:ring-pink-400"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Discounts Grid */}
                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {filteredDiscounts.map((discount) => (
                                    <motion.div
                                        key={discount.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                    >
                                        <Card className="group overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-xl">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={'/storage/' + discount.image || '/placeholder.svg'}
                                                    alt={discount.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <Badge
                                                        variant={discount.status === 'active' ? 'default' : 'secondary'}
                                                        className={
                                                            discount.status === 'active'
                                                                ? 'bg-green-500 hover:bg-green-600'
                                                                : 'bg-gray-500 hover:bg-gray-600'
                                                        }
                                                    >
                                                        {discount.status}
                                                    </Badge>
                                                </div>
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                                                        {discount.type === 'percentage' ? (
                                                            <div className="flex items-center gap-1">
                                                                <Percent className="h-3 w-3" />
                                                                {discount.value}%
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="h-3 w-3" />
                                                                {formatPrice(discount.value)}
                                                            </div>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardHeader>
                                                <CardTitle className="text-lg">{discount.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">{discount.description}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Code:</span>
                                                    <Badge variant="outline" className="font-mono">
                                                        {discount.code}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {formatDate(discount.start_date)} - {formatDate(discount.end_date)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditDiscount(discount)}
                                                        className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(discount.id)}
                                                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                                    >
                                                        {discount.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteDiscount(discount.id)}
                                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredDiscounts.length === 0 && (
                            <motion.div variants={itemVariants} className="py-12 text-center">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                                    <Percent className="h-12 w-12 text-pink-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-700">No discounts found</h3>
                                <p className="mb-6 text-gray-500">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first discount to get started'}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={handleAddDiscount}
                                        className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Discount
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </main>
            </div>

            {/* Discount Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <DiscountForm
                        discount={editingDiscount}
                        onFinish={handleSaveDiscount}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingDiscount(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
