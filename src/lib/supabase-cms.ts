import { supabase } from './supabase';

// Types
export type CMSProject = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_hint: string;
  live_link: string;
  code_link: string;
  tags: string[];
  language: string;
  order_index: number;
};

export type CMSExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  company_logo: string;
  responsibilities: string[];
  language: string;
  order_index: number;
};

export type CMSEducation = {
  id: string;
  institution: string;
  location: string;
  degree: string;
  period: string;
  institution_logo: string;
  details: string[];
  language: string;
  order_index: number;
};

export type CMSSkill = {
  id: string;
  name: string;
  icon_name: string;
  row_placement: string;
  order_index: number;
};

export type CMSChatbotProfile = {
  id: string;
  profile_text: string;
};

// --- Projects ---
export async function getProjects(language: string = 'en') {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('language', language)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data as CMSProject[];
}

export async function upsertProject(project: Partial<CMSProject>) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .upsert(project)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Experiences ---
export async function getExperiences(language: string = 'en') {
  const { data, error } = await supabase
    .from('portfolio_experiences')
    .select('*')
    .eq('language', language)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data as CMSExperience[];
}

export async function upsertExperience(experience: Partial<CMSExperience>) {
  const { data, error } = await supabase
    .from('portfolio_experiences')
    .upsert(experience)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('portfolio_experiences').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Education ---
export async function getEducation(language: string = 'en') {
  const { data, error } = await supabase
    .from('portfolio_education')
    .select('*')
    .eq('language', language)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data as CMSEducation[];
}

export async function upsertEducation(education: Partial<CMSEducation>) {
  const { data, error } = await supabase
    .from('portfolio_education')
    .upsert(education)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteEducation(id: string) {
  const { error } = await supabase.from('portfolio_education').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Skills ---
export async function getSkills() {
  const { data, error } = await supabase
    .from('portfolio_skills')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data as CMSSkill[];
}

export async function upsertSkill(skill: Partial<CMSSkill>) {
  const { data, error } = await supabase
    .from('portfolio_skills')
    .upsert(skill)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from('portfolio_skills').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Chatbot Profile ---
export async function getChatbotProfile() {
  const { data, error } = await supabase
    .from('chatbot_profile')
    .select('*')
    .limit(1)
    .maybeSingle();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data as CMSChatbotProfile | null;
}

export async function upsertChatbotProfile(profile_text: string) {
  // Try to get existing to update, or create new
  const existing = await getChatbotProfile();
  
  const payload = {
    profile_text,
    updated_at: new Date().toISOString()
  };
  
  if (existing) {
    (payload as any).id = existing.id;
  }
  
  const { data, error } = await supabase
    .from('chatbot_profile')
    .upsert(payload)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
