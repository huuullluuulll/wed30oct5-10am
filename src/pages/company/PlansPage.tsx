import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Plus, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface Plan {
  id: string;
  name: string;
  name_en: string;
  price: number;
  billing_period: string;
  features: string[];
}

interface Addon {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: number;
  category: string;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  end_date: string;
}

const planOrder = {
  'starter': 1,
  'professional': 2,
  'enterprise': 3
};

export const PlansPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      // Fetch current subscription first
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      setCurrentSubscription(subscriptionData);

      // Fetch all plans
      const { data: plansData } = await supabase
        .from('service_plans')
        .select('*')
        .eq('is_active', true);

      if (plansData) {
        let filteredPlans = plansData;
        
        // If user has an active subscription, filter out lower tier plans
        if (subscriptionData) {
          const currentPlan = plansData.find(p => p.id === subscriptionData.plan_id);
          if (currentPlan) {
            const currentTier = planOrder[currentPlan.name_en.toLowerCase() as keyof typeof planOrder];
            filteredPlans = plansData.filter(plan => {
              const planTier = planOrder[plan.name_en.toLowerCase() as keyof typeof planOrder];
              return planTier >= currentTier;
            });
          }
        }

        setPlans(filteredPlans);
      }

      const { data: addonsData } = await supabase
        .from('service_addons')
        .select('*')
        .eq('is_active', true);

      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const { data: plan } = await supabase
        .from('service_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!plan) throw new Error('Plan not found');

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          type: 'plan_upgrade',
          amount: plan.price,
          status: 'pending',
          description: `Upgrade to ${plan.name} plan`,
          reference_number: `PLAN-${Date.now()}`,
          metadata: { plan_id: plan.id }
        }]);

      if (transactionError) throw transactionError;

      // Navigate to transactions page
      navigate('/dashboard/transactions');
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('حدث خطأ أثناء ترقية الباقة');
    }
  };

  const handleAddonPurchase = async (addonId: string) => {
    try {
      const { data: addon } = await supabase
        .from('service_addons')
        .select('*')
        .eq('id', addonId)
        .single();

      if (!addon) throw new Error('Addon not found');

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          type: 'service_addon',
          amount: addon.price,
          status: 'pending',
          description: `Purchase of ${addon.name} addon`,
          reference_number: `ADDON-${Date.now()}`,
          metadata: { addon_id: addon.id }
        }]);

      if (transactionError) throw transactionError;

      // Navigate to transactions page
      navigate('/dashboard/transactions');
    } catch (error) {
      console.error('Error purchasing addon:', error);
      alert('حدث خطأ أثناء شراء الخدمة الإضافية');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">الباقات والخدمات</h1>
          <p className="text-gray-400">اختر الباقة المناسبة لاحتياجات شركتك</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/company')}
          className="flex items-center text-gray-400 hover:text-accent"
        >
          <ArrowRight className="ml-2 h-5 w-5" />
          العودة
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass rounded-xl overflow-hidden transition-transform hover:scale-105 ${
              currentSubscription?.plan_id === plan.id ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-gray-400">{plan.name_en}</p>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-accent">£{plan.price}</span>
                <span className="mr-2 text-gray-400">/{plan.billing_period === 'yearly' ? 'سنوياً' : 'شهرياً'}</span>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-accent ml-2 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentSubscription?.plan_id === plan.id}
                className={`mt-8 w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentSubscription?.plan_id === plan.id
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-accent text-black hover:bg-accent-light'
                }`}
              >
                {currentSubscription?.plan_id === plan.id ? 'باقتك الحالية' : 'ترقية الآن'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6">الخدمات الإضافية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addons.map((addon) => (
            <div key={addon.id} className="glass rounded-xl p-6">
              <Package className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{addon.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{addon.description}</p>
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-accent">£{addon.price}</span>
                <span className="mr-2 text-gray-400">/شهرياً</span>
              </div>
              <button
                onClick={() => handleAddonPurchase(addon.id)}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة الخدمة
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};