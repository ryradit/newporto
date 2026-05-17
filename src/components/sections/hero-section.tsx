"use client";

import { useState, useEffect } from 'react';
import { AnimatedSection } from "@/components/animated-section";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { 
  SiPython, 
  SiTypescript, 
  SiReact, 
  SiNextdotjs,
  SiHtml5,
  SiCss,
  SiBootstrap,
  SiTailwindcss,
  SiJavascript,
  SiOpenjdk,
  SiVite,
  SiFramer,
  SiNodedotjs,
  SiPhp,
  SiKotlin,
  SiPostgresql,
  SiMysql,
  SiSupabase,
  SiFirebase,
  SiNpm,
  SiGithub,
  SiScikitlearn,
  SiPytorch,
  SiHuggingface,
  SiNumpy
} from "react-icons/si";
import { BarChart, User, FolderKanban, MessageSquare, Mail, Bot, Code2 } from "lucide-react";
import { BrainCircuit, ScanText, Camera, Cpu } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import Link from "next/link";
import { GradientText } from "@/components/ui/gradient-text";
import { motion } from "framer-motion";

const TYPING_SPEED = 120;
const DELETING_SPEED = 70;
const PAUSE_DURATION = 2000;
const INTER_TAGLINE_PAUSE = 500;

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

