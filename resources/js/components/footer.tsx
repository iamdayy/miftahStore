import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
export function Footer() {
    const { categories, name, quote } = usePage<SharedData>().props;
    const links = [
        { title: 'Home', href: '/', isActive: route().current('home') },
        { title: 'Products', href: '/products', isActive: route().current('products.index') },
        ...categories.map((category) => ({
            title: category.name,
            href: route('products.category', { category: category.id }),
            isActive: route().current('products.category', { category: category.id }),
        })),
    ];
    return (
        <motion.footer
            className="relative mt-16 overflow-hidden py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }}
        >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 container">
                <motion.div
                    className="grid grid-cols-1 gap-8 text-white md:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div variants={itemVariants}>
                        <h3 className="mb-4 text-xl font-semibold">{name}</h3>
                        <p className="text-sm text-white/80">{quote.message}</p>
                    </motion.div>

                    {[
                        {
                            title: 'Categories',
                            links,
                        },
                    ].map((section, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <h4 className="mb-4 font-semibold">{section.title}</h4>
                            <ul className="space-y-2 text-sm">
                                {section.links.map((link, linkIndex) => (
                                    <motion.li
                                        key={linkIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: linkIndex * 0.1 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <Link href={link.href} className={`text-white/80 hover:text-white ${link.isActive ? 'font-semibold' : ''}`}>
                                            {link.title}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    <motion.div variants={itemVariants}>
                        <h4 className="mb-4 font-semibold">Newsletter</h4>
                        <p className="mb-4 text-sm text-white/80">Subscribe to get updates on new arrivals and exclusive offers.</p>
                        <div className="flex gap-2">
                            <Input placeholder="Your email" className="flex-1 border-white/30 bg-white/20 text-white placeholder:text-white/60" />
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="bg-white text-purple-600 hover:bg-white/90">Subscribe</Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/80"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p>
                        &copy; {new Date().getFullYear()} {name}. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    );
}
