import { supabase } from './supabase';

export async function setUserAsAuthor(email: string) {
  try {
    const { error } = await supabase
      .from('users')
      .upsert({ email, isAuthor: true, updatedAt: new Date().toISOString() });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error setting user as author:", error);
    return false;
  }
}

export async function removeUserAsAuthor(email: string) {
  try {
    const { error } = await supabase
      .from('users')
      .upsert({ email, isAuthor: false, updatedAt: new Date().toISOString() });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing user as author:", error);
    return false;
  }
}

export async function checkIfUserIsAuthor(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('isAuthor')
      .eq('email', email)
      .single();
      
    if (error) {
      // PGRST116 indicates no rows returned (user doesn't exist in users table)
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }
    
    return data?.isAuthor === true;
  } catch (error) {
    console.error("Error checking author status:", error);
    return false;
  }
}
