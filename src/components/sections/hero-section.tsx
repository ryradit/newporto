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
  SiNumpy,
  SiTensorflow,
  SiOpencv,
  SiPandas,
  SiJupyter,
  SiKeras,
  SiFastapi,
  SiAnaconda,
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiLangchain,
  SiOllama,
  SiElevenlabs,
  SiDeepgram,
  SiLanggraph,
  SiStreamlit
} from "react-icons/si";
import { BarChart, User, FolderKanban, MessageSquare, Mail, Bot, Code2, ArrowLeft, ArrowRight } from "lucide-react";
import { BrainCircuit, ScanText, Camera, Cpu, AudioLines, Languages, Database, Network } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import Link from "next/link";
import { GradientText } from "@/components/ui/gradient-text";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    // AI / ML
    { name: "Python", icon: SiPython, color: "#3776AB", category: "ai", level: "Expert" },
    { name: "OpenAI", icon: SiOpenai, color: "#10A37F", category: "ai", level: "Expert" },
    { name: "Gemini", icon: SiGooglegemini, color: "#8E75C2", category: "ai", level: "Expert" },
    { name: "DeepSeek", icon: BrainCircuit, color: "#1E6FFF", category: "ai", level: "Expert" },
    { name: "Claude", icon: SiAnthropic, color: "#D97706", category: "ai", level: "Expert" },
    { name: "LangChain", icon: SiLangchain, color: "#138F9E", category: "ai", level: "Expert" },
    { name: "Ollama", icon: SiOllama, color: "#ffffff", category: "ai", level: "Expert" },
    { name: "Azure AI Speech", icon: AudioLines, color: "#0078D4", category: "ai", level: "Proficient" },
    { name: "Azure Translator", icon: Languages, color: "#0078D4", category: "ai", level: "Proficient" },
    { name: "ElevenLabs", icon: SiElevenlabs, color: "#ffffff", category: "ai", level: "Proficient" },
    { name: "Deepgram", icon: SiDeepgram, color: "#13EF93", category: "ai", level: "Proficient" },
    { name: "LangGraph", icon: SiLanggraph, color: "#138F9E", category: "ai", level: "Proficient" },
    { name: "Streamlit", icon: SiStreamlit, color: "#FF4B4B", category: "ai", level: "Proficient" },
    { name: "Pinecone", icon: Database, color: "#1C17FF", category: "ai", level: "Proficient" },
    { name: "ChromaDB", icon: Network, color: "#FFDE2D", category: "ai", level: "Proficient" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C", category: "ai", level: "Expert" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00", category: "ai", level: "Expert" },
    { name: "Keras", icon: SiKeras, color: "#D00000", category: "ai", level: "Expert" },
    { name: "scikit-learn", icon: SiScikitlearn, color: "#F7931E", category: "ai", level: "Expert" },
    { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8", category: "ai", level: "Expert" },
    { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E", category: "ai", level: "Expert" },
    { name: "Pandas", icon: SiPandas, color: "#150458", category: "ai", level: "Expert" },
    { name: "NumPy", icon: SiNumpy, color: "#013243", category: "ai", level: "Expert" },
    { name: "FastAPI", icon: SiFastapi, color: "#009688", category: "ai", level: "Expert" },
    { name: "Matplotlib", icon: BarChart, color: "#11557C", category: "ai", level: "Proficient" },
    { name: "Jupyter", icon: SiJupyter, color: "#F37626", category: "ai", level: "Proficient" },
    { name: "Anaconda", icon: SiAnaconda, color: "#44A833", category: "ai", level: "Proficient" },

    // Frontend
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "frontend", level: "Expert" },
    { name: "React", icon: SiReact, color: "#61DAFB", category: "frontend", level: "Expert" },
    { name: "Next.js", icon: SiNextdotjs, color: "#ffffff", category: "frontend", level: "Expert" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", category: "frontend", level: "Expert" },
    { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", category: "frontend", level: "Expert" },
    { name: "Vite", icon: SiVite, color: "#646CFF", category: "frontend", level: "Proficient" },
    { name: "Framer", icon: SiFramer, color: "#0055FF", category: "frontend", level: "Proficient" },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26", category: "frontend", level: "Expert" },
    { name: "CSS3", icon: SiCss, color: "#1572B6", category: "frontend", level: "Expert" },
    { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3", category: "frontend", level: "Proficient" },

    // Backend / Tools
    { name: "Node.js", icon: SiNodedotjs, color: "#339933", category: "backend", level: "Expert" },
    { name: "PHP", icon: SiPhp, color: "#777BB4", category: "backend", level: "Proficient" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", category: "backend", level: "Expert" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1", category: "backend", level: "Expert" },
    { name: "Supabase", icon: SiSupabase, color: "#3FCF8E", category: "backend", level: "Expert" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28", category: "backend", level: "Proficient" },
    { name: "NPM", icon: SiNpm, color: "#CB3837", category: "backend", level: "Proficient" },
    { name: "GitHub", icon: SiGithub, color: "#ffffff", category: "backend", level: "Expert" },
  ];

  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'frontend' | 'backend'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredTech = activeCategory === 'all' 
    ? techStack 
    : techStack.filter(t => t.category === activeCategory);

  const displayedTech = isExpanded ? filteredTech : filteredTech.slice(0, 12);

  const handleCategoryChange = (cat: 'all' | 'ai' | 'frontend' | 'backend') => {
    setActiveCategory(cat);
    setIsExpanded(false);
  };

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
            
            {/* Category Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8 bg-muted/40 border border-border/50 rounded-xl p-1 backdrop-blur-sm max-w-md mx-auto">
              {(['all', 'ai', 'frontend', 'backend'] as const).map((cat) => {
                const labelMap = {
                  all: 'All',
                  ai: 'AI & ML',
                  frontend: 'Frontend',
                  backend: 'Backend'
                };
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={cn(
                      "relative flex-1 inline-flex items-center justify-center rounded-lg py-1.5 px-3 text-xs font-medium tracking-wide transition-colors duration-150 focus:outline-none z-10 whitespace-nowrap active:scale-95",
                      isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-skill-tab"
                        className="absolute inset-0 bg-background border border-border rounded-lg shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {labelMap[cat]}
                  </button>
                );
              })}
            </div>

            {/* Tech Stack Grid */}
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-8 max-w-5xl mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {displayedTech.map((tech) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    key={tech.name} 
                    className="group relative"
                  >
                    <div 
                      className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-card/60 hover:bg-card border border-border/60 hover:border-border transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group/item"
                    >
                      <div 
                        className="p-2.5 rounded-lg mb-2 flex items-center justify-center transition-transform duration-150 group-hover/item:scale-110"
                        style={{ backgroundColor: `${tech.color}18` }}
                      >
                        <tech.icon 
                          className="w-5 h-5 transition-transform duration-150" 
                          style={{ color: tech.color }}
                        />
                      </div>
                      <span className="text-xs font-medium tracking-tight text-foreground/90 group-hover/item:text-foreground transition-colors text-center truncate w-full max-w-[110px]">
                        {tech.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Show More / Show Less Toggle Button */}
            {filteredTech.length > 12 && (
              <div className="flex justify-center mb-12">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-xs font-medium text-foreground transition-all duration-150 shadow-sm active:scale-95"
                >
                  <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                  <motion.svg
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-3.5 h-3.5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              </div>
            )}

            {/* Feature Cards Section */}
            <div className="relative max-w-5xl mx-auto w-full mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* About Card */}
                <Link href="/about" className="group relative overflow-hidden rounded-2xl bg-card/60 hover:bg-card border border-border/60 hover:border-indigo-500/40 transition-all duration-200 p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98]">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">Bio</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">{translate('menu.about', language)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{translate('hero.aboutDescription', language) || "Background, education, and career."}</p>
                  <div className="flex items-center text-xs font-medium text-indigo-400 gap-1.5 group-hover:translate-x-1 transition-transform duration-150">
                    <span>{translate('hero.learnMore', language) || "Learn more"}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </Link>

                {/* Projects Card */}
                <Link href="/projects" className="group relative overflow-hidden rounded-2xl bg-card/60 hover:bg-card border border-border/60 hover:border-emerald-500/40 transition-all duration-200 p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98]">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                      <BrainCircuit className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">Works</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">{translate('menu.projects', language)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{translate('hero.projectsDescription', language) || "AI models, computer vision & full-stack apps."}</p>
                  <div className="flex items-center text-xs font-medium text-emerald-400 gap-1.5 group-hover:translate-x-1 transition-transform duration-150">
                    <span>{translate('hero.viewProjects', language) || "View projects"}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </Link>

                {/* AI Agent Card */}
                <Link href="/agent" className="group relative overflow-hidden rounded-2xl bg-card/60 hover:bg-card border border-border/60 hover:border-purple-500/40 transition-all duration-200 p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98]">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">AI Twin</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">AI Hiring Agent</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">Project estimation, recruiter alignment, & dynamic briefs.</p>
                  <div className="flex items-center text-xs font-medium text-purple-400 gap-1.5 group-hover:translate-x-1 transition-transform duration-150">
                    <span>Launch Agent</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </Link>

                {/* Contact Card */}
                <Link href="/contact" className="group relative overflow-hidden rounded-2xl bg-card/60 hover:bg-card border border-border/60 hover:border-amber-500/40 transition-all duration-200 p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98]">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                      <Mail className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">Direct</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">{translate('menu.contact', language)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{translate('hero.contactDescription', language) || "Inquire for consulting, roles, and collaborations."}</p>
                  <div className="flex items-center text-xs font-medium text-amber-400 gap-1.5 group-hover:translate-x-1 transition-transform duration-150">
                    <span>{translate('hero.contactMe', language) || "Get in touch"}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
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
