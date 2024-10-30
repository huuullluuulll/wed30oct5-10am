import React from 'react';
import { Calendar } from 'lucide-react';

interface Holiday {
  date: Date;
  name: string;
  type: 'bank' | 'national' | 'other';
}

const getNext60DaysHolidays = (): Holiday[] => {
  const today = new Date();
  const next60Days = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000));
  
  const allHolidays: Holiday[] = [
    { date: new Date(2024, 0, 1), name: 'رأس السنة الميلادية', type: 'bank' },
    { date: new Date(2024, 2, 29), name: 'الجمعة العظيمة', type: 'bank' },
    { date: new Date(2024, 3, 1), name: 'عيد الفصح', type: 'bank' },
    { date: new Date(2024, 4, 6), name: 'عيد العمال', type: 'bank' },
    { date: new Date(2024, 4, 27), name: 'عطلة الربيع', type: 'bank' },
    { date: new Date(2024, 7, 26), name: 'عطلة الصيف', type: 'bank' },
    { date: new Date(2024, 11, 25), name: 'عيد الميلاد', type: 'bank' },
    { date: new Date(2024, 11, 26), name: 'عيد الملاكمة', type: 'bank' },
    // Add more holidays as needed
  ];

  return allHolidays.filter(holiday => 
    holiday.date >= today && holiday.date <= next60Days
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const UKAgenda: React.FC = () => {
  const upcomingHolidays = getNext60DaysHolidays();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">أجندة المملكة المتحدة</h2>
        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="space-y-4">
        {upcomingHolidays.map((holiday, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{holiday.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {holiday.date.toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              holiday.type === 'bank' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {holiday.type === 'bank' ? 'عطلة بنكية' : 'مناسبة وطنية'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};