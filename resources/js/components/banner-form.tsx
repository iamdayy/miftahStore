'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Banner, Product } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ImageUploader } from './image-uploader';

interface BannerFormProps {
    banner?: Banner | null;
    products: Product[];
    onFinish: () => void;
    onCancel: () => void;
}

export function BannerForm({ banner, products, onFinish, onCancel }: BannerFormProps) {
    const {
        data: formData,
        setData: setFormData,
        post,
    } = useForm({
        _method: banner ? 'put' : 'post',
        title: banner?.title || '',
        description: banner?.description || '',
        product_id: banner?.product.id || '',
        image: null as File | null,
    });
    const [preview] = useState<string>(banner?.image || '/placeholder.svg');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedProduct = products.find((p) => p.id.toString() === formData.product_id)?.id;
        if (!selectedProduct) return;
        if (banner) {
            post(route('admin.banners.update', banner.id), {
                forceFormData: true,
                onSuccess: () => {
                    onFinish();
                },
                onError: () => {
                    console.error('Failed to update banner');
                },
            });
        } else {
            post(route('admin.banners.store'), {
                onError(errors) {
                    console.error('Failed to create banner:', errors);
                },
            });
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const selectedProduct = products.find((p) => p.id.toString() === formData.product_id);

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
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto"
            >
                <Card className="border-0 bg-white shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-2xl text-transparent">
                            {banner ? 'Edit Banner' : 'Add New Banner'}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Left Column - Form Fields */}
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Banner Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., Summer Collection 2024"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your banner promotion..."
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    {/* Product Selection */}
                                    <div className="space-y-2">
                                        <Label>Featured Product *</Label>
                                        <Select
                                            value={formData.product_id.toString()}
                                            onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a product to feature" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id.toString()}>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={'/storage/' + product.photo || '/placeholder.svg'}
                                                                alt={product.name}
                                                                className="h-8 w-8 rounded object-cover"
                                                            />
                                                            <div>
                                                                <p className="font-medium">{product.name}</p>
                                                                <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Selected Product Info */}
                                    {selectedProduct && (
                                        <div className="rounded-lg border bg-gradient-to-r from-pink-50 to-violet-50 p-4">
                                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                                                <ExternalLink className="h-4 w-4" />
                                                Selected Product
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={'/storage/' + selectedProduct.photo || '/placeholder.svg'}
                                                    alt={selectedProduct.name}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium">{selectedProduct.name}</p>
                                                    <p className="text-sm text-gray-600">{selectedProduct.category.name}</p>
                                                    <p className="text-sm font-semibold text-pink-600">{formatPrice(selectedProduct.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Image Preview */}
                                <div className="space-y-4">
                                    <Label>Banner Image</Label>
                                    <div className="relative aspect-[2/1] overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
                                        <ImageUploader
                                            initialImage={preview}
                                            onImageChange={(file) => {
                                                setFormData({ ...formData, image: file });
                                            }}
                                        />

                                        {/* Banner Content Overlay */}
                                        {formData.title && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        )}
                                        {formData.title && (
                                            <div className="absolute right-4 bottom-4 left-4">
                                                <h3 className="mb-2 text-xl font-bold text-white">{formData.title}</h3>
                                                <p className="line-clamp-2 text-sm text-white/90">{formData.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <p>Recommended size: 800x400px</p>
                                        <p>Maximum file size: 5MB</p>
                                        <p>Supported formats: JPG, PNG, WebP</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 border-t pt-6">
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
                                    disabled={!formData.title || !formData.description || !formData.product_id}
                                >
                                    {banner ? 'Update Banner' : 'Create Banner'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
