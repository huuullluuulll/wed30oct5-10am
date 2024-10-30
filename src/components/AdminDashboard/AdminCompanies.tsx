import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Building2, Edit, FileText } from 'lucide-react';
import { CompanyEditModal } from './CompanyEditModal';
import { DocumentUploadModal } from './DocumentUploadModal';

interface Company {
  id: string;
  name_ar: string;
  name_en: string;
  registration_number: string;
  company_type: string;
  status: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}

export const AdminCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          user:user_id (
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCompanyTypeLabel = (type: string) => {
    const types = {
      private_limited: 'شركة محدودة خاصة',
      public_limited: 'شركة محدودة عامة',
      sole_trader: 'تاجر فردي',
      partnership: 'شراكة',
      llp: 'شراكة محدودة المسؤولية'
    };
    return types[type as keyof typeof types] || type;
  };

  const filteredCompanies = companies.filter(company =>
    company.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الشركات</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في الشركات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    اسم الشركة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    رقم التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    المالك
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {company.name_ar}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {company.name_en}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {company.registration_number}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {getCompanyTypeLabel(company.company_type)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-gray-900 dark:text-white">
                          {company.user.full_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {company.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusBadgeClass(company.status)
                      }`}>
                        {company.status === 'active' ? 'نشط' :
                         company.status === 'pending' ? 'قيد المراجعة' :
                         company.status === 'suspended' ? 'معلق' : company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsUploadModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCompany && (
        <>
          <CompanyEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
            onUpdate={fetchCompanies}
          />
          <DocumentUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => {
              setIsUploadModalOpen(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
          />
        </>
      )}
    </div>
  );
};