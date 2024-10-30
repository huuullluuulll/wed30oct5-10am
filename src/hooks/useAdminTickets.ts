import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  user_id: string;
  user_email: string;
  user_full_name: string;
  message_count: number;
}

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export const useAdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const { data, error: ticketsError } = await supabase
        .from('admin_tickets_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const { data, error: messagesError } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      throw err;
    }
  };

  const sendAdminReply = async (ticketId: string, message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Send message
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: user.id,
          message,
          is_admin: true
        });

      if (messageError) throw messageError;

      // Update ticket status if pending
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket && ticket.status === 'pending') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'in_progress' })
          .eq('id', ticketId);

        if (updateError) throw updateError;
      }

      // Create notification for user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: ticket?.user_id,
          title: 'رد جديد على تذكرتك',
          message: 'تم الرد على تذكرتك من قبل فريق الدعم',
          type: 'info'
        });

      if (notificationError) throw notificationError;

      await fetchTickets();
      return true;
    } catch (err: any) {
      console.error('Error sending reply:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();

    const subscription = supabase
      .channel('admin_tickets')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_tickets' },
        fetchTickets
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    fetchTicketMessages,
    sendAdminReply
  };
};

export default useAdminTickets;