
"use client";

import { AnimatedSection } from "@/components/animated-section";
import {
  Code2,
  BrainCircuit,
  MessageCircle,
  GitFork,
  Server,
  Palette,
  Layers,
  Camera,
  Database,
  Cloud,
  Wind,
  Box,
  Replace, 
  FastForward, 
  FileCode,
  GithubIcon, 
  Container, 
  Flame, 
  Sparkles, 
  Component
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getSkills } from "@/lib/supabase-cms";

const iconMap: Record<string, LucideIcon> = {
  Code2, BrainCircuit, MessageCircle, GitFork, Server, Palette, Layers, Camera,
  Database, Cloud, Wind, Box, Replace, FastForward, FileCode, GithubIcon, Container,
  Flame, Sparkles, Component
};

const Package = Box; 

interface SkillBadge {
  name: string;
  icon: LucideIcon;
}

export function SkillsSection() {
  const [skillsListTopRow, setSkillsListTopRow] = useState<SkillBadge[]>([
    { name: "Python", icon: FileCode },
    { name: "JavaScript", icon: FileCode },
    { name: "TypeScript", icon: FileCode },
    { name: "React.js", icon: Code2 },
    { name: "Next.js", icon: FastForward },
    { name: "Node.js", icon: Server },
    { name: "TailwindCSS", icon: Wind },
  ]);
  
  const [skillsListBottomRow, setSkillsListBottomRow] = useState<SkillBadge[]>([
    { name: "TensorFlow", icon: BrainCircuit },
    { name: "PyTorch", icon: Layers },
    { name: "OpenCV", icon: Camera },
    { name: "LLMs", icon: MessageCircle },
    { name: "Git", icon: GitFork },
    { name: "Firebase", icon: Flame },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSkills();
        if (data && data.length > 0) {
          const top = data.filter(s => s.row_placement === 'top').map(s => ({
            name: s.name,
            icon: iconMap[s.icon_name] || Code2
          }));
          const bottom = data.filter(s => s.row_placement === 'bottom').map(s => ({
            name: s.name,
            icon: iconMap[s.icon_name] || Code2
          }));
          
          if (top.length > 0) setSkillsListTopRow(top);
          if (bottom.length > 0) setSkillsListBottomRow(bottom);
        }
      } catch (err) {
        console.error("Failed to load skills", err);
      }
    }
    load();
  }, []);

  const duplicatedSkillsTop = [...skillsListTopRow, ...skillsListTopRow];
  const duplicatedSkillsBottom = [...skillsListBottomRow, ...skillsListBottomRow];

  return (
    <AnimatedSection id="skills" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4">
          <Code2 className="h-8 w-8 mr-3 text-primary" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary">
            Skills
          </h2>
        </div>
        <p className="text-center text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
          My professional skills.
        </p>

        <div className="flex flex-col space-y-6 w-full max-w-5xl mx-auto">
          {/* Top Row - Scrolls Left */}
          <div className="relative flex overflow-x-hidden group" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
            <div className="py-4 animate-marquee whitespace-nowrap flex flex-row">
              {duplicatedSkillsTop.map((skill, index) => (
                <div
                  key={`skill-top-${index}-${skill.name}`}
                  className="mx-3 inline-flex items-center gap-3 rounded-2xl bg-[#121212] border border-white/5 text-white/90 px-6 py-3 text-sm md:text-base font-medium shadow-xl hover:shadow-[0_10px_30px_rgba(124,58,237,0.2)] hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-default group/badge"
                >
                  <skill.icon className="h-5 w-5 text-primary group-hover/badge:text-purple-400 transition-colors" />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Scrolls Right */}
          <div className="relative flex overflow-x-hidden group" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
            <div className="py-4 animate-marquee-right whitespace-nowrap flex flex-row">
              {duplicatedSkillsBottom.map((skill, index) => (
                <div
                  key={`skill-bottom-${index}-${skill.name}`}
                  className="mx-3 inline-flex items-center gap-3 rounded-2xl bg-[#121212] border border-white/5 text-white/90 px-6 py-3 text-sm md:text-base font-medium shadow-xl hover:shadow-[0_10px_30px_rgba(124,58,237,0.2)] hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-default group/badge"
                >
                  <skill.icon className="h-5 w-5 text-primary group-hover/badge:text-purple-400 transition-colors" />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
