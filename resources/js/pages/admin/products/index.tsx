'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Edit, Eye, Filter, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { ProductForm } from '@/components/product-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category, Product, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';

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

interface ProductsPageProps extends SharedData {
    products: {
        data: Product[];
        links: unknown[];
    };
    categories: Category[];
}

export default function ProductsManagement() {
    const { products, categories } = usePage<ProductsPageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    useEffect(() => {
        router.get(
            route('admin.products.index'),
            { search: searchQuery, category_id: selectedCategory === 'all' ? undefined : selectedCategory },
            {
                preserveState: true,
                replace: true,
            },
        );
    }, [searchQuery, selectedCategory]);
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleDeleteProduct = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('admin.products.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally refresh the product list or show a success message
                },
                onError: (errors) => {
                    console.error('Failed to delete product:', errors);
                    alert('Failed to delete product. Please try again.');
                },
            });
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                        {/* Header */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
                                        Products Management
                                    </h1>
                                    <p className="mt-1 text-gray-600">Manage your product catalog and inventory</p>
                                </div>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="border-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:from-pink-600 hover:to-violet-600">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Product
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Add New Product</DialogTitle>
                                            <DialogDescription>Create a new product for your store</DialogDescription>
                                        </DialogHeader>
                                        <ProductForm
                                            categories={categories}
                                            onCancel={() => setIsAddDialogOpen(false)}
                                            onFinish={() => {
                                                setIsAddDialogOpen(false);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </motion.div>

                        {/* Stats Cards */}
                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                                        <Package className="h-4 w-4 text-pink-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{products.data.length}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
                                        <Package className="h-4 w-4 text-red-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{products.data.filter((p) => p.stock < 20).length}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
                                        <Package className="h-4 w-4 text-indigo-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Filters */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-lg">Filter Products</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <Input
                                                    placeholder="Search products..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-full md:w-[200px]">
                                                <Filter className="mr-2 h-4 w-4" />
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Products Table */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardHeader>
                                    <CardTitle>Products ({products.data.length})</CardTitle>
                                    <CardDescription>Manage your product inventory and details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Stock</TableHead>
                                                    <TableHead>Sizes</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {products.data.map((product) => (
                                                        <motion.tr
                                                            key={product.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                                                                        <img
                                                                            src={'/storage/' + product.photo || '/placeholder.svg'}
                                                                            alt={product.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{product.category.name}</Badge>
                                                            </TableCell>
                                                            <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className={product.stock < 20 ? 'font-medium text-red-600' : 'text-gray-900'}
                                                                    >
                                                                        {product.stock}
                                                                    </span>
                                                                    {product.stock < 20 && (
                                                                        <Badge variant="destructive" className="text-xs">
                                                                            Low
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {product.sizes.slice(0, 3).map((size) => (
                                                                        <Badge key={size} variant="secondary" className="text-xs">
                                                                            {size}
                                                                        </Badge>
                                                                    ))}
                                                                    {product.sizes.length > 3 && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            +{product.sizes.length - 3}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
                                                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Dialog
                                                                        open={editingProduct?.id === product.id}
                                                                        onOpenChange={(open) => !open && setEditingProduct(null)}
                                                                    >
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0"
                                                                                onClick={() => setEditingProduct(product)}
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                                                            <DialogHeader>
                                                                                <DialogTitle>Edit Product</DialogTitle>
                                                                                <DialogDescription>Update product information</DialogDescription>
                                                                            </DialogHeader>
                                                                            {editingProduct && (
                                                                                <ProductForm
                                                                                    categories={categories}
                                                                                    initialData={editingProduct}
                                                                                    onCancel={() => setEditingProduct(null)}
                                                                                    onFinish={() => {
                                                                                        setEditingProduct(null);
                                                                                        // Optionally refresh the product list here
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {products.data.length === 0 && (
                                        <div className="py-8 text-center">
                                            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                            <h3 className="mb-2 text-lg font-medium text-gray-900">No products found</h3>
                                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
