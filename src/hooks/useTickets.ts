import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  messages_count?: number;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const fetchTickets = async () => {
      if (!user?.id) return;

      try {
        // First, get tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ticketsError) throw ticketsError;

        // Then, get message counts for each ticket
        const ticketsWithCounts = await Promise.all(
          (ticketsData || []).map(async (ticket) => {
            const { count } = await supabase
              .from('support_messages')
              .select('*', { count: 'exact', head: true })
              .eq('ticket_id', ticket.id);

            return {
              ...ticket,
              messages_count: count || 0
            };
          })
        );

        if (mounted) {
          setTickets(ticketsWithCounts);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching tickets:', err);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTickets();

    // Set up real-time subscription
    const subscription = supabase
      .channel('tickets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'messages_count'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          ...ticketData,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { tickets, loading, error, createTicket };
};

export const useTicketMessages = (ticketId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      if (!ticketId) return;

      try {
        const { data, error: messagesError } = await supabase
          .from('support_messages')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        if (mounted) {
          setMessages(data || []);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages_${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages',
          filter: `ticket_id=eq.${ticketId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [ticketId]);

  const addMessage = async (message: string) => {
    if (!user?.id || !ticketId) throw new Error('Missing required data');

    const { data, error } = await supabase
      .from('support_messages')
      .insert([
        {
          ticket_id: ticketId,
          user_id: user.id,
          message,
          is_admin: false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { messages, loading, error, addMessage };
};