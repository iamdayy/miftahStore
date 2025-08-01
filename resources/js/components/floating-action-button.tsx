import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

export function FloatingActionButton() {
    return (
        <motion.div className="fixed right-6 bottom-6 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    boxShadow: ['0 0 0 0 rgba(236, 72, 153, 0.7)', '0 0 0 10px rgba(236, 72, 153, 0)', '0 0 0 0 rgba(236, 72, 153, 0)'],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
                <Link href="/cart">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 shadow-2xl hover:from-pink-600 hover:to-violet-600"
                    >
                        <ShoppingBag className="h-6 w-6" />
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
