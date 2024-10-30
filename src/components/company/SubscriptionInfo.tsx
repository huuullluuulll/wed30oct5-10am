import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Package, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SubscriptionInfoProps {
  subscription: {
    plan: {
      name: string;
      name_en: string;
      price: number;
      billing_period: string;
      features: string[];
    };
    start_date: string;
    end_date: string;
    status: string;
  } | null;
  addons: Array<{
    id: string;
    name: string;
    name_en: string;
    price: number;
    status: string;
    end_date: string;
  }>;
  loading: boolean;
}

export const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  subscription,
  addons,
  loading
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="text-center">
          <Crown className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">لا يوجد اشتراك نشط</h3>
          <p className="text-gray-400 mb-4">قم بترقية حسابك للاستفادة من جميع المميزات</p>
          <button
            onClick={() => navigate('/dashboard/company/plans')}
            className="px-6 py-2 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors"
          >
            عرض الباقات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">{subscription.plan.name}</h3>
            <p className="text-gray-400">{subscription.plan.name_en}</p>
          </div>
          <Crown className="w-8 h-8 text-accent" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">قيمة الاشتراك</span>
            <span className="text-white font-semibold">
              £{subscription.plan.price}/{subscription.plan.billing_period === 'yearly' ? 'سنوياً' : 'شهرياً'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">تاريخ التجديد</span>
            <span className="text-white">
              {format(new Date(subscription.end_date), 'dd MMMM yyyy', { locale: ar })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">الحالة</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              subscription.status === 'active' 
                ? 'bg-green-900/50 text-green-300'
                : 'bg-yellow-900/50 text-yellow-300'
            }`}>
              {subscription.status === 'active' ? 'نشط' : 'قيد التجديد'}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-white font-medium mb-4">المميزات المتاحة</h4>
          <ul className="space-y-2">
            {subscription.plan.features.map((feature, index) => (
              <li key={index} className="text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate('/dashboard/company/plans')}
          className="w-full mt-6 px-4 py-2 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors"
        >
          ترقية الباقة
        </button>
      </div>

      {/* Active Add-ons */}
      {addons.length > 0 && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">الخدمات الإضافية</h3>
            <Package className="w-6 h-6 text-accent" />
          </div>

          <div className="space-y-4">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
              >
                <div>
                  <h4 className="text-white font-medium">{addon.name}</h4>
                  <p className="text-sm text-gray-400">{addon.name_en}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent font-semibold">£{addon.price}/شهرياً</p>
                  <p className="text-sm text-gray-400">
                    حتى {format(new Date(addon.end_date), 'dd MMMM yyyy', { locale: ar })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard/company/plans')}
            className="w-full mt-4 px-4 py-2 border border-accent text-accent hover:bg-accent/10 rounded-lg transition-colors"
          >
            إضافة خدمات جديدة
          </button>
        </div>
      )}
    </div>
  );
};