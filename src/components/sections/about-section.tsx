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
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-left text-foreground mb-3 tracking-tight">
                {translate('about.title', language)}
              </h2>
              <div className="h-[2px] w-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6"></div>
            </motion.div>

            <Card className="overflow-hidden bg-card/60 border border-border/60 shadow-sm rounded-2xl relative">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="p-6 md:p-8 relative z-10">
                <CardHeader className="p-0 mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="font-semibold">{translate('about.role', language)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-0">
                  {translate<string[]>('about.paragraphs', language).map((paragraph: string, index: number) => (
                    <p key={index} className="text-sm md:text-base text-foreground/80 leading-relaxed tracking-normal text-left">
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-8 pt-6 border-t border-border/50 flex justify-start">
                    <Button 
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-150 active:scale-95 shadow-md shadow-indigo-500/20 w-full sm:w-auto"
                      asChild
                    >
                      <a href="https://drive.google.com/drive/folders/1TLOvtTZNk3MOc39ARQ9Ndg-wOP_MvPoy?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className="text-sm tracking-wide">
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
          <div className="lg:col-span-7 space-y-12 lg:pl-4 mt-8 lg:mt-0">
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-80px" }}
               transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <h3 className="text-2xl font-bold text-left text-foreground mb-8 flex items-center gap-3 tracking-tight">
                <span className="p-2.5 rounded-xl bg-muted text-foreground border border-border/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                </span>
                {translate('about.professionalExperience', language)}
              </h3>
              <Timeline items={experiences} />
            </motion.div>
            
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-80px" }}
               transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
               className="pt-4"
            >
              <h3 className="text-2xl font-bold text-left text-foreground mb-8 flex items-center gap-3 tracking-tight">
                <span className="p-2.5 rounded-xl bg-muted text-foreground border border-border/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
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
