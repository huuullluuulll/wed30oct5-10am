import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const categories = [
  { id: 'technical', label: 'مشكلة تقنية' },
  { id: 'billing', label: 'الفواتير والمدفوعات' },
  { id: 'documents', label: 'المستندات' },
  { id: 'company', label: 'معلومات الشركة' },
  { id: 'other', label: 'أخرى' }
];

export const NewTicketPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!user?.id) {
      setError('يرجى تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);

    try {
      const { data, error: submitError } = await supabase
        .from('support_tickets')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (submitError) throw submitError;

      if (data) {
        navigate('/dashboard/support');
      }
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      setError('حدث خطأ أثناء إنشاء التذكرة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تذكرة دعم جديدة</h1>
        <button
          onClick={() => navigate('/dashboard/support')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowRight className="ml-2 h-5 w-5" />
          العودة
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان التذكرة *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="أدخل عنواناً موجزاً للمشكلة"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تصنيف المشكلة *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">اختر تصنيفاً</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الأولوية
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'low', label: 'منخفضة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
                { id: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
                { id: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
                { id: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    priority === p.id
                      ? p.color
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تفاصيل المشكلة *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="اشرح المشكلة بالتفصيل..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال التذكرة
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};