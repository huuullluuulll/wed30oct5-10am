import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'ستارتر',
    nameEn: 'Starter',
    price: 220,
    period: 'سنوياً',
    features: [
      'تأسيس شركة في المملكة المتحدة',
      'عنوان مسجل لمدة عام',
      'خدمة استلام البريد',
      'دعم عبر البريد الإلكتروني',
      'المستندات الأساسية',
    ],
    current: true,
  },
  {
    name: 'بروفيشنال',
    nameEn: 'Professional',
    price: 420,
    period: 'سنوياً',
    features: [
      'جميع مميزات باقة ستارتر',
      'خدمة محاسبة سنوية',
      'رقم هاتف بريطاني',
      'دعم عبر الواتساب',
      'خدمة مدير حساب مخصص',
      'استشارات قانونية شهرية',
    ],
    popular: true,
  },
  {
    name: 'إنتربرايز',
    nameEn: 'Enterprise',
    price: 820,
    period: 'سنوياً',
    features: [
      'جميع مميزات باقة بروفيشنال',
      'خدمة محاسبة شهرية',
      'فتح حساب بنكي تجاري',
      'خدمات التأشيرات',
      'استشارات قانونية أسبوعية',
      'دعم على مدار الساعة',
    ],
  },
];

export const UpgradePlan = () => {
  const navigate = useNavigate();

  const handleUpgrade = (planName: string) => {
    // Here you would implement the upgrade logic
    alert(`سيتم ترقية حسابك إلى باقة ${planName}`);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ترقية الباقة</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">اختر الباقة المناسبة لاحتياجات شركتك</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/company')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowRight className="ml-2 h-5 w-5" />
          العودة
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
              plan.popular ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-4 left-4">
                <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  الأكثر شعبية
                </span>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{plan.nameEn}</p>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">£{plan.price}</span>
                <span className="mr-2 text-gray-500 dark:text-gray-400">/{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 ml-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.name)}
                className={`mt-8 w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'باقتك الحالية' : 'ترقية الآن'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">مقارنة المميزات</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">الميزة</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">تأسيس شركة</td>
                <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">خدمة محاسبة</td>
                <td className="px-6 py-4 text-center">-</td>
                <td className="px-6 py-4 text-center">سنوية</td>
                <td className="px-6 py-4 text-center">شهرية</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">دعم العملاء</td>
                <td className="px-6 py-4 text-center">بريد إلكتروني</td>
                <td className="px-6 py-4 text-center">واتساب</td>
                <td className="px-6 py-4 text-center">24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};