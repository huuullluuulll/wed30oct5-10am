export interface Message {
  id: string;
  ticket_id: string;
  sender_id?: string;
  message: string;
  created_at: string;
  is_admin: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  messages?: Message[];
}