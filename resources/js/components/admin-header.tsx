'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, User } from 'lucide-react';

export function AdminHeader() {
    // const [notifications] = useState(3);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-gray-200 bg-white px-6 py-4"
        >
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="flex max-w-md flex-1 items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Search products, orders, users..."
                            className="border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    {/* <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {notifications > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white"
                            >
                                {notifications}
                            </motion.span>
                        )}
                    </Button> */}

                    {/* User Menu */}
                    <Button variant="ghost" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden font-medium md:block">Admin User</span>
                    </Button>
                </div>
            </div>
        </motion.header>
    );
}
