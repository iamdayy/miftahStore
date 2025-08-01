'use client';

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Heart, Minus, Plus, RotateCcw, Share2, Shield, ShoppingBag, Star, Truck } from 'lucide-react';
import { useState } from 'react';

import { ProductShowcase3D } from '@/components/3d-product-showcase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Category, Product, Review } from '@/types';

// Mock categories data
const categories: Category[] = [
    { id: 1, name: 'T-Shirts', description: 'Comfortable cotton t-shirts' },
    { id: 2, name: 'Jackets', description: 'Stylish jackets for all seasons' },
    { id: 3, name: 'Shoes', description: 'Trendy footwear collection' },
];

// Mock product data using the correct interface
const product: Product = {
    id: 1,
    name: 'Premium Cotton T-Shirt',
    description:
        'Experience unparalleled comfort with our Premium Cotton T-Shirt. Crafted from 100% organic cotton, this versatile piece combines style and sustainability. Perfect for any occasion, from casual outings to semi-formal events.',
    price: 299000,
    stock: 50,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    photo: '/placeholder.svg?height=600&width=600',
    category: categories[0],
};

const productImages = [
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
];

const relatedProducts: Product[] = [
    {
        id: 2,
        name: 'Casual Polo Shirt',
        description: 'Comfortable polo shirt for casual wear',
        price: 349000,
        stock: 30,
        sizes: ['S', 'M', 'L', 'XL'],
        photo: '/placeholder.svg?height=300&width=300',
        category: categories[0],
    },
    {
        id: 3,
        name: 'Striped Long Sleeve',
        description: 'Stylish striped long sleeve shirt',
        price: 399000,
        stock: 25,
        sizes: ['S', 'M', 'L', 'XL'],
        photo: '/placeholder.svg?height=300&width=300',
        category: categories[0],
    },
    {
        id: 4,
        name: 'Graphic Tee Collection',
        description: 'Trendy graphic t-shirt with unique design',
        price: 279000,
        stock: 40,
        sizes: ['S', 'M', 'L', 'XL'],
        photo: '/placeholder.svg?height=300&width=300',
        category: categories[0],
    },
];

const reviews: Review[] = [
    {
        id: 1,
        subject: 'Amazing Quality!',
        review: 'Amazing quality! The fabric is so soft and the fit is perfect. Definitely buying more colors.',
        rating: 5,
    },
    {
        id: 2,
        subject: 'Great T-shirt',
        review: "Great t-shirt, very comfortable. The only thing is it's a bit longer than expected, but overall satisfied.",
        rating: 4,
    },
    {
        id: 3,
        subject: 'Love the eco-friendly approach!',
        review: 'Love the eco-friendly approach! The shirt feels premium and looks great. Highly recommend.',
        rating: 5,
    },
];

const features = [
    '100% Organic Cotton',
    'Pre-shrunk fabric',
    'Reinforced collar and sleeves',
    'Eco-friendly dyes',
    'Machine washable',
    'Available in multiple colors and sizes',
];

const specifications = {
    Material: '100% Organic Cotton',
    Weight: '180 GSM',
    Fit: 'Regular Fit',
    Care: 'Machine wash cold, tumble dry low',
    Origin: 'Made in Indonesia',
    Sustainability: 'GOTS Certified',
};

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

