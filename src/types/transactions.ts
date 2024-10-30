export interface Transaction {
  id: string;
  user_id: string;
  type: 'company_formation' | 'document_request' | 'plan_upgrade' | 'service_addon';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  amount: number;
  description: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
  completion_date?: string;
  metadata: Record<string, any>;
}

export interface TransactionUpdate {
  id: string;
  transaction_id: string;
  status: string;
  note: string;
  created_at: string;
  created_by: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  category: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  message_id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}