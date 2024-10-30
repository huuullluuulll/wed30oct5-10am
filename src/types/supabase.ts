export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: string;
          reference_date: string;
          status: 'pending' | 'completed';
          user_id: string;
          file_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          reference_date: string;
          status?: 'pending' | 'completed';
          user_id: string;
          file_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          reference_date?: string;
          status?: 'pending' | 'completed';
          user_id?: string;
          file_url?: string;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'starter' | 'professional' | 'enterprise';
          price: number;
          status: 'active' | 'cancelled' | 'expired';
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'starter' | 'professional' | 'enterprise';
          price: number;
          status?: 'active' | 'cancelled' | 'expired';
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'starter' | 'professional' | 'enterprise';
          price?: number;
          status?: 'active' | 'cancelled' | 'expired';
          start_date?: string;
          end_date?: string;
          created_at?: string;
        };
      };
    };
  };
}