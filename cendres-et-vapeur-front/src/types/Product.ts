export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  stock: number;
  base_price: number;
  current_price: number;
  popularity_score: number;
  category_id: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  avatar_url?: string;
  biography?: string;
}

export interface Order {
  id: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  invoice_file?: string;
  user_id: number;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unit_price_frozen: number;
  order_id: number;
  product_id: number;
}

export interface Vote {
  id: number;
  product_id: number;
  user_id: number;
}

export interface ShiftNote {
  id: number;
  date: string;
  shift_type: 'morning' | 'evening';
  content: string;
  order_id: number;
}

export interface ColonyEvent {
  id: number;
  title: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
}
