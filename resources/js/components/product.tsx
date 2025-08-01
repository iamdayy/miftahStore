import { Product, SharedData } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ProductProps {
    product: Product;
    index: number;
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

export function ProductCard({ product, index }: ProductProps) {
    const { auth } = usePage<SharedData>().props;
    const { cartItems, wishlistItems } = auth;
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
            <Card className="group overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                            <img
                                src={'/storage/' + product.photo || '/placeholder.svg'}
                                alt={product.name}
                                width={300}
                                height={400}
                                className="h-64 w-full object-cover"
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
                                    className="absolute top-2 left-2"
                                >
                                    <Badge className="animate-pulse border-0 bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg">
                                        Low Stock
                                    </Badge>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Wishlist button with iconic color */}
                        <motion.div initial={{ opacity: 0, scale: 0 }} whileHover={{ opacity: 1, scale: 1 }} className="absolute top-2 right-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => toggleWishlist(product.id)}
                                className="border-pink-200 bg-white/90 backdrop-blur-sm hover:bg-pink-50"
                            >
                                <motion.div
                                    animate={{
                                        scale: wishlistItems?.find((w) => w.product.id === product.id) ? [1, 1.3, 1] : 1,
                                        color: wishlistItems?.find((w) => w.product.id === product.id) ? '#ec4899' : '#6b7280',
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Heart className={`h-4 w-4 ${wishlistItems?.find((w) => w.product.id === product.id) ? 'fill-pink-500' : ''}`} />
                                </motion.div>
                            </Button>
                        </motion.div>

                        {/* Quick view button with gradient */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <motion.div initial={{ y: 20, opacity: 0 }} whileHover={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                <Link href={`/products/${product.id}`} className="w-full">
                                    <Button
                                        className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                                        asChild
                                    >
                                        Quick View
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div className="p-4" variants={itemVariants}>
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-lg font-semibold transition-colors group-hover:text-pink-600">{product.name}</h3>
                            <Badge variant="outline" className="text-xs">
                                {product.category.name}
                            </Badge>
                        </div>

                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>

                        {/* Sizes */}
                        <div className="mb-3 flex items-center gap-1">
                            <span className="text-xs text-gray-500">Sizes:</span>
                            {product.sizes.slice(0, 4).map((size, i) => (
                                <Badge key={i} variant="outline" className="px-1 py-0 text-xs">
                                    {size}
                                </Badge>
                            ))}
                            {product.sizes.length > 4 && <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>}
                        </div>

                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <motion.span
                                    className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {formatPrice(product.price)}
                                </motion.span>
                            </div>
                            <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/products/${product.id}`} className="flex-1">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full border-pink-200 bg-transparent text-pink-600 transition-all duration-300 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 hover:text-pink-700"
                                    >
                                        View Details
                                    </Button>
                                </motion.div>
                            </Link>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    className="group relative w-full overflow-hidden border-0 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:from-indigo-600 hover:to-purple-600"
                                    onClick={() => addToCart(product.id)}
                                    disabled={product.stock === 0}
                                >
                                    <motion.span
                                        animate={cartItems?.find((c) => c.product.id === product.id) ? { x: [0, -100, 100, 0] } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </motion.span>
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500"
                                        initial={{ x: '100%' }}
                                        animate={cartItems?.find((c) => c.product.id === product.id) ? { x: 0 } : { x: '100%' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        ✓ Added!
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
