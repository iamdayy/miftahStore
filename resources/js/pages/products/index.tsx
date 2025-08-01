'use client';

import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Grid, List, Search } from 'lucide-react';
import { useState } from 'react';

import { ProductCard } from '@/components/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import type { Category, PaginatedResponse, Product, SharedData } from '@/types';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

interface ProductsPageProps extends SharedData {
    products: PaginatedResponse<Product>;
    categories: Category[];
}
export default function ProductsPage() {
    const { products, categories } = usePage<ProductsPageProps>().props;
    const categoryNames = ['All', ...categories.map((category) => category.name)];
    const allProducts = products.data;
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredProducts = allProducts.filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category.name === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesCategory && matchesSearch && matchesPrice;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'stock':
                return b.stock - a.stock;
            default:
                return 0;
        }
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

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
                {[...Array(10)].map((_, i) => (
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
                        <h1 className="mb-4 text-4xl font-bold md:text-6xl">Our Products</h1>
                        <p className="mb-6 text-xl">Discover our complete collection of fashion items</p>
                        <Badge className="border-white/30 bg-white/20 text-white">{sortedProducts.length} products found</Badge>
                    </motion.div>
                </div>
            </motion.section>

            <div className="container py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar Filters */}
                    <motion.aside className="lg:w-1/4" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                        <Card className="sticky top-24 border-0 bg-white/80 shadow-lg backdrop-blur">
                            <CardContent className="p-6">
                                <h3 className="mb-4 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-semibold text-transparent">
                                    Filters
                                </h3>

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Search Products</label>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-pink-400" />
                                        <Input
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="border-pink-200 pl-10 focus:border-pink-400 focus:ring-pink-400"
                                        />
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryNames.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                                    </label>
                                    <Slider value={priceRange} onValueChange={setPriceRange} max={2000000} min={0} step={50000} className="mt-2" />
                                </div>

                                {/* Clear Filters */}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                        setPriceRange([0, 2000000]);
                                    }}
                                    className="w-full border-gray-300 hover:bg-gray-50"
                                >
                                    Clear All Filters
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Sort and View Controls */}
                        <motion.div
                            className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[200px] border-violet-200 focus:border-violet-400 focus:ring-violet-400">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="featured">Featured</SelectItem>
                                        <SelectItem value="name">Name A-Z</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="stock">Stock Level</SelectItem>
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

                            <p className="text-sm text-gray-600">
                                Showing {sortedProducts.length} of {allProducts.length} products
                            </p>
                        </motion.div>

                        {/* Products Grid */}
                        <motion.div
                            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
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

                        {/* No products found */}
                        {sortedProducts.length === 0 && (
                            <motion.div className="py-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                                    <Search className="h-12 w-12 text-pink-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-700">No products found</h3>
                                <p className="mb-4 text-gray-500">Try adjusting your filters or search terms</p>
                                <Button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                        setPriceRange([0, 2000000]);
                                    }}
                                    className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600"
                                >
                                    Clear All Filters
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
