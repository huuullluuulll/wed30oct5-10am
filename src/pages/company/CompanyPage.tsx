import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { SubscriptionInfo } from '../../components/company/SubscriptionInfo';

interface Company {
  id: string;
  name_ar: string;
  name_en: string;
  registration_number: string;
  company_type: string;
  registered_address: string;
  incorporation_date: string;
  status: string;
  vat_number: string;
  utr_number: string;
  auth_code: string;
  directors: any[];
  shareholders: any[];
}

interface Subscription {
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
}

interface Addon {
  id: string;
  name: string;
  name_en: string;
  price: number;
  status: string;
  end_date: string;
}

export const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchCompanyData();
    }
  }, [user?.id]);

  const fetchCompanyData = async () => {
    try {
      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:service_plans (
            name,
            name_en,
            price,
            billing_period,
            features
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (!subscriptionError && subscriptionData) {
        setSubscription({
          plan: subscriptionData.plan,
          start_date: subscriptionData.start_date,
          end_date: subscriptionData.end_date,
          status: subscriptionData.status
        });
      }

      // Fetch active addons
      const { data: addonsData, error: addonsError } = await supabase
        .from('user_addons')
        .select(`
          id,
          addon:service_addons (
            name,
            name_en,
            price
          ),
          status,
          end_date
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (!addonsError && addonsData) {
        setAddons(addonsData.map(item => ({
          id: item.id,
          name: item.addon.name,
          name_en: item.addon.name_en,
          price: item.addon.price,
          status: item.status,
          end_date: item.end_date
        })));
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/50 text-green-300';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'suspended':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-gray-900/50 text-gray-300';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8 text-center">
        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          لا توجد شركات مسجلة
        </h2>
        <p className="text-gray-400 mb-4">
          لم تقم بتسجيل أي شركة حتى الآن
        </p>
        <button
          onClick={() => navigate('/dashboard/company/register')}
          className="px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent-light transition-colors"
        >
          تسجيل شركة جديدة
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Company Overview */}
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {company.name_ar}
            </h1>
            <p className="text-gray-400">{company.name_en}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(company.status)}`}>
            {company.status === 'active' ? 'نشط' : 
             company.status === 'pending' ? 'قيد المراجعة' : 
             company.status === 'suspended' ? 'معلق' : company.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400">رقم التسجيل</label>
              <p className="text-white">{company.registration_number}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400">نوع الشركة</label>
              <p className="text-white">{getCompanyTypeLabel(company.company_type)}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400">تاريخ التأسيس</label>
              <p className="text-white">
                {format(new Date(company.incorporation_date), 'dd MMMM yyyy', { locale: ar })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400">رقم VAT</label>
              <p className="text-white">{company.vat_number || 'غير متوفر'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400">رقم UTR</label>
              <p className="text-white">{company.utr_number || 'غير متوفر'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400">رمز المصادقة</label>
              <p className="text-white">{company.auth_code || 'غير متوفر'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      <SubscriptionInfo
        subscription={subscription}
        addons={addons}
        loading={loading}
      />

      {/* Registered Address */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">العنوان المسجل</h2>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-accent mt-1" />
          <p className="text-white">{company.registered_address}</p>
        </div>
      </div>

      {/* Company Officials */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">المسؤولون</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Directors */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">المدراء</h3>
            <div className="space-y-4">
              {company.directors?.map((director: any, index: number) => (
                <div key={index} className="bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium text-white">{director.name}</p>
                      <p className="text-sm text-gray-400">
                        تاريخ التعيين: {format(new Date(director.appointed_date), 'dd MMMM yyyy', { locale: ar })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shareholders */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">المساهمون</h3>
            <div className="space-y-4">
              {company.shareholders?.map((shareholder: any, index: number) => (
                <div key={index} className="bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium text-white">{shareholder.name}</p>
                      <p className="text-sm text-gray-400">
                        عدد الأسهم: {shareholder.shares} ({shareholder.share_type})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};