'use client';

import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { EducationTimeline } from "@/components/ui/education-timeline";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState, useEffect } from "react";
import { getExperiences, getEducation } from "@/lib/supabase-cms";
import { motion } from "framer-motion";

export function AboutSection() {
  const { language } = useLanguage();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const expData = await getExperiences(language);
        if (expData && expData.length > 0) {
          setExperiences(expData.map(e => ({ ...e, companyLogo: e.company_logo })));
        } else {
          setExperiences(translate<any[]>('about.careerHistory', language) || []);
        }

        const eduData = await getEducation(language);
        if (eduData && eduData.length > 0) {
          setEducation(eduData.map(e => ({ ...e, institutionLogo: e.institution_logo })));
        } else {
          setEducation(translate<any[]>('about.educationHistory', language) || []);
        }
      } catch (err) {
        setExperiences(translate<any[]>('about.careerHistory', language) || []);
        setEducation(translate<any[]>('about.educationHistory', language) || []);
      }
    }
    load();
  }, [language]);
  
  return (
    <AnimatedSection id="about" className="py-12 md:py-16 bg-background relative overflow-hidden">
      <MobileHeader />
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column (Sticky Bio) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-8 relative">
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-violet-600/10 blur-2xl rounded-[3rem] -z-10"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-left text-zinc-900 dark:text-white mb-4 tracking-tight drop-shadow-md">
                {translate('about.title', language)}
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mb-8"></div>
            </motion.div>

            <Card className="overflow-hidden bg-white dark:bg-[#121212] border border-border dark:border-white/5 shadow-2xl rounded-[2rem] relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 md:p-10 relative z-10">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="font-headline text-2xl text-purple-600 dark:text-purple-400 text-left flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-purple-500/50"></span>
                    {translate('about.role', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                  {translate<string[]>('about.paragraphs', language).map((paragraph: string, index: number) => (
                    <p key={index} className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-wide text-left">
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-10 pt-8 border-t border-white/10 flex justify-start">
                    <Button 
                      className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 transform w-full sm:w-auto"
                      asChild
                    >
                      <a href="https://drive.google.com/drive/folders/1TLOvtTZNk3MOc39ARQ9Ndg-wOP_MvPoy?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 relative overflow-hidden">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="transform group-hover:-translate-y-1 group-hover:text-blue-200 transition-all duration-300"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className="text-base tracking-wide">
                          {translate('about.downloadCV', language)}
                        </span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Right Column (Timelines) */}
          <div className="lg:col-span-7 space-y-16 lg:pl-4 mt-12 lg:mt-0">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
            >
              <h3 className="font-headline text-3xl font-bold text-left text-zinc-900 dark:text-white/90 mb-10 flex items-center gap-4">
                <span className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                </span>
                {translate('about.professionalExperience', language)}
              </h3>
              <Timeline items={experiences} />
            </motion.div>
            
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="pt-8"
            >
              <h3 className="font-headline text-3xl font-bold text-left text-zinc-900 dark:text-white/90 mb-10 flex items-center gap-4">
                <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-500 dark:text-violet-400 border border-violet-500/20 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </span>
                {translate('about.education', language)}
              </h3>
              <EducationTimeline items={education} />
            </motion.div>
          </div>
          
        </div>
      </div>
    </AnimatedSection>
  );
}
