'use client';

import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowRight, Filter, Grid, Heart, List, ShoppingBag, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import type { Category, Product, SharedData } from '@/types';

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

const cardVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
    hover: {
        scale: 1.02,
        y: -5,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
        },
    },
};
interface WishlistPageProps extends SharedData {
    wishlistItems: Product[];
    categories: Category[];
}
export default function WishlistPage() {
    const { wishlistItems, categories } = usePage<WishlistPageProps>().props;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('recent');
    const [filterCategory, setFilterCategory] = useState('All');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const removeFromWishlist = (productId: number) => {
        router.post(route('wishlist.toggle'), { product_id: productId });
    };
    const addToCart = (productId: number) => {
        router.post('cart.add', { product_id: productId });
    };

    const filteredItems = wishlistItems.filter((item) => {
        if (filterCategory === 'All') return true;
        return item.category.name === filterCategory;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'category':
                return a.category.name.localeCompare(b.category.name);
            default:
                return 0;
        }
    });

    return (
        <AppLayout>
            {/* Page Title */}
            <motion.section
                className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-16 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background Pattern */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            background: 'rgba(255, 255, 255, 0.1)',
                        }}
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                            y: Math.random() * 200,
                        }}
                        animate={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                            y: Math.random() * 200,
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        }}
                    />
                ))}

                <div className="relative z-10 container">
                    <motion.div className="text-center" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <Heart className="h-12 w-12 fill-pink-200 text-pink-200" />
                            <h1 className="text-4xl font-bold md:text-6xl">Wishlist Saya</h1>
                        </div>
                        <p className="mb-6 text-xl">Koleksi produk favorit yang ingin Anda miliki</p>
                        <div className="flex items-center justify-center gap-6">
                            <Badge className="border-white/30 bg-white/20 px-4 py-2 text-base text-white">
                                {wishlistItems.length} produk tersimpan
                            </Badge>
                            <Badge className="border-white/30 bg-white/20 px-4 py-2 text-base text-white">
                                Total nilai: {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
                            </Badge>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <div className="container py-8">
                {wishlistItems.length === 0 ? (
                    // Empty Wishlist State
                    <motion.div
                        className="py-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                            <Heart className="h-16 w-16 text-pink-400" />
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-gray-700">Wishlist Anda Kosong</h3>
                        <p className="mx-auto mb-8 max-w-md text-gray-500">
                            Belum ada produk yang ditambahkan ke wishlist. Mulai jelajahi koleksi kami dan simpan produk favorit Anda!
                        </p>
                        <Link href="/products">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Mulai Belanja
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Controls */}
                        <motion.div
                            className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4">
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="w-[150px] border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                                        <Filter className="mr-2 h-4 w-4 text-indigo-500" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">Semua Kategori</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[150px] border-violet-200 focus:border-violet-400 focus:ring-violet-400">
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Terbaru</SelectItem>
                                        <SelectItem value="name">Nama A-Z</SelectItem>
                                        <SelectItem value="price-low">Harga Terendah</SelectItem>
                                        <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                                        <SelectItem value="category">Kategori</SelectItem>
                                    </SelectContent>
                                </Select>

                                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
                                    <ToggleGroupItem value="grid" aria-label="Grid view">
                                        <Grid className="h-4 w-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="list" aria-label="List view">
                                        <List className="h-4 w-4" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </motion.div>

                        {/* Wishlist Items */}
                        <motion.div
                            className={`grid gap-6 ${
                                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
                            }`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {sortedItems.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        whileHover="hover"
                                        layout
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card
                                            className={`group overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl ${
                                                viewMode === 'list' ? 'flex flex-row' : ''
                                            }`}
                                        >
                                            <CardContent className="p-0">
                                                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                                                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                                                        <img
                                                            src={'/storage/' + product.photo || '/placeholder.svg'}
                                                            alt={product.name}
                                                            width={300}
                                                            height={400}
                                                            className={`object-cover ${viewMode === 'list' ? 'h-48 w-48' : 'h-64 w-full'}`}
                                                        />
                                                    </motion.div>

                                                    {/* Gradient overlay on hover */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        whileHover={{ opacity: 1 }}
                                                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                                                    />

                                                    {/* Stock badge */}
                                                    <AnimatePresence>
                                                        {product.stock < 10 && (
                                                            <motion.div
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                exit={{ scale: 0, rotate: 180 }}
                                                                className="absolute top-3 right-3"
                                                            >
                                                                <Badge className="animate-pulse border-0 bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg">
                                                                    Stok Terbatas
                                                                </Badge>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Remove from wishlist button */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        whileHover={{ opacity: 1, scale: 1 }}
                                                        className="absolute top-3 right-3 mt-8"
                                                    >
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            onClick={() => removeFromWishlist(product.id)}
                                                            className="border-red-200 bg-white/90 backdrop-blur-sm hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </motion.div>

                                                    {/* Quick add to cart button */}
                                                    {viewMode === 'grid' && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            whileHover={{ opacity: 1 }}
                                                            className="absolute inset-0 flex items-center justify-center"
                                                        >
                                                            <motion.div
                                                                initial={{ y: 20, opacity: 0 }}
                                                                whileHover={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.1 }}
                                                            >
                                                                <Button
                                                                    className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                                                                    onClick={() => addToCart(product.id)}
                                                                    disabled={product.stock === 0}
                                                                >
                                                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                                                    {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                                                </Button>
                                                            </motion.div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <motion.div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`} variants={itemVariants}>
                                                    <div className={viewMode === 'list' ? 'flex h-full items-start justify-between' : ''}>
                                                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <h3 className="text-lg font-semibold transition-colors group-hover:text-pink-600">
                                                                    {product.name}
                                                                </h3>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {product.category.name}
                                                                </Badge>
                                                            </div>

                                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>

                                                            {/* Sizes */}
                                                            <div className="mb-3 flex items-center gap-1">
                                                                <span className="text-xs text-gray-500">Ukuran:</span>
                                                                {product.sizes.slice(0, 4).map((size, i) => (
                                                                    <Badge key={i} variant="outline" className="px-1 py-0 text-xs">
                                                                        {size}
                                                                    </Badge>
                                                                ))}
                                                                {product.sizes.length > 4 && (
                                                                    <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
                                                                )}
                                                            </div>

                                                            {/* Rating placeholder */}
                                                            <div className="mb-3 flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                    />
                                                                ))}
                                                                <span className="ml-1 text-xs text-gray-500">(4.0)</span>
                                                            </div>

                                                            <div className="mb-4 flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <motion.span
                                                                        className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent"
                                                                        whileHover={{ scale: 1.05 }}
                                                                    >
                                                                        {formatPrice(product.price)}
                                                                    </motion.span>
                                                                </div>
                                                                <div className="text-sm text-gray-500">Stok: {product.stock}</div>
                                                            </div>
                                                        </div>

                                                        <div className={`flex gap-2 ${viewMode === 'list' ? 'ml-4 flex-col' : ''}`}>
                                                            <Link href={`/product/${product.id}`} className={viewMode === 'list' ? '' : 'flex-1'}>
                                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={`border-pink-200 bg-transparent text-pink-600 transition-all duration-300 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 hover:text-pink-700 ${
                                                                            viewMode === 'list' ? 'w-32' : 'w-full'
                                                                        }`}
                                                                    >
                                                                        Lihat Detail
                                                                    </Button>
                                                                </motion.div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Wishlist Summary */}
                        <motion.div
                            className="mt-12 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-violet-50 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Ringkasan Wishlist</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <span>Total Produk: {wishlistItems.length}</span>
                                        <span>Total Nilai: {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0))}</span>
                                        <span>
                                            Rata-rata Harga:{' '}
                                            {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0) / wishlistItems.length || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
