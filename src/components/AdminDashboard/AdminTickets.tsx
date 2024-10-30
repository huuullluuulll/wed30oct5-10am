import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter } from 'lucide-react';
import { TicketStatusBadge } from '../support/TicketStatusBadge';
import { TicketPriorityBadge } from '../support/TicketPriorityBadge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  user: {
    email: string;
    raw_user_meta_data: {
      full_name: string;
    };
  };
}

export const AdminTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
    
    const subscription = supabase
      .channel('admin_tickets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets'
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user:user_id (
            email,
            raw_user_meta_data->full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      console.log('Fetched tickets:', data);
      setTickets(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;
      await fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !reply.trim() || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            message: reply.trim(),
            is_admin: true,
            sender_id: (await supabase.auth.getUser()).data.user?.id
          }
        ]);

      if (error) throw error;
      setReply('');
      
      // Update ticket status to in_progress if it's pending
      if (selectedTicket.status === 'pending') {
        await handleStatusChange(selectedTicket.id, 'in_progress');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.raw_user_meta_data.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة التذاكر</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">قيد المعالجة</option>
            <option value="resolved">تم الحل</option>
            <option value="closed">مغلقة</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {ticket.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{ticket.user.raw_user_meta_data.full_name}</span>
                    <span>•</span>
                    <span>{ticket.user.email}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(ticket.created_at), 'dd MMMM yyyy HH:mm', { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الرد على التذكرة
            </h3>
            <div className="space-y-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="اكتب ردك هنا..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sending || !reply.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {sending ? 'جاري الإرسال...' : 'إرسال'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;