import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAdminStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersCount, ticketsCount, documentsCount] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }),
          supabase.from('documents').select('*', { count: 'exact', head: true })
        ]);

        const pendingTickets = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats({
          total_users: usersCount.count || 0,
          total_tickets: ticketsCount.count || 0,
          total_documents: documentsCount.count || 0,
          pending_tickets: pendingTickets.count || 0
        });
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useAdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          documents:documents(count),
          tickets:support_tickets(count)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (userId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const uploadDocument = async (userId: string, file: File, metadata: any) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('documents')
        .insert([{
          user_id: userId,
          name: metadata.name || file.name,
          type: metadata.type || fileExt,
          file_url: fileName,
          status: 'completed'
        }]);

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { users, loading, error, updateUser, uploadDocument, fetchUsers };
};

export const useAdminTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const { data, error: ticketsError } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user:users!support_tickets_user_id_fkey(
            id,
            email,
            full_name
          ),
          messages:support_messages(count)
        `)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(data || []);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

  const updateTicket = async (ticketId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;
      await fetchTickets();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const addAdminReply = async (ticketId: string, message: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([{
          ticket_id: ticketId,
          message,
          is_admin: true
        }]);

      if (error) throw error;
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { tickets, loading, error, updateTicket, addAdminReply, fetchTickets };
};

export const useAdminDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const { data, error: docsError } = await supabase
        .from('documents')
        .select(`
          *,
          user:users!documents_user_id_fkey(
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(data || []);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const updateDocument = async (documentId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId);

      if (error) throw error;
      await fetchDocuments();
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { documents, loading, error, updateDocument, fetchDocuments };
};