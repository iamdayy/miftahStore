import { Banner } from '@/types';
import { formatPrice } from '@/utils/exports';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface HeroSectionProps {
    banners: Banner[];
}
export function HeroSection({ banners }: HeroSectionProps) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const nextBanner = () => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    };
    const prevBanner = () => {
        setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };
    const addToCart = (id: number) => {
        router.post('/cart/add', {
            product_id: id,
            quantity: 1,
        });
    };
    useEffect(() => {
        const interval = setInterval(nextBanner, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        // {/* Banner Carousel Section */}
        <section className="relative h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBannerIndex}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div className="relative h-full w-full">
                        <img
                            src={'/storage/' + banners[currentBannerIndex].image || '/placeholder.svg'}
                            alt={banners[currentBannerIndex].title}
                            className="object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                        {/* Banner Content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="container">
                                <div className="max-w-2xl text-white">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.8 }}
                                    >
                                        <h1 className="mb-4 text-4xl leading-tight font-bold md:text-6xl">{banners[currentBannerIndex].title}</h1>
                                        <p className="mb-8 text-xl leading-relaxed text-white/90">{banners[currentBannerIndex].description}</p>

                                        {/* Featured Product Info */}
                                        <div className="mb-8 flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                            <img
                                                src={'/storage/' + banners[currentBannerIndex].product.photo || '/placeholder.svg'}
                                                alt={banners[currentBannerIndex].product.name}
                                                width={80}
                                                height={80}
                                                className="rounded-lg object-cover"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">{banners[currentBannerIndex].product.name}</h3>
                                                <p className="mb-1 text-sm text-white/80">{banners[currentBannerIndex].product.category.name}</p>
                                                <p className="text-2xl font-bold text-yellow-400">
                                                    {formatPrice(banners[currentBannerIndex].product.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Link href={`/product/${banners[currentBannerIndex].product.id}`}>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        size="lg"
                                                        className="group border-0 bg-white text-purple-600 shadow-2xl hover:bg-gray-100"
                                                    >
                                                        <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
                                                        Lihat Produk
                                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    className="border-white bg-transparent text-white hover:bg-white hover:text-purple-600"
                                                    onClick={() => addToCart(banners[currentBannerIndex].product.id)}
                                                >
                                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                                    Tambah ke Keranjang
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Banner Navigation */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform items-center gap-4">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevBanner}
                    className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentBannerIndex(index)}
                            className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                index === currentBannerIndex ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>

                <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextBanner}
                    className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Banner Counter */}
            <div className="absolute top-6 right-6 rounded-full bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-sm">
                {currentBannerIndex + 1} / {banners.length}
            </div>
        </section>
    );
}
