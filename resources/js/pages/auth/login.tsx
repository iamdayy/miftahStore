import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/layouts/auth-layout';
import { Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Heart, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

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

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        post,
        data,
        setData,
        errors,
        processing: isLoading,
    } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess() {
                console.log('Success Login!');
            },
        });
    };
    return (
        <AuthLayout>
            <motion.div className="relative z-10 w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                    <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-lg">
                        <CardContent className="p-8">
                            {/* Header */}
                            <motion.div className="mb-8 text-center" variants={itemVariants}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                                >
                                    <Heart className="h-8 w-8 text-white" />
                                </motion.div>
                                <h1 className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
                                    Welcome Back
                                </h1>
                                <p className="mt-2 text-gray-600">Sign in to your account to continue shopping</p>
                            </motion.div>

                            {/* Login Form */}
                            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
                                {/* Email Field */}
                                <motion.div variants={itemVariants}>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-pink-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`border-pink-200 pl-11 transition-all duration-300 focus:border-pink-400 focus:ring-pink-400 ${
                                                errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                                            }`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Password Field */}
                                <motion.div variants={itemVariants}>
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-indigo-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`border-indigo-200 pr-11 pl-11 transition-all duration-300 focus:border-indigo-400 focus:ring-indigo-400 ${
                                                errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                                            }`}
                                            placeholder="Enter your password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                        </Button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Remember Me & Forgot Password */}
                                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                            className="border-pink-300 text-pink-600 focus:ring-pink-500"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-600">
                                            Remember me
                                        </Label>
                                    </div>
                                    <Link href="/forgot-password" className="text-sm text-pink-600 transition-colors hover:text-pink-700">
                                        Forgot password?
                                    </Link>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={itemVariants}>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="group w-full border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-violet-600"
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                                                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                                />
                                            ) : (
                                                <>
                                                    Sign In
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </motion.form>

                            {/* Sign up link */}
                            <motion.div className="mt-6 text-center" variants={itemVariants}>
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="font-medium text-pink-600 transition-colors hover:text-pink-700">
                                        Sign up
                                    </Link>
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AuthLayout>
    );
}
