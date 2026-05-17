'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { getProjects } from '@/lib/supabase-cms';
import { getProjectsByLanguage } from '@/lib/project-data';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id as string;
  const { language } = useLanguage();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    async function loadProject() {
      try {
        setLoading(true);
        // Try CMS first
        const cmsData = await getProjects(language);
        const foundCms = cmsData?.find(p => p.id === id);
        
        if (foundCms) {
          setProject({
            ...foundCms,
            imageUrl: foundCms.image_url,
            imageHint: foundCms.image_hint,
            liveLink: foundCms.live_link,
            codeLink: foundCms.code_link
          });
        } else {
          // Try static
          const staticData = getProjectsByLanguage(language);
          const foundStatic = staticData.find(p => p.id === id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id);
          if (foundStatic) {
            setProject(foundStatic);
          } else {
            setProject(null);
          }
        }
      } catch (err) {
        // Fallback to static
        const staticData = getProjectsByLanguage(language);
        const foundStatic = staticData.find(p => p.id === id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id);
        setProject(foundStatic || null);
      } finally {
        setLoading(false);
      }
    }
    
    loadProject();
  }, [id, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link href="/#projects" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const hasLiveDemo = project.liveLink && project.liveLink !== "#";
  const hasSourceCode = project.codeLink && project.codeLink !== "#" && project.codeLink !== project.liveLink;

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-60"
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src='/imagess/placeholder.jpg'; 
          }}
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 tracking-tight drop-shadow-xl text-white">
              {project.title.includes(' - ') ? project.title.split(' - ')[1] : project.title}
            </h1>
            <p className="text-lg md:text-xl text-purple-300 font-medium tracking-wide drop-shadow-md">
              {project.title.split(' - ')[0]}
            </p>
          </motion.div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-6 md:left-12 z-30">
          <Link href="/#projects" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-white text-sm font-medium">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        
        {/* Left Column: Description & Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-2 space-y-12"
        >
          <div className="bg-[#121212] rounded-[2rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
                <h2 className="text-2xl font-serif font-semibold mb-6 text-purple-400 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-purple-500/50"></span>
                    About the Project
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-zinc-300 leading-relaxed text-lg">
                    {project.description}
                </p>
                </div>
            </div>
          </div>
          
          <div className="rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl bg-zinc-900 group">
             <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Right Column: Tech Stack & Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-[#121212] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
            <h3 className="text-lg font-semibold mb-6 text-white/90">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-500/40 transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {(hasLiveDemo || hasSourceCode) && (
            <div className="bg-[#121212] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
              <h3 className="text-lg font-semibold mb-6 text-white/90">Project Links</h3>
              <div className="flex flex-col gap-4">
                {hasLiveDemo && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    <span className="font-medium text-zinc-300 group-hover:text-white">Live Demo</span>
                    <ExternalLink size={18} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
                  </a>
                )}
                {hasSourceCode && (
                  <a 
                    href={project.codeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    <span className="font-medium text-zinc-300 group-hover:text-white">Source Code</span>
                    <Github size={18} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
                  </a>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Inspired / Wanna Build CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 mt-16 md:mt-24"
      >
        <div className="relative bg-gradient-to-br from-[#0D0D15]/90 via-[#0D0D15]/95 to-[#150D20]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden text-center">
          {/* Neon glow */}
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-headline">
              Inspired by this project?
            </h3>
            <p className="text-sm md:text-base text-zinc-400 mt-3 max-w-lg leading-relaxed">
              If you want to build a similar high-performance application, website, or custom machine learning model, let's make it a reality.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <a
                href="/agent"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                ⚡ Qualify with AI Twin
              </a>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 hover:border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-all hover:scale-[1.02]"
              >
                ✉️ Reach Out Directly
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
