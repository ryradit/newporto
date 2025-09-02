
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
  SiCss3,
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
const TYPING_SPEED = 120;
const DELETING_SPEED = 70;
const PAUSE_DURATION = 2000; // Pause after typing
const INTER_TAGLINE_PAUSE = 500; // Pause after deleting, before next tagline

export function HeroSection() {
  const { language } = useLanguage();
  const TAGLINES = [
    translate('hero.taglines.aiEngineer', language),
    translate('hero.taglines.nlpSpecialist', language),
    translate('hero.taglines.softwareEngineer', language)
  ];
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullTagline = TAGLINES[taglineIndex];
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
  }, [displayedText, isDeleting, taglineIndex]);

  return (
    <AnimatedSection id="hero" className="flex flex-col relative overflow-hidden">
      <MobileHeader />
      <div className="container mx-auto px-4 py-16 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-4xl">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <GradientText variant="name">Ryan Radityatama</GradientText>
            </h1>
            <div className="font-headline text-xl sm:text-2xl md:text-4xl text-primary mb-6 min-h-[32px] sm:min-h-[40px] md:min-h-[56px] flex items-center justify-center">
              <span>{displayedText}</span>
              <span className="inline-block border-r-2 border-primary h-6 sm:h-8 md:h-10 animate-blink align-middle ml-1"></span>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-8 md:mb-10 max-w-[90%] mx-auto">
              {translate('hero.description', language)}
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="h-[1px] w-8 md:w-12 bg-primary/20"></div>
              <h2 className="text-primary/80 text-xs md:text-sm font-medium uppercase tracking-wider">{translate('hero.skills', language)}</h2>
              <div className="h-[1px] w-8 md:w-12 bg-primary/20"></div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4 mb-8 md:mb-10">
              {/* Python Ecosystem */}
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#3776AB]/10 hover:bg-[#3776AB]/20 transition-all cursor-pointer">
                  <SiPython className="w-6 h-6 text-[#3776AB] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Python</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#F7931E]/10 hover:bg-[#F7931E]/20 transition-all cursor-pointer">
                  <SiScikitlearn className="w-6 h-6 text-[#F7931E] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">scikit-learn</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#EE4C2C]/10 hover:bg-[#EE4C2C]/20 transition-all cursor-pointer">
                  <SiPytorch className="w-6 h-6 text-[#EE4C2C] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">PyTorch</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#FFD21E]/10 hover:bg-[#FFD21E]/20 transition-all cursor-pointer">
                  <SiHuggingface className="w-6 h-6 text-[#FFD21E] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Hugging Face</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#013243]/10 hover:bg-[#013243]/20 transition-all cursor-pointer">
                  <SiNumpy className="w-6 h-6 text-[#013243] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">NumPy</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#11557C]/10 hover:bg-[#11557C]/20 transition-all cursor-pointer">
                  <BarChart className="w-6 h-6 text-[#11557C] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Matplotlib</span>
              </div>

              {/* Web Frontend */}
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#E34F26]/10 hover:bg-[#E34F26]/20 transition-all cursor-pointer">
                  <SiHtml5 className="w-6 h-6 text-[#E34F26] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">HTML5</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#1572B6]/10 hover:bg-[#1572B6]/20 transition-all cursor-pointer">
                  <SiCss3 className="w-6 h-6 text-[#1572B6] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">CSS3</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#F7DF1E]/10 hover:bg-[#F7DF1E]/20 transition-all cursor-pointer">
                  <SiJavascript className="w-6 h-6 text-[#F7DF1E] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">JavaScript</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#3178C6]/10 hover:bg-[#3178C6]/20 transition-all cursor-pointer">
                  <SiTypescript className="w-6 h-6 text-[#3178C6] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">TypeScript</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#61DAFB]/10 hover:bg-[#61DAFB]/20 transition-all cursor-pointer">
                  <SiReact className="w-6 h-6 text-[#61DAFB] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">React</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                  <SiNextdotjs className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Next.js</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#646CFF]/10 hover:bg-[#646CFF]/20 transition-all cursor-pointer">
                  <SiVite className="w-6 h-6 text-[#646CFF] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Vite</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#7952B3]/10 hover:bg-[#7952B3]/20 transition-all cursor-pointer">
                  <SiBootstrap className="w-6 h-6 text-[#7952B3] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Bootstrap</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 transition-all cursor-pointer">
                  <SiTailwindcss className="w-6 h-6 text-[#06B6D4] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Tailwind</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#0055FF]/10 hover:bg-[#0055FF]/20 transition-all cursor-pointer">
                  <SiFramer className="w-6 h-6 text-[#0055FF] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Framer</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#339933]/10 hover:bg-[#339933]/20 transition-all cursor-pointer">
                  <SiNodedotjs className="w-6 h-6 text-[#339933] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Node.js</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#777BB4]/10 hover:bg-[#777BB4]/20 transition-all cursor-pointer">
                  <SiPhp className="w-6 h-6 text-[#777BB4] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">PHP</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#4169E1]/10 hover:bg-[#4169E1]/20 transition-all cursor-pointer">
                  <SiPostgresql className="w-6 h-6 text-[#4169E1] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">PostgreSQL</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#4479A1]/10 hover:bg-[#4479A1]/20 transition-all cursor-pointer">
                  <SiMysql className="w-6 h-6 text-[#4479A1] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">MySQL</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#3FCF8E]/10 hover:bg-[#3FCF8E]/20 transition-all cursor-pointer">
                  <SiSupabase className="w-6 h-6 text-[#3FCF8E] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Supabase</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#FFCA28]/10 hover:bg-[#FFCA28]/20 transition-all cursor-pointer">
                  <SiFirebase className="w-6 h-6 text-[#FFCA28] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">Firebase</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#CB3837]/10 hover:bg-[#CB3837]/20 transition-all cursor-pointer">
                  <SiNpm className="w-6 h-6 text-[#CB3837] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">NPM</span>
              </div>
              <div className="group relative">
                <div className="p-3 rounded-xl bg-[#181717]/10 hover:bg-[#181717]/20 transition-all cursor-pointer">
                  <SiGithub className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">GitHub</span>
              </div>
            </div>

            {/* Feature Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto w-full mt-8 md:mt-16">
              {/* About Card */}
              <Link href="/about" className="group relative overflow-hidden rounded-lg md:rounded-xl bg-card hover:bg-accent/30 transition-all duration-500 p-5 md:p-6 text-center transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(76,29,149,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <span className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full group-hover:bg-primary/20 blur-xl transition-all duration-500"></span>
                <div className="relative z-10">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                      <User className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10"></div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-white transition-colors">{translate('menu.about', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-white/80 transition-colors">{translate('hero.aboutDescription', language) || "Discover my background, skills, and experience."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-xs text-white/80">• AI & Software Engineer</p>
                    <p className="text-xs text-white/80">• Machine Learning Expert</p>
                    <p className="text-xs text-white/80">• Full Stack Developer</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-white gap-1">
                      {translate('hero.learnMore', language) || "Learn more"}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border border-primary/10 rounded-xl group-hover:border-primary/30 group-hover:scale-[1.01] transition-all duration-500"></div>
              </Link>

              {/* Projects Card */}
                            {/* Projects Card */}
              <Link href="/projects" className="group relative overflow-hidden rounded-lg md:rounded-xl bg-card hover:bg-accent/30 transition-all duration-500 p-5 md:p-6 text-center transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(76,29,149,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <span className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full group-hover:bg-primary/20 blur-xl transition-all duration-500"></span>
                <div className="relative z-10">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                      <Code2 className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10"></div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-white transition-colors">{translate('menu.projects', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-white/80 transition-colors">{translate('hero.projectsDescription', language) || "Explore my portfolio of software projects."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-xs text-white/80">• AI/ML Applications</p>
                    <p className="text-xs text-white/80">• Web Development</p>
                    <p className="text-xs text-white/80">• Mobile Apps</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-white gap-1">
                      {translate('hero.viewProjects', language) || "View projects"}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border border-primary/10 rounded-xl group-hover:border-primary/30 group-hover:scale-[1.01] transition-all duration-500"></div>
              </Link>

              {/* Live Chat Card */}
              <Link href="/chat-room" className="group relative overflow-hidden rounded-lg md:rounded-xl bg-card hover:bg-accent/30 transition-all duration-500 p-5 md:p-6 text-center transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(76,29,149,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <span className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full group-hover:bg-primary/20 blur-xl transition-all duration-500"></span>
                <div className="relative z-10">
                  <div className="relative mb-4">
                    <div className="flex flex-col gap-2 mb-4 mx-auto max-w-[160px]">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-[10px] text-left group-hover:bg-primary/20 transition-colors">Hey! How can I help you today?</div>
                      </div>
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-primary/20 rounded-lg p-2 text-[10px] text-left group-hover:bg-primary/30 transition-colors">Tell me about your projects</div>
                        <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0"></div>
                      </div>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                      <MessageSquare className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10"></div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-white transition-colors">{translate('menu.chatRoom', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-white/80 transition-colors">{translate('hero.chatDescription', language) || "Chat room to express and share more."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-xs text-white/80">• Ask About My Experience</p>
                    <p className="text-xs text-white/80">• Project Inquiries</p>
                    <p className="text-xs text-white/80">• Real-time Responses</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-white gap-1">
                      {translate('hero.startChat', language) || "Start chatting"}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border border-primary/10 rounded-xl group-hover:border-primary/30 group-hover:scale-[1.01] transition-all duration-500"></div>
              </Link>

              {/* Contact Card */}
              <Link href="/contact" className="group relative overflow-hidden rounded-lg md:rounded-xl bg-card hover:bg-accent/30 transition-all duration-500 p-5 md:p-6 text-center transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(76,29,149,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors duration-500"></div>
                <span className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full group-hover:bg-primary/20 blur-xl transition-all duration-500"></span>
                <div className="relative z-10">
                  <div className="relative mb-4">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-full max-w-[160px] bg-primary/5 rounded-lg p-3 mb-2 group-hover:bg-primary/15 transition-colors">
                        <div className="h-3 w-2/3 bg-primary/20 rounded-full mb-2"></div>
                        <div className="h-3 w-full bg-primary/20 rounded-full mb-2"></div>
                        <div className="h-3 w-1/2 bg-primary/20 rounded-full"></div>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <div className="h-6 w-16 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                          <span className="text-[8px] text-white">Send</span>
                        </div>
                        <div className="h-6 w-16 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                          <span className="text-[8px] text-white">Reset</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                      <Mail className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10"></div>
                  </div>
                  <h3 className="font-headline text-xl font-medium mb-2 text-primary/90 group-hover:text-white transition-colors">{translate('menu.contact', language)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 group-hover:text-white/80 transition-colors">{translate('hero.contactDescription', language) || "Get in touch for collaborations."}</p>
                  <div className="h-0 group-hover:h-[4.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-xs text-white/80">• Project Collaboration</p>
                    <p className="text-xs text-white/80">• Job Opportunities</p>
                    <p className="text-xs text-white/80">• Quick Response Time</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center text-xs font-medium text-white gap-1">
                      {translate('hero.contactMe', language) || "Contact me"}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border border-primary/10 rounded-xl group-hover:border-primary/30 group-hover:scale-[1.01] transition-all duration-500"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </AnimatedSection>
  );
}
