import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PauseCircle,
  ChevronDown,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Transaction, TransactionUpdate } from '../../types/transactions';

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle,
  on_hold: PauseCircle,
};

const statusColors = {
  pending: 'bg-yellow-900/50 text-yellow-300',
  in_progress: 'bg-blue-900/50 text-blue-300',
  completed: 'bg-green-900/50 text-green-300',
  cancelled: 'bg-red-900/50 text-red-300',
  on_hold: 'bg-gray-900/50 text-gray-300',
};

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [updates, setUpdates] = useState<TransactionUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionUpdates = async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('transaction_updates')
        .select(`
          *,
          created_by:users(full_name)
        `)
        .eq('transaction_id', transactionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching transaction updates:', error);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    fetchTransactionUpdates(transaction.id);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      matchesDate = 
        (dateRange === 'week' && diffDays <= 7) ||
        (dateRange === 'month' && diffDays <= 30) ||
        (dateRange === 'year' && diffDays <= 365);
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const exportTransactions = () => {
    const csv = [
      ['Reference', 'Type', 'Status', 'Amount', 'Description', 'Date'].join(','),
      ...filteredTransactions.map(t => [
        t.reference_number,
        t.type,
        t.status,
        t.amount,
        `"${t.description}"`,
        format(new Date(t.created_at), 'dd/MM/yyyy')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">سجل المعاملات</h1>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 pl-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
            <option value="on_hold">معلق</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">جميع التواريخ</option>
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="year">آخر سنة</option>
          </select>

          <button
            onClick={exportTransactions}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="glass rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-gray-400">
              لا توجد معاملات تطابق معايير البحث
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const StatusIcon = statusIcons[transaction.status as keyof typeof statusIcons];
                return (
                  <div
                    key={transaction.id}
                    onClick={() => handleTransactionClick(transaction)}
                    className={`glass rounded-xl p-4 cursor-pointer transition-colors ${
                      selectedTransaction?.id === transaction.id ? 'ring-2 ring-accent' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <StatusIcon className={`w-5 h-5 mt-1 ${
                          transaction.status === 'completed' ? 'text-green-300' :
                          transaction.status === 'cancelled' ? 'text-red-300' :
                          transaction.status === 'in_progress' ? 'text-blue-300' :
                          transaction.status === 'on_hold' ? 'text-gray-300' :
                          'text-yellow-300'
                        }`} />
                        <div>
                          <h3 className="font-medium text-white">
                            {transaction.reference_number}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {transaction.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[transaction.status as keyof typeof statusColors]
                            }`}>
                              {transaction.status === 'pending' ? 'قيد الانتظار' :
                               transaction.status === 'in_progress' ? 'قيد التنفيذ' :
                               transaction.status === 'completed' ? 'مكتمل' :
                               transaction.status === 'cancelled' ? 'ملغي' :
                               'معلق'}
                            </span>
                            <span className="text-sm text-gray-400">
                              {format(new Date(transaction.created_at), 'dd MMMM yyyy', { locale: ar })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-accent">
                        £{transaction.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="lg:col-span-1">
          {selectedTransaction ? (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                تفاصيل المعاملة
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    رقم المرجع
                  </label>
                  <p className="mt-1 text-white">
                    {selectedTransaction.reference_number}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    النوع
                  </label>
                  <p className="mt-1 text-white">
                    {selectedTransaction.type === 'company_formation' ? 'تأسيس شركة' :
                     selectedTransaction.type === 'document_request' ? 'طلب مستند' :
                     selectedTransaction.type === 'plan_upgrade' ? 'ترقية الباقة' :
                     'خدمة إضافية'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    الحالة
                  </label>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[selectedTransaction.status as keyof typeof statusColors]
                  }`}>
                    {selectedTransaction.status === 'pending' ? 'قيد الانتظار' :
                     selectedTransaction.status === 'in_progress' ? 'قيد التنفيذ' :
                     selectedTransaction.status === 'completed' ? 'مكتمل' :
                     selectedTransaction.status === 'cancelled' ? 'ملغي' :
                     'معلق'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    التحديثات
                  </label>
                  <div className="mt-2 space-y-3">
                    {updates.map((update) => (
                      <div
                        key={update.id}
                        className="relative pr-8 pb-4 border-r-2 border-gray-700 last:pb-0"
                      >
                        <div className="absolute right-[-9px] top-0 w-4 h-4 rounded-full bg-accent" />
                        <div className="text-sm">
                          <p className="font-medium text-white">
                            {update.note}
                          </p>
                          <p className="text-gray-400">
                            {format(new Date(update.created_at), 'dd MMMM yyyy HH:mm', { locale: ar })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-6 text-center text-gray-400">
              اختر معاملة لعرض تفاصيلها
            </div>
          )}
        </div>
      </div>
    </div>
  );
};