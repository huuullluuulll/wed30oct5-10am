import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface SignUpMetadata {
  full_name: string;
  phone_number: string;
  country: string;
  role?: string;
}

export const useAuth = () => {
  const { setSession } = useAuthStore();

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data?.session) throw new Error('No session data returned');

      setSession(data.session);
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    try {
      // Validate input
      if (!email || !password || !metadata.full_name || !metadata.phone_number || !metadata.country) {
        throw new Error('جميع الحقول مطلوبة');
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            phone_number: metadata.phone_number,
            country: metadata.country,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // Check if user was created successfully
      if (!data?.user) {
        throw new Error('فشل إنشاء الحساب');
      }

      // Return success even if email confirmation is pending
      return {
        success: true,
        emailConfirmationRequired: true,
        user: data.user
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
      
      throw new Error(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};