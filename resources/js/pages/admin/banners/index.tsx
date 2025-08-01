'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Edit, ExternalLink, ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { BannerForm } from '@/components/banner-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Banner, Product, SharedData } from '@/types';
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

interface BannersPageProps extends SharedData {
    banners: Banner[];
    products: Product[];
}

export default function AdminBannersPage() {
    const { banners, products } = usePage<BannersPageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const filteredBanners = banners.filter((banner) => banner.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddBanner = () => {
        setEditingBanner(null);
        setShowForm(true);
    };

    const handleEditBanner = (banner: Banner) => {
        setEditingBanner(banner);
        setShowForm(true);
    };

    const handleDeleteBanner = (id: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            router.delete(route('admin.banners.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleSaveBanner = () => {
        setShowForm(false);
        setEditingBanner(null);
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
                                    Banner Management
                                </h1>
                                <p className="mt-1 text-gray-600">Create and manage promotional banners for your store</p>
                            </div>
                            <Button
                                onClick={handleAddBanner}
                                className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Banner
                            </Button>
                        </motion.div>

                        {/* Search */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Search banners by title..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-200 pl-10 focus:border-pink-400 focus:ring-pink-400"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Banners Grid */}
                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <AnimatePresence>
                                {filteredBanners.map((banner) => (
                                    <motion.div
                                        key={banner.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                    >
                                        <Card className="group overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-xl">
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={'/storage/' + banner.image || '/placeholder.svg'}
                                                    alt={banner.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute right-4 bottom-4 left-4">
                                                    <h3 className="mb-2 text-xl font-bold text-white">{banner.title}</h3>
                                                    <p className="line-clamp-2 text-sm text-white/90">{banner.description}</p>
                                                </div>
                                            </div>

                                            <CardContent className="space-y-4 p-6">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Featured Product:</span>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <ExternalLink className="h-3 w-3" />
                                                        {banner.product.name}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Price:</span>
                                                    <span className="font-semibold text-gray-900">{formatPrice(banner.product.price)}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Category:</span>
                                                    <Badge variant="secondary">{banner.product.category.name}</Badge>
                                                </div>

                                                <div className="flex items-center gap-2 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditBanner(banner)}
                                                        className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteBanner(banner.id)}
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

                        {filteredBanners.length === 0 && (
                            <motion.div variants={itemVariants} className="py-12 text-center">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                                    <ImageIcon className="h-12 w-12 text-pink-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-700">No banners found</h3>
                                <p className="mb-6 text-gray-500">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first banner to get started'}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={handleAddBanner}
                                        className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Banner
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </main>
            </div>

            {/* Banner Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <BannerForm
                        banner={editingBanner}
                        products={products}
                        onFinish={handleSaveBanner}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingBanner(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
