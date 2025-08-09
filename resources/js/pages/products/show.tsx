'use client';

import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Heart, Minus, Plus, RotateCcw, Share2, Shield, ShoppingBag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { CartItem, Product, Wishlist } from '@/types';

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

interface ProductDetailPageProps {
    product: Product;
    relatedProducts?: Product[];
    cartItems?: CartItem[];
    wishlistItems?: Wishlist[];
}

export default function ProductDetailPage({ product, relatedProducts, cartItems, wishlistItems }: ProductDetailPageProps) {
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        // Check if the product is already in the cart
        if (cartItems) {
            const isInCart = cartItems.some((item) => item.product?.id === product.id);
            setIsInCart(isInCart);
        }
    }, [cartItems, product.id]);

    useEffect(() => {
        // Check if the product is already in the wishlist
        if (wishlistItems) {
            const isInWishlist = wishlistItems.some((item) => item.product.id === product.id);
            setIsWishlisted(isInWishlist);
        }
    }, [wishlistItems, product.id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const addToCart = (id: number) => {
        router.post('/cart/add', {
            product_id: id,
            quantity: 1,
        });
    };
    const toggleWishlist = (id: number) => {
        router.post(route('wishlist.toggle'), { product_id: id });
    };

    return (
        <AppLayout>
            <Head title={`${product.name} - Miftah Store`} />
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
                        <Link href={`/products/category/${product.category.id}`} className="text-gray-500 transition-colors hover:text-pink-600">
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
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur">
                                <CardContent className="p-0">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key="2d-view"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="relative aspect-square">
                                                <img
                                                    src={'/storage/' + product.photo || '/placeholder.svg'}
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
                                                        onClick={() => toggleWishlist(product.id)}
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
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
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
                                    onClick={() => addToCart(product.id)}
                                    disabled={product.stock === 0 || !selectedSize}
                                    className={`w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 ${
                                        isInCart ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                                    Add to Cart
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    onClick={() => toggleWishlist(product.id)}
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
                        {relatedProducts?.map((relatedProduct, index) => (
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
        </AppLayout>
    );
}
