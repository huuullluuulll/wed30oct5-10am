import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface Document {
  id: string;
  name: string;
  type: string;
  reference_date: string;
  status: 'pending' | 'completed';
  file_url: string;
}

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [user?.id]);

  const fetchDocuments = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">مستنداتي</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في المستندات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pr-10 pl-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
            />
          </div>
          
          <button
            onClick={() => navigate('/dashboard/documents/request')}
            className="px-4 py-2 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            مستند جديد
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-gray-400">لا توجد مستندات متاحة</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">اسم المستند</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">تاريخ المرجع</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">تحميل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 text-white">{doc.name}</td>
                  <td className="px-6 py-4 text-gray-400">{doc.type}</td>
                  <td className="px-6 py-4 text-gray-400">{doc.reference_date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      doc.status === 'completed' 
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {doc.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDownload(doc.file_url)}
                      className="text-accent hover:text-accent-light transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};