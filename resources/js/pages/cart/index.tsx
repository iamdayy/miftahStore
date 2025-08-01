'use client';

import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { CartItem, SharedData } from '@/types';

interface CartItemWithDetails extends CartItem {
    id: number;
    size: string;
    color: string;
}

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

interface CartPageProps extends SharedData {
    carts: CartItemWithDetails[];
    subtotal: number;
}

export default function CartPage() {
    const { carts, subtotal } = usePage<CartPageProps>().props;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        router.post(route('cart.update'), {
            product_id: id,
            quantity: newQuantity,
        });
    };

    const removeItem = (id: number) => {
        router.post(route('cart.update'), {
            product_id: id,
            quantity: 0,
        });
    };

    return (
        <AppLayout>
            <div className="container py-8">
                {/* Page Title */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
                                Shopping Cart
                            </h1>
                            <p className="mt-1 text-gray-600">
                                You have {carts.length} item{carts.length !== 1 ? 's' : ''} in your cart
                            </p>
                        </div>
                        <Link href="/products">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" className="border-indigo-200 bg-transparent text-indigo-600 hover:bg-indigo-50">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Continue Shopping
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {carts.length === 0 ? (
                    // Empty Cart
                    <motion.div className="py-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                            <ShoppingBag className="h-12 w-12 text-pink-400" />
                        </div>
                        <h2 className="mb-2 text-2xl font-semibold text-gray-700">Your cart is empty</h2>
                        <p className="mb-6 text-gray-500">Looks like you haven't added any items to your cart yet</p>
                        <Link href="/products">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Start Shopping
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                <AnimatePresence>
                                    {carts.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, x: -100 }}
                                            layout
                                        >
                                            <Card className="overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur">
                                                <CardContent className="p-6">
                                                    <div className="flex gap-4">
                                                        {/* Product Image */}
                                                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                                                            <img
                                                                src={'/storage/' + item.product.photo || '/placeholder.svg'}
                                                                alt={item.product.name}
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-2 flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="truncate text-lg font-semibold text-gray-900">
                                                                        {item.product.name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                        <span>Size: {item.size}</span>
                                                                        <span>Color: {item.color}</span>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {item.product.category.name}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="p-1 text-red-500 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </motion.button>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                {/* Price */}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent">
                                                                        {formatPrice(item.product.price)}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">Stock: {item.product.stock}</span>
                                                                </div>

                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center gap-2">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-50"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </motion.button>
                                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        disabled={item.quantity >= item.product.stock}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                                <Card className="sticky top-24 border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardContent className="p-6">
                                        <h3 className="mb-4 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-semibold text-transparent">
                                            Order Summary
                                        </h3>

                                        {/* Coupon Code Input */}
                                        {/* <div className="mb-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="Enter coupon code"
                                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                                <Button
                                                    onClick={applyCoupon}
                                                    className="bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600"
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                            {appliedCoupon && (
                                                <div className="mt-2 text-sm text-green-600">
                                                    Coupon <strong>{appliedCoupon.title}</strong> applied! You save {appliedCoupon.value}{' '}
                                                    {appliedCoupon.type === 'percentage' ? '%' : 'IDR'}.
                                                </div>
                                            )}
                                        </div> */}

                                        <div className="mb-6 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal ({carts.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>

                                            <Separator />

                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                                                    {formatPrice(subtotal)}
                                                </span>
                                            </div>
                                        </div>

                                        <motion.div className="space-y-3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Link href="/checkout" method="post" className="w-full">
                                                <Button className="group w-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                                    Proceed to Checkout
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>

                                            {/* Save for Later */}
                                        </motion.div>

                                        {/* Security Badge */}
                                        <div className="mt-6 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
                                            <div className="flex items-center gap-2 text-sm text-emerald-700">
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                                    <span className="text-xs text-white">✓</span>
                                                </div>
                                                <span>Secure checkout with SSL encryption</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
