'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { DollarSign, Percent, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Discount } from '@/types';
import { useForm } from '@inertiajs/react';
import { ImageUploader } from './image-uploader';

interface DiscountFormProps {
    discount?: Discount | null;
    onFinish?: () => void;
    onCancel: () => void;
}

export function DiscountForm({ discount, onFinish, onCancel }: DiscountFormProps) {
    const {
        data: formData,
        setData: setFormData,
        post,
        // processing,
        // errors,
        reset,
    } = useForm({
        _method: discount ? 'put' : 'post',
        title: discount?.title || '',
        code: discount?.code || '',
        description: discount?.description || '',
        type: discount?.type || 'percentage',
        value: discount?.value || 0,
        status: discount?.status || 'active',
        start_date: discount?.start_date || '',
        end_date: discount?.end_date || '',
        image: null as File | null, // Use File type for image
    });
    const [imagePreview] = useState<string | null>(discount?.image || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.start_date > formData.end_date) {
            alert('End date must be after start date.');
            return;
        }
        if (formData.type === 'percentage' && (formData.value < 0 || formData.value > 100)) {
            alert('Percentage value must be between 0 and 100.');
            return;
        }
        if (formData.type === 'fixed' && formData.value < 0) {
            alert('Fixed amount must be a positive number.');
            return;
        }
        if (!formData.title || !formData.code || !formData.start_date || !formData.end_date) {
            alert('Please fill in all required fields.');
            return;
        }
        if (formData.start_date > formData.end_date) {
            alert('Start date cannot be after end date.');
            return;
        }
        if (discount) {
            post(route('admin.discounts.update', discount.id), {
                onSuccess: () => {
                    reset();
                    if (onFinish) {
                        onFinish();
                    }
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            post(route('admin.discounts.store'), {
                onSuccess: () => {
                    reset();
                    if (onFinish) {
                        onFinish();
                    }
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const generateCode = () => {
        const code =
            formData.title
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 8) + Math.floor(Math.random() * 100);
        setFormData({ ...formData, code });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            >
                <Card className="border-0 bg-white shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-2xl text-transparent">
                            {discount ? 'Edit Discount' : 'Add New Discount'}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Preview */}
                            <div className="space-y-2">
                                <Label>Discount Image</Label>
                                <ImageUploader initialImage={imagePreview} onImageChange={(image) => setFormData({ ...formData, image })} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Summer Sale"
                                        required
                                    />
                                </div>

                                {/* Code */}
                                <div className="space-y-2">
                                    <Label htmlFor="code">Discount Code *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="e.g., SUMMER20"
                                            className="font-mono"
                                            required
                                        />
                                        <Button type="button" variant="outline" onClick={generateCode}>
                                            Generate
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your discount offer..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Type */}
                                <div className="space-y-2">
                                    <Label>Discount Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">
                                                <div className="flex items-center gap-2">
                                                    <Percent className="h-4 w-4" />
                                                    Percentage
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="fixed">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Fixed Amount
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Value */}
                                <div className="space-y-2">
                                    <Label htmlFor="value">{formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (IDR)'} *</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                        placeholder={formData.type === 'percentage' ? '20' : '50000'}
                                        min="0"
                                        max={formData.type === 'percentage' ? '100' : undefined}
                                        required
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                <Badge className="bg-green-500">Active</Badge>
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                <Badge variant="secondary">Inactive</Badge>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Start Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        min={formData.start_date}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="rounded-lg border bg-gradient-to-r from-pink-50 to-violet-50 p-4">
                                <h4 className="mb-2 font-semibold text-gray-900">Preview</h4>
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                                        {formData.type === 'percentage'
                                            ? `${formData.value}% OFF`
                                            : `${formData.value.toLocaleString('id-ID')} IDR OFF`}
                                    </Badge>
                                    <div>
                                        <p className="font-medium">{formData.title || 'Discount Title'}</p>
                                        <p className="font-mono text-sm text-gray-600">Code: {formData.code || 'DISCOUNT'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="flex-1 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600"
                                >
                                    {discount ? 'Update Discount' : 'Create Discount'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
