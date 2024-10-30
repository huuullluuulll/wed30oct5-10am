import React from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStatus } from '../hooks/useCompany';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface CompanyStatusProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const CompanyStatus: React.FC<CompanyStatusProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  const { companyStatus, loading } = useCompanyStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-amber-700 text-white';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'قيد المراجعة';
      case 'suspended':
        return 'معلق';
      default:
        return status;
    }
  };

  const getPlanLabel = (plan?: string) => {
    switch (plan) {
      case 'starter':
        return 'ستارتر';
      case 'professional':
        return 'بروفيشنال';
      case 'enterprise':
        return 'إنتربرايز';
      default:
        return 'ستارتر';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 p-6 rounded-xl shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 p-6 rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">حالة الشركة</h2>
        <Building2 className="w-8 h-8 text-blue-400" />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">حالة التسجيل</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            getStatusColor(companyStatus?.company_status || 'pending')
          }`}>
            {getStatusLabel(companyStatus?.company_status || 'pending')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">الباقة الحالية</span>
          <span className="text-blue-400">
            {getPlanLabel(companyStatus?.current_plan)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">تاريخ التجديد</span>
          <span className="text-gray-400">
            {companyStatus?.renewal_date ? 
              format(new Date(companyStatus.renewal_date), 'dd MMMM yyyy', { locale: ar }) :
              'غير متوفر'}
          </span>
        </div>
      </div>

      {variant === 'default' && (
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/dashboard/company/upgrade')}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ترقية الباقة
          </button>
          
          <button
            onClick={() => navigate('/dashboard/company')}
            className="w-full px-4 py-3 text-blue-400 border border-blue-400/50 rounded-lg hover:bg-blue-400/10 transition-colors"
          >
            تفاصيل الشركة
          </button>
        </div>
      )}
    </div>
  );
};