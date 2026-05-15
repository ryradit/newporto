import { supabase } from './supabase';
import { RYAN_PROFILE_DATA } from './profile-data';
import { getProjectsByLanguage } from './project-data';
import { translate } from '@/translations';

export async function seedCMSDatabase() {
  try {
    // 1. Seed Chatbot Profile
    await supabase.from('chatbot_profile').upsert({
      profile_text: RYAN_PROFILE_DATA,
      updated_at: new Date().toISOString()
    });

    // 2. Seed Projects (for en, id, zh)
    const languages: ('en' | 'id' | 'zh')[] = ['en', 'id', 'zh'];
    
    for (const lang of languages) {
      const projects = getProjectsByLanguage(lang);
      
      for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        await supabase.from('portfolio_projects').insert({
          title: p.title,
          description: p.description,
          image_url: p.imageUrl,
          image_hint: p.imageHint,
          live_link: p.liveLink,
          code_link: p.codeLink,
          tags: p.tags,
          language: lang,
          order_index: i
        });
      }

      // 3. Seed Experiences
      const experiences = translate<any[]>('about.careerHistory', lang);
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        await supabase.from('portfolio_experiences').insert({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          period: exp.period,
          company_logo: exp.companyLogo,
          responsibilities: exp.responsibilities,
          language: lang,
          order_index: i
        });
      }

      // 4. Seed Education
      const education = translate<any[]>('about.educationHistory', lang);
      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        await supabase.from('portfolio_education').insert({
          institution: edu.institution,
          location: edu.location,
          degree: edu.degree,
          period: edu.period,
          institution_logo: edu.institutionLogo,
          details: edu.details,
          language: lang,
          order_index: i
        });
      }
    }

    // 5. Seed Skills
    const topSkills = [
      { name: "Python", icon: "FileCode" },
      { name: "JavaScript", icon: "FileCode" },
      { name: "TypeScript", icon: "FileCode" },
      { name: "React.js", icon: "Code2" },
      { name: "Next.js", icon: "FastForward" },
      { name: "Node.js", icon: "Server" },
      { name: "TailwindCSS", icon: "Wind" }
    ];

    const bottomSkills = [
      { name: "TensorFlow", icon: "BrainCircuit" },
      { name: "PyTorch", icon: "Layers" },
      { name: "OpenCV", icon: "Camera" },
      { name: "LLMs", icon: "MessageCircle" },
      { name: "Git", icon: "GitFork" },
      { name: "Firebase", icon: "Flame" }
    ];

    for (let i = 0; i < topSkills.length; i++) {
      await supabase.from('portfolio_skills').insert({
        name: topSkills[i].name,
        icon_name: topSkills[i].icon,
        row_placement: 'top',
        order_index: i
      });
    }

    for (let i = 0; i < bottomSkills.length; i++) {
      await supabase.from('portfolio_skills').insert({
        name: bottomSkills[i].name,
        icon_name: bottomSkills[i].icon,
        row_placement: 'bottom',
        order_index: i
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Seeding failed:", error);
    return { success: false, error };
  }
}
