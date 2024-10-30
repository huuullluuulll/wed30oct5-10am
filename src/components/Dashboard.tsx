import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { UKAgenda } from './Calendar/UKHolidays';

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl glass h-40">
        <div className="relative z-10 p-6">
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-3">
            مرحباً بك في حلول فورميشنز
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            شريكك الاستراتيجي لتأسيس وإدارة شركتك في المملكة المتحدة 🇬🇧
          </p>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Documents Section */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">المستندات</h2>
            <FileText className="w-6 h-6 text-accent" />
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard/documents')}
              className="w-full p-4 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors flex items-center justify-between group"
            >
              <span className="text-white">رمز المصادقة</span>
              <Download className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/dashboard/documents')}
              className="w-full p-4 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors flex items-center justify-between group"
            >
              <span className="text-white">خطاب UTR</span>
              <Download className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/dashboard/documents/request')}
              className="w-full px-6 py-3 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors mt-4"
            >
              طلب مستند جديد
            </button>

            <button
              onClick={() => navigate('/dashboard/documents')}
              className="w-full px-6 py-3 text-accent border-2 border-accent hover:bg-accent/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              عرض جميع المستندات
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">إجراءات سريعة</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/dashboard/documents/request')}
              className="w-full px-6 py-3 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors"
            >
              طلب مستند جديد
            </button>
            <button 
              onClick={() => window.open('https://calendly.com/hululgroup/support', '_blank')}
              className="w-full px-6 py-3 text-accent border-2 border-accent hover:bg-accent/10 rounded-lg transition-colors"
            >
              جدولة استشارة
            </button>
            <button 
              onClick={() => navigate('/dashboard/company')}
              className="w-full px-6 py-3 text-gray-300 border-2 border-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
            >
              تحديث معلومات الشركة
            </button>
          </div>
        </div>
      </div>

      {/* UK Calendar Section */}
      <div className="glass rounded-xl p-6">
        <UKAgenda />
      </div>
    </div>
  );
};