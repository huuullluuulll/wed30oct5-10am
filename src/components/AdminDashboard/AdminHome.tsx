import React from 'react';
import { Users, Ticket, FileText, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStats } from '../../hooks/useAdmin';

export const AdminHome = () => {
  const navigate = useNavigate();
  const { stats, loading } = useAdminStats();

  const statItems = [
    { id: 'users', label: 'المستخدمين', icon: Users, value: stats?.total_users || 0, route: '/admin/users' },
    { id: 'tickets', label: 'التذاكر', icon: Ticket, value: stats?.total_tickets || 0, route: '/admin/tickets' },
    { id: 'documents', label: 'المستندات', icon: FileText, value: stats?.total_documents || 0, route: '/admin/documents' },
    { id: 'companies', label: 'الشركات', icon: Building2, value: stats?.total_companies || 0, route: '/admin/companies' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat) => (
          <div
            key={stat.id}
            onClick={() => navigate(stat.route)}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Pending Tickets Alert */}
      {stats?.pending_tickets > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center">
            <Ticket className="w-5 h-5 text-yellow-600 dark:text-yellow-400 ml-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                تذاكر تحتاج إلى المراجعة
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                يوجد {stats.pending_tickets} تذكرة في انتظار الرد
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          النشاطات الأخيرة
        </h2>
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">لا توجد نشاطات حديثة</p>
          )}
        </div>
      </div>
    </div>
  );
};