export function HeroSection() {
  const { language } = useLanguage();
  const TAGLINES = [
    translate('hero.taglines.softwareEngineer', language),
    translate('hero.taglines.aiEngineer', language),
    translate('hero.taglines.mlEngineer', language),
    translate('hero.taglines.fullstackDeveloper', language)
  ];
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullTagline = TAGLINES[taglineIndex] || "";
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullTagline.substring(0, displayedText.length - 1));
        }, DELETING_SPEED);
      } else {
        setIsDeleting(false);
        setTaglineIndex((prevIndex) => (prevIndex + 1) % TAGLINES.length);
        timer = setTimeout(() => {
        }, INTER_TAGLINE_PAUSE);
      }
    } else { // Typing
      if (displayedText.length < currentFullTagline.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullTagline.substring(0, displayedText.length + 1));
        }, TYPING_SPEED);
      } else { // Fully typed
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_DURATION);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, taglineIndex, TAGLINES]);

  const techStack = [
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E" },
    { name: "NumPy", icon: SiNumpy, color: "#013243" },
    { name: "Matplotlib", icon: BarChart, color: "#11557C" },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", icon: SiCss, color: "#1572B6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
    { name: "Vite", icon: SiVite, color: "#646CFF" },
    { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Framer", icon: SiFramer, color: "#0055FF" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "PHP", icon: SiPhp, color: "#777BB4" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    { name: "NPM", icon: SiNpm, color: "#CB3837" },
    { name: "GitHub", icon: SiGithub, color: "#ffffff" },
  ];

  return (
    <AnimatedSection id="hero" className="flex flex-col relative overflow-hidden">
      <MobileHeader />
      <div className="container mx-auto px-4 py-16 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight"
            >
              <GradientText variant="name">Ryan Radityatama</GradientText>
            </motion.h1>
            <div className="font-headline text-xl sm:text-2xl md:text-4xl text-primary mb-6 min-h-[32px] sm:min-h-[40px] md:min-h-[56px] flex items-center justify-center">
              <span>{displayedText}</span>
              <span className="inline-block border-r-2 border-primary h-6 sm:h-8 md:h-10 animate-blink align-middle ml-1"></span>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg text-foreground/80 mb-8 md:mb-10 max-w-[90%] mx-auto"
            >
              {translate('hero.description', language)}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8"
            >
              <div className="h-[1px] w-8 md:w-12 bg-primary/20"></div>
              <h2 className="text-primary/80 text-xs md:text-sm font-medium uppercase tracking-wider">{translate('hero.skills', language)}</h2>
              <div className="h-[1px] w-8 md:w-12 bg-primary/20"></div>
            </motion.div>
            
            {/* Tech Stack Grid */}
            <motion.div 
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4 mb-12 md:mb-16"
            >
              {techStack.map((tech) => (
                <motion.div key={tech.name} variants={gridItemVariants} className="group relative">
                  <div 
                    className="p-3 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10"
                    style={{ backgroundColor: `${tech.color}15` }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${tech.color}30`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${tech.color}15`}
                  >
                    <tech.icon 
                      className="w-6 h-6 group-hover:scale-110 transition-transform" 
                      style={{ color: tech.color }} 
                    />
                  </div>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap bg-background border border-border px-2 py-1 rounded-md z-20 shadow-xl">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Cards Section */}
            <div className="relative max-w-5xl mx-auto w-full mt-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              {/* About Card */}
              <Link href="/about" className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#121212] hover:bg-zinc-50 dark:hover:bg-[#1a1a1a] border border-border dark:border-white/[0.05] hover:border-primary/30 transition-all duration-700 p-6 md:p-8 text-center transform hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(124,58,237,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <div className="relative mb-4 h-24 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[160px] mx-auto bg-primary/5 rounded-xl p-3 border border-border dark:border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-inner">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] group-hover:scale-110 transition-transform duration-500">
                        <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-900 dark:text-white/90" />
                        </div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-primary/40 rounded-full"></div>
                        <div className="h-1 w-20 bg-zinc-300 dark:bg-white/20 rounded-full"></div>
                        <div className="flex gap-1 mt-0.5">
                          <div className="h-1 w-6 bg-indigo-500/50 rounded-full"></div>
                          <div className="h-1 w-8 bg-purple-500/50 rounded-full"></div>
                          <div className="h-1 w-5 bg-pink-500/50 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{translate('menu.about', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-zinc-700 dark:group-hover:text-white/80 transition-colors">{translate('hero.aboutDescription', language) || "Discover my background, skills, and experience."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden text-left pl-4">
                    <p className="text-xs text-zinc-600 dark:text-white/80">• AI & Software Engineer</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Machine Learning Expert</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Full Stack Developer</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-primary gap-1 group-hover:text-zinc-900 dark:group-hover:text-white">
                      {translate('hero.learnMore', language) || "Learn more"}
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Projects Card */}
              <Link href="/projects" className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#121212] hover:bg-zinc-50 dark:hover:bg-[#1a1a1a] border border-border dark:border-white/[0.05] hover:border-primary/30 transition-all duration-700 p-6 md:p-8 text-center transform hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(124,58,237,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <div className="relative mb-4 h-24 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 w-full max-w-[160px] mx-auto">
                      <div className="bg-primary/10 border border-border dark:border-white/5 rounded-lg p-2.5 flex flex-col gap-1.5 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:-translate-y-1 transition-all duration-500 shadow-inner">
                        <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center mb-1">
                          <BrainCircuit className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="h-1.5 w-full bg-zinc-300 dark:bg-white/20 rounded-full"></div>
                        <div className="h-1 w-2/3 bg-zinc-200 dark:bg-white/10 rounded-full"></div>
                      </div>
                      <div className="bg-primary/5 border border-border dark:border-white/5 rounded-lg p-2.5 flex flex-col gap-1.5 group-hover:bg-primary/15 group-hover:border-primary/20 group-hover:translate-y-1 transition-all duration-500 shadow-inner">
                        <div className="w-5 h-5 rounded bg-pink-500/20 flex items-center justify-center mb-1">
                          <ScanText className="w-3 h-3 text-pink-500 dark:text-pink-400" />
                        </div>
                        <div className="h-1.5 w-full bg-zinc-300 dark:bg-white/20 rounded-full"></div>
                        <div className="h-1 w-3/4 bg-zinc-200 dark:bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{translate('menu.projects', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-zinc-700 dark:group-hover:text-white/80 transition-colors">{translate('hero.projectsDescription', language) || "Explore my portfolio of software projects."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden text-left pl-4">
                    <p className="text-xs text-zinc-600 dark:text-white/80">• AI/ML Applications</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Web Development</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Mobile Apps</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-primary gap-1 group-hover:text-zinc-900 dark:group-hover:text-white">
                      {translate('hero.viewProjects', language) || "View projects"}
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* AI Agent Card */}
              <Link href="/agent" className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#121212] hover:bg-zinc-50 dark:hover:bg-[#1a1a1a] border border-border dark:border-white/[0.05] hover:border-primary/30 transition-all duration-700 p-6 md:p-8 text-center transform hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(124,58,237,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <div className="relative mb-4 h-24 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[160px] mx-auto bg-primary/5 rounded-xl p-3 border border-border dark:border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-inner">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-full flex flex-col items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-purple-500/40 rounded-full"></div>
                        <div className="h-1 w-20 bg-indigo-300 dark:bg-indigo-900/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">AI Hiring Agent</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-zinc-700 dark:group-hover:text-white/80 transition-colors">Qualify project budgets, estimate custom timelines, or analyze recruiter salary fits.</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden text-left pl-4">
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Multi-Tier Client Proposals</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Salary & Location Alignment</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Professional Follow-up Drafts</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-primary gap-1 group-hover:text-zinc-900 dark:group-hover:text-white">
                      Launch AI Agent
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Contact Card */}
              <Link href="/contact" className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#121212] hover:bg-zinc-50 dark:hover:bg-[#1a1a1a] border border-border dark:border-white/[0.05] hover:border-primary/30 transition-all duration-700 p-6 md:p-8 text-center transform hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(124,58,237,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <div className="relative mb-4 h-24 flex items-center justify-center">
                    <div className="flex flex-col items-center w-full max-w-[160px]">
                      <div className="w-full bg-primary/5 border border-border dark:border-white/5 rounded-xl p-3 mb-2 group-hover:bg-primary/15 transition-colors shadow-inner">
                        <div className="h-2 w-2/3 bg-primary/20 rounded-full mb-2"></div>
                        <div className="h-2 w-full bg-primary/20 rounded-full mb-2"></div>
                        <div className="h-2 w-1/2 bg-primary/20 rounded-full"></div>
                      </div>
                      <div className="flex gap-2 w-full justify-center">
                        <div className="h-5 w-12 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors"></div>
                        <div className="h-5 w-12 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{translate('menu.contact', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-zinc-700 dark:group-hover:text-white/80 transition-colors">{translate('hero.contactDescription', language) || "Get in touch for collaborations."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden text-left pl-4">
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Project Collaboration</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Job Opportunities</p>
                    <p className="text-xs text-zinc-600 dark:text-white/80">• Quick Response Time</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-primary gap-1 group-hover:text-zinc-900 dark:group-hover:text-white">
                      {translate('hero.contactMe', language) || "Contact me"}
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </AnimatedSection>
  );
}
