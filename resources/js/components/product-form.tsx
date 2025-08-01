'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Category, Product } from '@/types';
import { useForm } from '@inertiajs/react';
import { ImageUploader } from './image-uploader';

interface ProductFormProps {
    categories: Category[];
    initialData?: Product;
    onFinish: () => void;
    onCancel: () => void;
}

export function ProductForm({ categories, initialData, onCancel, onFinish }: ProductFormProps) {
    const {
        data: formData,
        setData: setFormData,
        processing: isLoading,
        post,
    } = useForm({
        _method: initialData ? 'put' : 'post',
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        stock: initialData?.stock || 0,
        sizes: initialData?.sizes || [],
        photo: initialData?.photo || null,
        category_id: initialData?.category.id || 0,
    });
    const [initialPhoto] = useState(initialData?.photo || '');
    const [newSize, setNewSize] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
        if (formData.sizes.length === 0) newErrors.sizes = 'At least one size is required';
        if (!formData.photo && !initialPhoto) newErrors.photo = 'Product photo is required';
        if (formData.category_id === 0) newErrors.category_id = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const selectedCategory = categories.find((c) => c.id === formData.category_id);
        if (!selectedCategory) return;

        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                category_id: selectedCategory.id,
            }));
            post(route('admin.products.update', initialData.id), {
                forceFormData: true,
                onSuccess: () => {
                    onFinish();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            });
        } else {
            post(route('admin.products.store'), {
                forceFormData: true,
                onSuccess: () => {
                    onFinish();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            });
        }
    };

    const addSize = () => {
        if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
            setFormData((prev) => ({
                ...prev,
                sizes: [...prev.sizes, newSize.trim()],
            }));
            setNewSize('');
        }
    };

    const removeSize = (sizeToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((size) => size !== sizeToRemove),
        }));
    };

    const handleInputChange = (field: string, value: string | number | boolean | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Product Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={3}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (IDR)</Label>
                    <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', Number.parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', Number.parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id.toString()} onValueChange={(value) => handleInputChange('category_id', Number.parseInt(value))}>
                    <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
            </div>

            {/* Sizes */}
            <div className="space-y-2">
                <Label>Available Sizes</Label>
                <div className="flex gap-2">
                    <Input
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        placeholder="Add size (e.g., S, M, L, XL)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" onClick={addSize} variant="outline">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {formData.sizes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {formData.sizes.map((size) => (
                            <Badge key={size} variant="secondary" className="flex items-center gap-1">
                                {size}
                                <button type="button" onClick={() => removeSize(size)} className="ml-1 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
                {errors.sizes && <p className="text-sm text-red-500">{errors.sizes}</p>}
            </div>

            {/* Photo */}
            <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <ImageUploader onImageChange={(file) => handleInputChange('photo', file)} initialImage={initialPhoto} />
                {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600"
                    disabled={isLoading}
                >
                    {initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </motion.form>
    );
}
