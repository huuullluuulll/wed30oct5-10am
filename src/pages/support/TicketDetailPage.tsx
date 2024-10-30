import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { TicketStatusBadge } from '../../components/support/TicketStatusBadge';
import { TicketPriorityBadge } from '../../components/support/TicketPriorityBadge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Message {
  id: string;
  message: string;
  created_at: string;
  is_admin: boolean;
  sender_id: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
}

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user?.id) return;
    
    fetchTicketDetails();
    const subscription = supabase
      .channel(`ticket_messages_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages',
          filter: `ticket_id=eq.${id}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, user?.id]);

  const fetchTicketDetails = async () => {
    if (!id) return;
    
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (ticketError) throw ticketError;
      setTicket(ticketData);

      await fetchMessages();
    } catch (error: any) {
      console.error('Error fetching ticket details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!id) return;

    try {
      const { data, error: messagesError } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !id || sending) return;

    setSending(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('support_messages')
        .insert([
          {
            ticket_id: id,
            sender_id: user.id,
            message: newMessage.trim(),
            is_admin: false
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      
      if (data) {
        setMessages([...messages, data]);
        setNewMessage('');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-red-300">التذكرة غير موجودة</p>
        <button
          onClick={() => navigate('/dashboard/support')}
          className="mt-4 text-accent hover:text-accent-light"
        >
          العودة إلى قائمة التذاكر
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">تفاصيل التذكرة</h1>
        <button
          onClick={() => navigate('/dashboard/support')}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ArrowRight className="ml-2 h-5 w-5" />
          العودة
        </button>
      </div>

      {/* Ticket Details */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {ticket.title}
            </h2>
            <p className="text-gray-400">{ticket.description}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(new Date(ticket.created_at), 'dd MMMM yyyy HH:mm', { locale: ar })}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="glass rounded-xl">
        <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender_id === user?.id
                    ? 'bg-accent/20 text-accent'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {format(new Date(message.created_at), 'dd MMMM yyyy HH:mm', { locale: ar })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
            {error && (
              <div className="text-sm text-red-300">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-2 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};