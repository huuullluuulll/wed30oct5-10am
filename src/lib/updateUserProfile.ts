import { supabase } from './supabase';

export async function updateUserProfile(userId: string, data: { country?: string; phone_number?: string }) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}