export default function ProductDetailPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [cartItems, setCartItems] = useState<number[]>([]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const addToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        setCartItems((prev) => [...prev, product.id]);
        console.log('Added to cart:', {
            product: product.id,
            size: selectedSize,
            quantity,
        });
    };

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-white/80"
                style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                    borderBottom: '1px solid rgba(236, 72, 153, 0.2)',
                }}
            >
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-2"
                        >
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
                            FashionStore
                        </span>
                    </Link>

                    <nav className="hidden items-center space-x-6 md:flex">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Products', href: '/products' },
                            { name: 'About', href: '/about' },
                            { name: 'Contact', href: '/contact' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={item.href} className="group relative text-sm font-medium transition-colors hover:text-pink-600">
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="hover:bg-pink-50">
                                <Heart className="h-5 w-5 text-pink-500" />
                            </Button>
                        </motion.div>
                        <Link href="/cart">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" className="relative hover:bg-indigo-50">
                                    <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                    <AnimatePresence>
                                        {cartItems.length > 0 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -top-2 -right-2"
                                            >
                                                <Badge className="flex h-5 w-5 items-center justify-center rounded-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 p-0 text-xs">
                                                    {cartItems.length}
                                                </Badge>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </Link>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-2">
                            <Link href="/login">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="outline" className="border-pink-200 bg-transparent text-pink-600 hover:bg-pink-50">
                                        Login
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/register">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                        Register
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="container py-8">
                {/* Breadcrumb */}
                <motion.nav className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 transition-colors hover:text-pink-600">
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/products" className="text-gray-500 transition-colors hover:text-pink-600">
                            Products
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href={`/products?category=${product.category.name}`} className="text-gray-500 transition-colors hover:text-pink-600">
                            {product.category.name}
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="font-medium text-pink-600">{product.name}</span>
                    </div>
                </motion.nav>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Product Images */}
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <div className="space-y-4">
                            {/* View Mode Toggle */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Product View</h3>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === '2d' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('2d')}
                                        className={
                                            viewMode === '2d'
                                                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                                                : 'border-pink-200 text-pink-600 hover:bg-pink-50'
                                        }
                                    >
                                        2D View
                                    </Button>
                                    <Button
                                        variant={viewMode === '3d' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('3d')}
                                        className={
                                            viewMode === '3d'
                                                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                                                : 'border-pink-200 text-pink-600 hover:bg-pink-50'
                                        }
                                    >
                                        3D View
                                    </Button>
                                </div>
                            </div>

                            <Card className="overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur">
                                <CardContent className="p-0">
                                    <AnimatePresence mode="wait">
                                        {viewMode === '2d' ? (
                                            <motion.div
                                                key="2d-view"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <div className="relative aspect-square">
                                                    <img
                                                        src={productImages[selectedImage] || '/placeholder.svg'}
                                                        alt={product.name}
                                                        className="object-cover"
                                                    />

                                                    {/* Stock badge */}
                                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                        {product.stock < 10 && (
                                                            <motion.div
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                className="animate-pulse"
                                                            >
                                                                <Badge className="border-0 bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg">
                                                                    Low Stock
                                                                </Badge>
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setIsWishlisted(!isWishlisted)}
                                                            className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition-colors hover:bg-white"
                                                        >
                                                            <Heart
                                                                className={`h-5 w-5 ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`}
                                                            />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition-colors hover:bg-white"
                                                        >
                                                            <Share2 className="h-5 w-5 text-gray-600" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="3d-view"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="h-96"
                                            >
                                                <ProductShowcase3D />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>

                            {/* Thumbnail Images - only show in 2D mode */}
                            {viewMode === '2d' && (
                                <motion.div
                                    className="flex gap-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {productImages.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                                                index === selectedImage ? 'border-pink-500' : 'border-gray-200 hover:border-pink-300'
                                            }`}
                                        >
                                            <img
                                                src={image || '/placeholder.svg'}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Product Details */}
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
                        {/* Product Info */}
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Badge variant="outline" className="border-pink-200 text-pink-600">
                                    {product.category.name}
                                </Badge>
                            </div>

                            <h1 className="mb-4 text-3xl font-bold text-gray-900">{product.name}</h1>

                            {/* Rating */}
                            <div className="mb-4 flex items-center gap-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6 flex items-center gap-4">
                                <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
                                    {formatPrice(product.price)}
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-green-600">In Stock</span>
                                        <span className="text-sm text-gray-500">({product.stock} items left)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <span className="font-medium text-red-600">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="mb-6 leading-relaxed text-gray-600">{product.description}</p>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <label className="mb-3 block text-sm font-medium text-gray-700">
                                Size: {selectedSize && <span className="text-pink-600">{selectedSize}</span>}
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                                {product.sizes.map((size) => (
                                    <motion.button
                                        key={size}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedSize(size)}
                                        className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                                            size === selectedSize
                                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                                        }`}
                                    >
                                        {size}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="mb-3 block text-sm font-medium text-gray-700">Quantity</label>
                            <div className="flex w-fit items-center rounded-lg border border-gray-300">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 transition-colors hover:bg-gray-50"
                                >
                                    <Minus className="h-4 w-4" />
                                </motion.button>
                                <span className="min-w-[3rem] px-4 py-2 text-center font-medium">{quantity}</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-2 transition-colors hover:bg-gray-50"
                                >
                                    <Plus className="h-4 w-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={addToCart}
                                    disabled={product.stock === 0 || !selectedSize}
                                    className="group w-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                                    Add to Cart
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`border-pink-200 hover:bg-pink-50 ${isWishlisted ? 'bg-pink-50 text-pink-600' : 'text-pink-600'}`}
                                >
                                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-pink-500' : ''}`} />
                                </Button>
                            </motion.div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 border-t pt-6">
                            <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-center">
                                <Truck className="mb-2 h-8 w-8 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Free Shipping</span>
                                <span className="text-xs text-emerald-600">Over IDR 500k</span>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
                                <Shield className="mb-2 h-8 w-8 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Secure Payment</span>
                                <span className="text-xs text-blue-600">SSL Protected</span>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
                                <RotateCcw className="mb-2 h-8 w-8 text-amber-600" />
                                <span className="text-sm font-medium text-amber-700">Easy Returns</span>
                                <span className="text-xs text-amber-600">30 day policy</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Product Details Tabs */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                            <TabsTrigger
                                value="description"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
                            >
                                Description & Features
                            </TabsTrigger>
                            <TabsTrigger
                                value="specifications"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
                            >
                                Specifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
                            >
                                Reviews ({reviews.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-8">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardContent className="p-8">
                                    <div className="grid gap-8 md:grid-cols-2">
                                        <div>
                                            <h3 className="mb-4 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-xl font-semibold text-transparent">
                                                Product Description
                                            </h3>
                                            <p className="mb-6 leading-relaxed text-gray-600">{product.description}</p>
                                            <p className="leading-relaxed text-gray-600">
                                                This premium t-shirt represents the perfect balance of style, comfort, and sustainability. Made from
                                                carefully selected organic cotton, it offers superior softness and durability while maintaining our
                                                commitment to environmental responsibility.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-semibold text-transparent">
                                                Key Features
                                            </h3>
                                            <ul className="space-y-3">
                                                {features.map((feature, index) => (
                                                    <motion.li
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                                                        <span className="text-gray-700">{feature}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="specifications" className="mt-8">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardContent className="p-8">
                                    <h3 className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
                                        Technical Specifications
                                    </h3>
                                    <div className="grid gap-4">
                                        {Object.entries(specifications).map(([key, value], index) => (
                                            <motion.div
                                                key={key}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0"
                                            >
                                                <span className="font-medium text-gray-700">{key}</span>
                                                <span className="text-gray-600">{value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-8">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardContent className="p-8">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-xl font-semibold text-transparent">
                                            Customer Reviews
                                        </h3>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-5 w-5 ${
                                                                i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                                            </div>
                                            <span className="text-sm text-gray-600">Based on {reviews.length} reviews</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {reviews.map((review, index) => (
                                            <motion.div
                                                key={review.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="border-b border-gray-100 pb-6 last:border-b-0"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-violet-400">
                                                        <span className="text-sm font-semibold text-white">U</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">{review.subject}</span>
                                                            <Badge className="border-emerald-200 bg-emerald-100 text-xs text-emerald-700">
                                                                Verified Purchase
                                                            </Badge>
                                                        </div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${
                                                                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="leading-relaxed text-gray-600">{review.review}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>

                {/* Related Products */}
                <motion.section
                    className="mt-16"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <h2 className="mb-8 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-2xl font-bold text-transparent">
                        You Might Also Like
                    </h2>

                    <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-3" variants={containerVariants} initial="hidden" animate="visible">
                        {relatedProducts.map((relatedProduct, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Card className="group overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl">
                                    <CardContent className="p-0">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={relatedProduct.photo || '/placeholder.svg'}
                                                alt={relatedProduct.name}
                                                width={300}
                                                height={300}
                                                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>

                                        <div className="p-4">
                                            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-pink-600">
                                                {relatedProduct.name}
                                            </h3>

                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600">{relatedProduct.description}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent">
                                                        {formatPrice(relatedProduct.price)}
                                                    </span>
                                                </div>

                                                <Link href={`/product/${relatedProduct.id}`}>
                                                    <Button
                                                        size="sm"
                                                        className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
}
