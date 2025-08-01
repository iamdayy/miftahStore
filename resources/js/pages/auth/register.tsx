import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/layouts/auth-layout';
import { Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User } from 'lucide-react';
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
    const { data, setData, processing, post, errors } = useForm({
        username: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showpassword_confirmation, setShowpassword_confirmation] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess() {
                console.log('Success');
            },
            onError(err) {
                console.error(err);
            },
        });
    };
    return (
        <AuthLayout>
            <motion.div className="relative z-10 w-full max-w-lg" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                    <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-lg">
                        <CardContent className="p-8">
                            {/* Header */}
                            <motion.div className="mb-8 text-center" variants={itemVariants}>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                >
                                    <Sparkles className="h-8 w-8 text-white" />
                                </motion.div>
                                <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
                                    Join FashionStore
                                </h1>
                                <p className="mt-2 text-gray-600">Create your account and discover amazing fashion</p>
                            </motion.div>

                            {/* Registration Form */}
                            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div variants={itemVariants}>
                                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                            Username
                                        </Label>
                                        <div className="relative mt-1">
                                            <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-emerald-400" />
                                            <Input
                                                id="username"
                                                type="text"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                className={`border-emerald-200 pl-11 transition-all duration-300 focus:border-emerald-400 focus:ring-emerald-400 ${
                                                    errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                                                }`}
                                                placeholder="Username"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.username && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="mt-1 text-sm text-red-500"
                                                >
                                                    {errors.username}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Name
                                        </Label>
                                        <div className="relative mt-1">
                                            <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-teal-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`border-teal-200 pl-11 transition-all duration-300 focus:border-teal-400 focus:ring-teal-400 ${
                                                    errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                                                }`}
                                                placeholder="Name"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="mt-1 text-sm text-red-500"
                                                >
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>

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
                                            placeholder="Create a password"
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

                                {/* Confirm Password Field */}
                                <motion.div variants={itemVariants}>
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-violet-400" />
                                        <Input
                                            id="password_confirmation"
                                            type={showpassword_confirmation ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className={`border-violet-200 pr-11 pl-11 transition-all duration-300 focus:border-violet-400 focus:ring-violet-400 ${
                                                errors.password_confirmation ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                                            }`}
                                            placeholder="Confirm your password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                                            onClick={() => setShowpassword_confirmation(!showpassword_confirmation)}
                                        >
                                            {showpassword_confirmation ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password_confirmation && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {errors.password_confirmation}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Terms & Conditions */}
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked={agreeToTerms}
                                            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                                            className="mt-1 border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <Label htmlFor="terms" className="text-sm leading-5 text-gray-600">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-emerald-600 underline transition-colors hover:text-emerald-700">
                                                Terms and Conditions
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/privacy" className="text-emerald-600 underline transition-colors hover:text-emerald-700">
                                                Privacy Policy
                                            </Link>
                                        </Label>
                                    </div>
                                    <AnimatePresence>
                                        {errors.terms && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {errors.terms}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={itemVariants}>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group w-full border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-600"
                                        >
                                            {processing ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                                                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                                />
                                            ) : (
                                                <>
                                                    Create Account
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </motion.form>

                            {/* Sign in link */}
                            <motion.div className="mt-6 text-center" variants={itemVariants}>
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link href="/login" className="font-medium text-emerald-600 transition-colors hover:text-emerald-700">
                                        Sign in
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
