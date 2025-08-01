import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    cartItems?: CartItem[];
    wishlistItems?: Wishlist[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    categories: Category[];
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    csrf: string;
    [key: string]: unknown;
}
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role: 'admin' | 'customer';
    cartItems?: CartItem[];
    wishlistItems?: Product[];
    orders?: Order[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    sizes: string[];
    photo: string;
    category: Category;
    product_id?: number;
}

export interface Banner {
    id: number;
    title: string;
    description: string;
    image: string;
    product?: Product;
}

export interface CartItem {
    product?: Product;
    quantity: number;
}

export interface Order {
    id: number;
    user: User;
    products: (Product & { pivot: { quantity: number; size: string } })[];
    shipping?: Shipping | null;
    shipping_id?: number;
    payment?: Payment | null;
    payment_id?: number;
    discount?: Discount | null;
    total_amount: string;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface ItemOrder {
    id: number;
    order: Order;
    product: Product;
    quantity: number;
    size: string;
    review?: Review | null;
}

export interface Review {
    id: number;
    subject: string;
    review: string;
    rating: number;
}

export interface Wishlist {
    id: number;
    product: Product;
}

export interface Payment {
    id?: number;
    order?: Order;
    payment_method: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed' | 'expired' | 'canceled';
    transaction_id: string;
    paid_at: string | null;
    snap_token?: string;
}

export interface Shipping {
    id?: number;
    full_name: string;
    phone: string;
    address: string;
    subdistrict: string;
    district: string;
    city: string;
    province: string;
    postal_code: string;
    courier: string;
    service: string;
    shipping_cost: number;
    tracking_number?: string;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    shipped_at?: string;
    delivered_at?: string;
    note?: string;
    order?: Order;
}

export interface Discount {
    id: number;
    title: string;
    description: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    start_date: string;
    end_date: string;
    image: string;
    status: 'active' | 'inactive';
}

export interface RajaOngkirDestination {
    id: number;
    label: string;
    province_name: string;
    city_name: string;
    district_name: string;
    subdistrict_name: string;
    zip_code: string;
}

export interface ShippingOption {
    name: string;
    code: string;
    service: string;
    description: string;
    cost: number;
    etd: string; // Estimated Time of Delivery
}
