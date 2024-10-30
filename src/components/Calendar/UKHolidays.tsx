import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Holiday {
  date: Date;
  nameAr: string;
  nameEn: string;
  type: 'bank' | 'national' | 'business' | 'international';
}

const allHolidays: Holiday[] = [
  // Bank Holidays
  { date: new Date(2024, 0, 1), nameAr: 'رأس السنة الميلادية', nameEn: 'New Year\'s Day', type: 'bank' },
  { date: new Date(2024, 2, 29), nameAr: 'الجمعة العظيمة', nameEn: 'Good Friday', type: 'bank' },
  { date: new Date(2024, 3, 1), nameAr: 'عيد الفصح', nameEn: 'Easter Monday', type: 'bank' },
  { date: new Date(2024, 4, 6), nameAr: 'عطلة مايو المصرفية', nameEn: 'Early May Bank Holiday', type: 'bank' },
  { date: new Date(2024, 4, 27), nameAr: 'عطلة الربيع', nameEn: 'Spring Bank Holiday', type: 'bank' },
  { date: new Date(2024, 7, 26), nameAr: 'عطلة الصيف', nameEn: 'Summer Bank Holiday', type: 'bank' },
  { date: new Date(2024, 11, 25), nameAr: 'عيد الميلاد', nameEn: 'Christmas Day', type: 'bank' },
  { date: new Date(2024, 11, 26), nameAr: 'عيد الملاكمة', nameEn: 'Boxing Day', type: 'bank' },

  // Business Events
  { date: new Date(2024, 0, 31), nameAr: 'موعد التقييم الذاتي للضرائب', nameEn: 'Self Assessment Deadline', type: 'business' },
  { date: new Date(2024, 6, 31), nameAr: 'موعد تقديم الحسابات السنوية', nameEn: 'Annual Accounts Deadline', type: 'business' },
  { date: new Date(2024, 9, 1), nameAr: 'تحديث سجل الشركات', nameEn: 'Companies House Update', type: 'business' },
  { date: new Date(2024, 3, 15), nameAr: 'موعد تقديم VAT', nameEn: 'VAT Return Deadline', type: 'business' },
  
  // National Events
  { date: new Date(2024, 3, 21), nameAr: 'يوم الملكة', nameEn: 'Queen\'s Birthday', type: 'national' },
  { date: new Date(2024, 5, 15), nameAr: 'يوم العلم البريطاني', nameEn: 'British Flag Day', type: 'national' },
  { date: new Date(2024, 10, 11), nameAr: 'يوم الذكرى', nameEn: 'Remembrance Day', type: 'national' },
  
  // International Business Events
  { date: new Date(2024, 2, 8), nameAr: 'يوم المرأة العالمي', nameEn: 'International Women\'s Day', type: 'international' },
  { date: new Date(2024, 4, 15), nameAr: 'يوم الشركات الصغيرة', nameEn: 'Small Business Day', type: 'business' },
  { date: new Date(2024, 9, 1), nameAr: 'يوم التجارة العالمي', nameEn: 'World Trade Day', type: 'international' },
  { date: new Date(2024, 10, 21), nameAr: 'يوم ريادة الأعمال', nameEn: 'Entrepreneurship Day', type: 'business' }
];

export const UKAgenda: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getTypeColor = (type: Holiday['type']) => {
    const colors = {
      bank: 'bg-purple-900/50 text-purple-300',
      national: 'bg-red-900/50 text-red-300',
      business: 'bg-blue-900/50 text-blue-300',
      international: 'bg-orange-900/50 text-orange-300'
    };
    return colors[type];
  };

  const getTypeLabel = (type: Holiday['type']) => {
    const labels = {
      bank: 'عطلة بنكية',
      national: 'مناسبة وطنية',
      business: 'أعمال',
      international: 'عالمية'
    };
    return labels[type];
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const today = new Date();
  const next90Days = addDays(today, 90);

  const filteredHolidays = allHolidays
    .filter(holiday => {
      const matchesFilter = filter === 'all' || holiday.type === filter;
      const matchesSearch = 
        holiday.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
      const isInRange = holiday.date >= today && holiday.date <= next90Days;
      return matchesFilter && matchesSearch && isInRange;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-xl font-semibold text-white">أجندة المملكة المتحدة</h2>
            <p className="text-sm text-gray-400">الـ 90 يوم القادمة</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 pl-4 pr-8 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
            />
            <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-accent text-white"
          >
            <option value="all">جميع المناسبات</option>
            <option value="bank">عطل بنكية</option>
            <option value="national">مناسبات وطنية</option>
            <option value="business">مواعيد الأعمال</option>
            <option value="international">مناسبات عالمية</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHolidays.map((holiday, index) => (
          <div
            key={index}
            className="bg-gray-900/50 hover:bg-gray-900 rounded-lg p-4 transition-colors"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-medium text-white">{holiday.nameAr}</h3>
                <p className="text-sm text-gray-400">{holiday.nameEn}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                getDaysUntil(holiday.date) <= 7 ? 'bg-red-900/50 text-red-300' : 'bg-gray-800 text-gray-300'
              }`}>
                {getDaysUntil(holiday.date)} يوم
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-400">
                {format(holiday.date, 'dd MMMM yyyy', { locale: ar })}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(holiday.type)}`}>
                {getTypeLabel(holiday.type)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredHolidays.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          لا توجد مناسبات في الفترة المحددة
        </div>
      )}
    </div>
  );
};