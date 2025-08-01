'use client';

import { Link, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CreditCard, List, Lock, MapPin, Phone, ShoppingBag, Truck, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Discount, Order, Product, RajaOngkirDestination, SharedData, ShippingOption } from '@/types';

interface ProductWithPivot extends Product {
    pivot: {
        quantity: number;
        review_id: number | null;
    };
}
interface CheckoutPageProps extends SharedData {
    cartItems: ProductWithPivot[];
    discounts: Discount[];
    order: Order | null;
    snap_token: string | null;
}

declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: unknown) => void;
                    onPending?: (result: unknown) => void;
                    onError?: (result: unknown) => void;
                    onClose?: () => void;
                },
            ) => void;
        };
    }
}

export default function CheckoutPage() {
    // Load Snap.js dynamically if not already in index.html
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-ZvH_23Hbw4WnLjer');
    document.body.appendChild(script);
    const { cartItems, discounts, csrf, order, snap_token } = usePage<CheckoutPageProps>().props;
    console.log('Snap Token:', snap_token);
    const [currentStep, setCurrentStep] = useState(route().params.step ? parseInt(route().params.step as string, 10) : 1);
    const {
        data: shippingData,
        setData: setShippingData,
        post,
    } = useForm({
        full_name: order?.shipping?.full_name || '',
        address: order?.shipping?.address || '',
        subdistrict: order?.shipping?.subdistrict || '',
        district: order?.shipping?.district || '',
        city: order?.shipping?.city || '',
        province: order?.shipping?.province || '',
        postal_code: order?.shipping?.postal_code || '',
        phone: order?.shipping?.phone || '',
        courier: order?.shipping?.courier || '',
        service: order?.shipping?.service || '',
        shipping_cost: order?.shipping?.shipping_cost || 0,
        note: order?.shipping?.note || '',
        status: order?.shipping?.status || 'pending',
    });
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(order?.discount || null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingDestinations, setShippingDestinations] = useState<RajaOngkirDestination[]>([]);
    const [selectedDestination, setSelectedDestination] = useState<RajaOngkirDestination | null>(null);
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const setData = (key: string, value: string | number) => {
        setShippingData((prev) => ({ ...prev, [key]: value }));
    };

    const stepParam = route().params.step;

    useEffect(() => {
        if (stepParam) {
            const step = parseInt(stepParam as string, 10);
            if (step >= 1 && step <= 3) {
                setCurrentStep(step);
            } else {
                console.error('Invalid step parameter:', step);
            }
        }
    }, [stepParam]);

    useEffect(() => {
        if (order && order.shipping) {
            setShippingOptions([
                {
                    service: order.shipping.service || '',
                    cost: order.shipping.shipping_cost || 0,
                    name: '',
                    code: '',
                    description: '',
                    etd: '',
                },
            ]);
            setSelectedShipping({
                service: order.shipping.service || '',
                cost: order.shipping.shipping_cost || 0,
                name: '',
                code: '',
                description: '',
                etd: '',
            });
        }
    }, [order]);

    useEffect(() => {
        const getDestination = async (subdistrict: string) => {
            try {
                const response = await fetch(route('shipping.destination', { query: subdistrict }), {
                    method: 'GET',
                });
                const data = (await response.json()) as RajaOngkirDestination[] | { error: string };

                if ('error' in data) {
                    console.error('Error fetching destination:', data.error);
                    setShippingDestinations([]);
                    return [];
                }

                setShippingDestinations(data);
                return data || [];
            } catch (error) {
                console.error('Error fetching destination:', error);
                return [];
            }
        };
        getDestination(shippingData.subdistrict);
    }, [shippingData.subdistrict]);

    useEffect(() => {
        if (selectedDestination) {
            setData('subdistrict', selectedDestination.subdistrict_name);
            setData('district', selectedDestination.district_name);
            setData('city', selectedDestination.city_name);
            setData('province', selectedDestination.province_name);
            setData('postal_code', selectedDestination.zip_code);
        }
    }, [selectedDestination]);
    useEffect(() => {
        const calculateShippingCost = async () => {
            if (!selectedDestination) return;

            try {
                const response = await fetch(route('shipping.calculateCost'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrf,
                    },
                    body: JSON.stringify({
                        destination: selectedDestination.id,
                        weight: cartItems.reduce((total, item) => total + 250 * item.pivot.quantity, 0),
                        courier: shippingData.courier,
                    }),
                });

                const data = (await response.json()) as ShippingOption[];
                setShippingOptions(data || []);
            } catch (error) {
                console.error('Error calculating shipping cost:', error);
            }
        };
        if (shippingData.courier !== '' && selectedDestination) {
            calculateShippingCost();
        }
    }, [cartItems, csrf, selectedDestination, shippingData.courier]);

    useEffect(() => {
        if (selectedShipping) {
            setData('service', selectedShipping.service);
            setData('shipping_cost', selectedShipping.cost);
        }
    }, [selectedShipping, shippingOptions]);

    const handlePay = () => {
        if (window.snap && snap_token) {
            window.snap.pay(snap_token, {
                onSuccess: function (result) {
                    alert('Payment success!');
                    console.log(result);
                },
                onPending: function (result) {
                    alert('Payment pending!');
                    console.log(result);
                },
                onError: function (result) {
                    alert('Payment failed!');
                    console.log(result);
                },
                onClose: function () {
                    alert('Pop-up closed without finishing payment');
                },
            });
        } else {
            console.error('Snap.js not loaded or transaction token missing.');
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.pivot.quantity, 0);
    const shippingCost = shippingOptions.find((option) => option.code === selectedShipping?.code)?.cost || 0;
    const selectedDiscountData = selectedDiscount ? discounts.find((d) => d.id === selectedDiscount.id) : null;
    const discountAmount =
        selectedDiscountData?.type === 'percentage'
            ? (subtotal * selectedDiscountData.value) / 100
            : selectedDiscountData?.type === 'fixed'
              ? selectedDiscountData.value
              : 0;
    const total = subtotal + parseInt(shippingCost as unknown as string, 10) - discountAmount;

    const handleShippingDataChange = () => {
        post(route('checkout.shipping.update', { orderId: order?.id }));
    };

    const handleProcessPayment = () => {
        router.post(route('checkout.process-payment'), {
            discount_id: selectedDiscount ? selectedDiscount.id : null,
            order_id: order?.id,
        });
    };
    const handleNextStep = () => {
        switch (currentStep) {
            case 1:
                if (
                    !shippingData.full_name ||
                    !shippingData.address ||
                    !shippingData.subdistrict ||
                    !shippingData.city ||
                    !shippingData.province ||
                    !shippingData.postal_code
                ) {
                    alert('Please fill in all required fields.');
                    return;
                }
                if (!shippingData.courier || !selectedShipping) {
                    alert('Please select a courier and shipping service.');
                    return;
                }
                handleShippingDataChange();
                break;
            case 2:
                handleProcessPayment();
                return;
            case 3:
                if (isProcessing) return; // Prevent multiple submissions
                handlePlaceOrder();
                return;
            default:
                break;
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            window.history.pushState({}, '', route('checkout', { step: currentStep - 1, order_id: order?.id }));
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        handlePay();
    };

    const steps = [
        { number: 1, title: 'Shipping', description: 'Enter your shipping details' },
        { number: 2, title: 'Payment', description: 'Choose payment method' },
        { number: 3, title: 'Review', description: 'Review your order' },
    ];
    if (currentStep > steps.length) {
        return <div className="text-center text-red-500">Invalid step</div>;
    }
    switch (currentStep) {
        case 1:
            document.title = 'Checkout - Shipping Information';
            break;
        case 2:
            document.title = 'Checkout - Payment Information';
            break;
        case 3:
            document.title = 'Checkout - Order Review';
            break;
        default:
            document.title = 'Checkout';
            break;
    }

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

                    <div className="flex items-center space-x-4">
                        <Link href="/cart">
                            <Button variant="outline" className="border-pink-200 bg-transparent text-pink-600 hover:bg-pink-50">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Cart
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.header>

            <div className="container py-8">
                {/* Progress Steps */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center justify-center space-x-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                                            currentStep >= step.number
                                                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-sm font-medium">{step.title}</p>
                                        <p className="text-xs text-gray-500">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`mx-4 h-0.5 w-16 transition-all duration-300 ${
                                            currentStep > step.number ? 'bg-gradient-to-r from-pink-500 to-violet-500' : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div>
                    {/* Main Content */}
                    <div>
                        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            {/* Step 1: Shipping Information */}
                            {currentStep === 1 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-indigo-600" />
                                            Shipping Information
                                        </CardTitle>
                                        <CardDescription>Enter your delivery details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name *</Label>
                                                <div className="relative">
                                                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                    <Input
                                                        id="fullName"
                                                        value={shippingData.full_name}
                                                        onChange={(e) => setShippingData({ ...shippingData, full_name: e.target.value })}
                                                        placeholder="Enter your full name"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <div className="relative">
                                                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                    <Input
                                                        id="phone"
                                                        value={shippingData.phone}
                                                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                                        placeholder="Enter your phone number"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address *</Label>
                                            <div className="relative">
                                                <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                                <Textarea
                                                    id="address"
                                                    value={shippingData.address}
                                                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                                    placeholder="Enter your full address"
                                                    className="pl-10"
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="subdistrict">Subdistrict</Label>
                                                <Input
                                                    id="subdistrict"
                                                    value={shippingData.subdistrict}
                                                    onChange={(e) => setShippingData({ ...shippingData, subdistrict: e.target.value })}
                                                    placeholder="Enter your subdistrict"
                                                />
                                                <Select
                                                    value={selectedDestination?.id.toString() || ''}
                                                    onValueChange={(value) => {
                                                        const destination = shippingDestinations?.find((d) => d.id.toString() === value);
                                                        setSelectedDestination(destination || null);
                                                    }}
                                                >
                                                    <SelectTrigger id="subdistrict" className="w-full">
                                                        <SelectValue placeholder="Select subdistrict" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {shippingDestinations?.map((destination) => (
                                                            <SelectItem key={destination.id} value={destination.id.toString()}>
                                                                {destination.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="district">District</Label>
                                                <Input
                                                    id="district"
                                                    value={shippingData.district}
                                                    onChange={(e) => setShippingData({ ...shippingData, district: e.target.value })}
                                                    placeholder="Enter your district"
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    value={shippingData.city}
                                                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                    placeholder="Enter your city"
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="province">Province *</Label>
                                                <Input
                                                    id="province"
                                                    value={shippingData.province}
                                                    onChange={(e) => setShippingData({ ...shippingData, province: e.target.value })}
                                                    placeholder="Enter your province"
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="postalCode">Postal Code *</Label>
                                                <Input
                                                    id="postalCode"
                                                    value={shippingData.postal_code}
                                                    onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                                                    placeholder="Enter your postal code"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Shipping Options */}
                                        {/* Courier Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="courier">Courier *</Label>
                                            <Select
                                                value={shippingData.courier}
                                                onValueChange={(value) => setShippingData({ ...shippingData, courier: value })}
                                            >
                                                <SelectTrigger id="courier" className="w-full">
                                                    <SelectValue placeholder="Select courier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="jne">JNE</SelectItem>
                                                    <SelectItem value="tiki">TIKI</SelectItem>
                                                    <SelectItem value="pos">POS Indonesia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Shipping Service Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="service">Shipping Service *</Label>
                                            <Select
                                                value={selectedShipping?.service}
                                                onValueChange={(value) => {
                                                    setSelectedShipping(shippingOptions.find((option) => option.service === value) || null);
                                                }}
                                            >
                                                <SelectTrigger id="service" className="w-full">
                                                    <SelectValue placeholder="Select shipping service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {shippingOptions.map((option) => (
                                                        <SelectItem key={option.service} value={option.service}>
                                                            {option.name} {option.service === selectedShipping?.service && '(Selected)'} (
                                                            {formatPrice(option.cost)})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="note">Additional Notes</Label>
                                            <Textarea
                                                id="note"
                                                value={shippingData.note}
                                                onChange={(e) => setShippingData({ ...shippingData, note: e.target.value })}
                                                placeholder="Any special instructions for delivery"
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 2: Invoice Information */}
                            {currentStep === 2 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Cart Items */}
                                        <div className="space-y-3">
                                            {cartItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                                        <img
                                                            src={item.photo ? '/storage/' + item.photo : '/placeholder.svg'}
                                                            alt={item.name}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="truncate text-sm font-medium">{item.name}</h4>
                                                        {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>Size: {item.size}</span>
                                                        <span>•</span>
                                                        <span>Color: {item.color}</span>
                                                    </div> */}
                                                        <div className="mt-1 flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Qty: {item.pivot.quantity}</span>
                                                            <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />

                                        {/* Order Totals */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.pivot.quantity, 0)} items)</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            {/* Discount Input */}
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="discount" className="text-sm">
                                                    Discount Code
                                                </Label>
                                                <Select
                                                    value={selectedDiscount?.toString() || ''}
                                                    onValueChange={(value) => {
                                                        const discount = discounts.find((d) => d.id.toString() === value);
                                                        setSelectedDiscount(discount ? discount : null);
                                                    }}
                                                >
                                                    <SelectTrigger id="discount" className="w-48">
                                                        <SelectValue placeholder="Select discount" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {discounts.map((discount) => (
                                                            <SelectItem key={discount.id} value={discount.id.toString()}>
                                                                {discount.code} - {discount.value}%
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Shipping</span>
                                                <span>{formatPrice(shippingCost)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                                                    {formatPrice(total)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Security Badge */}
                                        <div className="mt-6 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
                                            <div className="flex items-center gap-2 text-sm text-emerald-700">
                                                <Lock className="h-4 w-4" />
                                                <span>Secure checkout with SSL encryption</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 3: Order Review */}
                            {currentStep === 3 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            Order Review
                                        </CardTitle>
                                        <CardDescription>Review your order details before placing</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Shipping Details */}
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                                <Truck className="h-4 w-4" />
                                                Shipping Details
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                                <div>
                                                    <p>
                                                        <strong>Name:</strong> {shippingData.full_name}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {shippingData.phone}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <strong>Address:</strong> {shippingData.address}
                                                    </p>
                                                    <p>
                                                        <strong>Subdistrict:</strong> {shippingData.subdistrict}
                                                    </p>
                                                    <p>
                                                        <strong>District:</strong> {shippingData.district}
                                                    </p>
                                                    <p>
                                                        <strong>City:</strong> {shippingData.city}, {shippingData.province}
                                                    </p>
                                                    <p>
                                                        <strong>Postal Code:</strong> {shippingData.postal_code}
                                                    </p>
                                                </div>
                                            </div>
                                            {shippingData.note && (
                                                <div className="mt-3 border-t pt-3">
                                                    <p className="text-sm">
                                                        <strong>Notes:</strong> {shippingData.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Payment Details */}
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                                <CreditCard className="h-4 w-4" />
                                                Payment Details
                                            </h4>
                                            <div className="space-y-2">
                                                <p>
                                                    <strong>Payment Method:</strong> {order?.payment?.payment_method || 'Not selected'}
                                                </p>
                                                <p>
                                                    <strong>Amount:</strong> {formatPrice(order?.payment?.amount || 0)}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong> {order?.payment?.status || 'Pending'}
                                                </p>
                                            </div>
                                            {order?.payment?.transaction_id && (
                                                <div className="mt-3 border-t pt-3">
                                                    <p className="text-sm">
                                                        <strong>Transaction ID:</strong> {order.payment.transaction_id}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Order Summary */}
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                                <List className="h-4 w-4" />
                                                Order Summary
                                            </h4>
                                            <div className="space-y-2">
                                                {cartItems.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span>{item.name}</span>
                                                        <span>
                                                            {item.pivot.quantity} x {formatPrice(item.price)} ={' '}
                                                            {formatPrice(item.pivot.quantity * item.price)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 border-t pt-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Subtotal</span>
                                                    <span>{formatPrice(subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Shipping</span>
                                                    <span>{formatPrice(shippingCost)}</span>
                                                </div>
                                                {selectedDiscount && (
                                                    <div className="flex justify-between text-sm">
                                                        <span>Discount ({selectedDiscount.value}%)</span>
                                                        <span>-{formatPrice(discountAmount)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-lg font-semibold">
                                                    <span>Total</span>
                                                    <span>{formatPrice(total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    disabled={currentStep === 1}
                                    className="border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>

                                {currentStep < 3 ? (
                                    <Button
                                        onClick={handleNextStep}
                                        className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                                    >
                                        Next Step
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing || order?.payment?.status === 'paid'}
                                        className="border-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Place Order
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
