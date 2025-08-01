'use client';

import { HeroSection } from '@/components/hero-section';
import { ProductCard } from '@/components/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Banner, Discount, Product, SharedData } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Clock, Filter, Percent, Search, Tag } from 'lucide-react';
import { useState } from 'react';

const categories = ['All', 'T-Shirts', 'Jackets', 'Shoes', 'Dresses', 'Bags', 'Jeans'];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};
interface HomePageProps extends SharedData {
    products: Product[];
    discounts: Discount[];
    banners: Banner[];
}
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
        scale: 1.05,
        y: -10,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
        },
    },
};
export default function Home() {
    const { products, discounts, banners } = usePage<HomePageProps>().props;
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category.name === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const formatDiscountValue = (discount: Discount) => {
        if (discount.type === 'percentage') {
            return `${discount.value}%`;
        } else {
            return formatPrice(discount.value);
        }
    };
    const getTimeRemaining = (endDate: string) => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const difference = end - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) return `${days} hari lagi`;
            if (hours > 0) return `${hours} jam lagi`;
            return `${minutes} menit lagi`;
        }
        return 'Berakhir';
    };

    return (
        <AppLayout>
            <HeroSection banners={banners} />

            {/* Discounts Section */}
            <motion.section
                className="container py-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="mb-8 text-center">
                    <motion.h2
                        className="mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-3xl font-bold text-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        🔥 Penawaran Spesial Hari Ini
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Jangan lewatkan kesempatan emas untuk berhemat dengan promo menarik kami!
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {discounts
                        .filter((discount) => discount.status === 'active')
                        .map((discount, index) => (
                            <motion.div
                                key={discount.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="group relative overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                                    {/* Discount Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge className="animate-pulse border-0 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                                            <Percent className="mr-1 h-3 w-3" />
                                            {formatDiscountValue(discount)}
                                        </Badge>
                                    </div>

                                    <CardContent className="p-0">
                                        <div className="relative overflow-hidden">
                                            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                                                <img
                                                    src={'/storage/' + discount.image || '/placeholder.svg'}
                                                    alt={discount.title}
                                                    width={400}
                                                    height={300}
                                                    className="h-48 w-full object-cover"
                                                />
                                            </motion.div>

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                            {/* Time remaining */}
                                            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
                                                <Clock className="h-3 w-3" />
                                                {getTimeRemaining(discount.end_date)}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <h3 className="text-lg font-bold transition-colors group-hover:text-orange-600">{discount.title}</h3>
                                                <Tag className="h-4 w-4 text-orange-500" />
                                            </div>

                                            <p className="mb-4 line-clamp-2 text-sm text-gray-600">{discount.description}</p>

                                            {/* Discount Code */}
                                            <div className="mb-4 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="mb-1 text-xs text-gray-500">Kode Promo:</p>
                                                        <p className="text-lg font-bold text-orange-600">{discount.code}</p>
                                                    </div>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-orange-300 bg-transparent text-orange-600 hover:bg-orange-50"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(discount.code);
                                                                // You could add a toast notification here
                                                            }}
                                                        >
                                                            Salin
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Discount Type Info */}
                                            <div className="mt-3 text-center">
                                                <Badge className="text-xs">
                                                    {discount.type === 'percentage' ? 'Diskon Persentase' : 'Potongan Harga'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                </motion.div>
            </motion.section>

            {/* Search and Filters with Iconic Colors */}
            <motion.section className="container py-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="mb-8 text-center">
                    <motion.h2
                        className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        🛍️ Produk Terbaru
                    </motion.h2>
                </div>
                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    <motion.div className="flex-1" whileFocus={{ scale: 1.02 }}>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-pink-500" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-pink-200 pl-10 transition-all duration-300 focus:border-pink-400 focus:shadow-lg focus:ring-pink-400"
                            />
                        </div>
                    </motion.div>

                    <div className="flex gap-4">
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px] border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                                    <Filter className="mr-2 h-4 w-4 text-indigo-500" />
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px] border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </div>
                </div>

                {/* Products Grid with Iconic Color Accents */}
                <motion.section
                    className="container py-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <motion.div
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {sortedProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </motion.section>
            </motion.section>
        </AppLayout>
    );
}
