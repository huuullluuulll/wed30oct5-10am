import React from 'react';

const countries = [
  // العراق أولاً
  { code: 'IQ', name: 'العراق' },
  
  // الدول العربية
  { code: 'SA', name: 'المملكة العربية السعودية' },
  { code: 'AE', name: 'الإمارات العربية المتحدة' },
  { code: 'KW', name: 'الكويت' },
  { code: 'BH', name: 'البحرين' },
  { code: 'QA', name: 'قطر' },
  { code: 'OM', name: 'عمان' },
  { code: 'JO', name: 'الأردن' },
  { code: 'LB', name: 'لبنان' },
  { code: 'EG', name: 'مصر' },
  { code: 'YE', name: 'اليمن' },
  { code: 'SY', name: 'سوريا' },
  { code: 'PS', name: 'فلسطين' },
  { code: 'SD', name: 'السودان' },
  { code: 'LY', name: 'ليبيا' },
  { code: 'TN', name: 'تونس' },
  { code: 'DZ', name: 'الجزائر' },
  { code: 'MA', name: 'المغرب' },
  
  // باقي دول العالم
  { code: 'GB', name: 'المملكة المتحدة' },
  { code: 'US', name: 'الولايات المتحدة' },
  { code: 'CA', name: 'كندا' },
  // ... يمكن إضافة المزيد من الدول
];

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
    >
      <option value="">اختر الدولة</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};