export interface Document {
  id: string;
  name: string;
  type: string;
  reference_date: string;
  status: 'pending' | 'completed';
  user_id: string;
  file_url: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'starter' | 'professional' | 'enterprise';
  price: number;
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  company_name?: string;
  created_at: string;
}