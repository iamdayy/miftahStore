'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Search, Shield, UserCheck, UserIcon, UserX } from 'lucide-react';
import { useState } from 'react';

import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginatedResponse, SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';

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

interface UserPageProps extends SharedData {
    users: PaginatedResponse<User>;
}

export default function UsersManagement() {
    const { users } = usePage<UserPageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const filteredUsers = users.data.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'verified' && user.email_verified_at !== null) ||
            (selectedStatus === 'unverified' && user.email_verified_at === null);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleRoleChange = (userId: number, newRole: 'admin' | 'customer') => {
        // setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole, updated_at: new Date().toISOString() } : user)));
        // This is a placeholder for the actual role change logic
        console.log(`Changing role of user ${userId} to ${newRole}`);
    };

    const handleDeleteUser = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            // setUsers(users.filter((u) => u.id !== id));
            // This is a placeholder for the actual delete logic
            console.log(`Deleting user ${id}`);
        }
    };

    const totalUsers = users.data.length;
    const verifiedUsers = users.data.filter((u) => u.email_verified_at !== null).length;
    const adminUsers = users.data.filter((u) => u.role === 'admin').length;
    const customerUsers = users.data.filter((u) => u.role === 'customer').length;

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
                                        Users Management
                                    </h1>
                                    <p className="mt-1 text-gray-600">Manage user accounts and permissions</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Cards */}
                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                                        <UserIcon className="h-4 w-4 text-pink-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Verified Users</CardTitle>
                                        <UserCheck className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{verifiedUsers}</div>
                                        <p className="text-xs text-gray-500">{((verifiedUsers / totalUsers) * 100).toFixed(1)}% of total</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
                                        <Shield className="h-4 w-4 text-indigo-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{adminUsers}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
                                        <UserIcon className="h-4 w-4 text-emerald-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{customerUsers}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Filters */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-lg">Filter Users</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <Input
                                                    placeholder="Search users..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                            <SelectTrigger className="w-full md:w-[150px]">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Roles</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="customer">Customer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                            <SelectTrigger className="w-full md:w-[150px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="verified">Verified</SelectItem>
                                                <SelectItem value="unverified">Unverified</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Users Table */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur">
                                <CardHeader>
                                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                                    <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Joined</TableHead>
                                                    <TableHead>Last Updated</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {filteredUsers.map((user) => (
                                                        <motion.tr
                                                            key={user.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                                                        {user.avatar ? (
                                                                            <img
                                                                                src={user.avatar || '/placeholder.svg'}
                                                                                alt={user.name}
                                                                                className="object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-pink-400 to-violet-400">
                                                                                <span className="text-sm font-semibold text-white">
                                                                                    {user.name.charAt(0)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="text-gray-900">{user.email}</p>
                                                                    {user.email_verified_at && (
                                                                        <p className="text-xs text-green-600">
                                                                            Verified {formatDate(user.email_verified_at)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={user.role}
                                                                    onValueChange={(value: 'admin' | 'customer') => handleRoleChange(user.id, value)}
                                                                >
                                                                    <SelectTrigger className="w-[120px]">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="customer">Customer</SelectItem>
                                                                        <SelectItem value="admin">Admin</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    {user.email_verified_at ? (
                                                                        <Badge className="border-green-200 bg-green-100 text-green-700">
                                                                            <UserCheck className="mr-1 h-3 w-3" />
                                                                            Verified
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="border-yellow-200 bg-yellow-100 text-yellow-700"
                                                                        >
                                                                            <UserX className="mr-1 h-3 w-3" />
                                                                            Unverified
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-gray-600">{formatDate(user.created_at)}</TableCell>
                                                            <TableCell className="text-gray-600">{formatDate(user.updated_at)}</TableCell>
                                                            <TableCell className="text-right">
                                                                {/* <div className="flex items-center justify-end gap-2">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div> */}
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
