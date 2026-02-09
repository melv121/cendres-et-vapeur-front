// Types pour l'administration - Réexport depuis les types principaux
export type { Product, User, Order, OrderItem, Category, Vote, ShiftNote, ColonyEvent } from '../../types/Product';

// Types spécifiques à l'admin
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  stock: number;
  base_price: number;
  current_price: number;
  popularity_score: number;
  category_id: number;
  status?: 'ACTIVE' | 'HIDDEN';
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  avatar_url?: string;
  biography?: string;
  active?: boolean;
  created_at?: string;
}

export interface SurvivorLog {
  id: number;
  createdAt: string;
  action: string;
  actor?: string;
  details?: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: 'admin' | 'user';
  timestamp: string;
  userId?: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
}

// Types pour les formulaires
export interface ProductFormData {
  name: string;
  description: string;
  image: string;
  stock: number;
  base_price: number;
  current_price: number;
  category_id: number;
}

export interface UserFormData {
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  password?: string;
}

// Types pour les filtres
export interface ProductFilters {
  search?: string;
  category_id?: number;
  minStock?: number;
  maxStock?: number;
  status?: 'ACTIVE' | 'HIDDEN';
}

export interface UserFilters {
  search?: string;
  role?: 'admin' | 'editor' | 'user';
  active?: boolean;
}

export interface OrderFilters {
  status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}