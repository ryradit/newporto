
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

const Package = Box; 

interface SkillBadge {
  name: string;
  icon: LucideIcon;
}

const skillsListTopRow: SkillBadge[] = [
  { name: "Python", icon: FileCode },
  { name: "JavaScript", icon: FileCode },
  { name: "TypeScript", icon: FileCode },
  { name: "React.js", icon: Code2 },
  { name: "Next.js", icon: FastForward },
  { name: "Node.js", icon: Server },
  { name: "TailwindCSS", icon: Wind },
];

const skillsListBottomRow: SkillBadge[] = [
  { name: "TensorFlow", icon: BrainCircuit },
  { name: "PyTorch", icon: Layers },
  { name: "OpenCV", icon: Camera },
  { name: "LLMs", icon: MessageCircle },
  { name: "Git", icon: GitFork },
  { name: "Firebase", icon: Flame },
];

export function SkillsSection() {
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

        <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
          {/* Top Row - Scrolls Left */}
          <div className="relative flex overflow-x-hidden group">
            <div className="py-4 animate-marquee whitespace-nowrap flex flex-row">
              {duplicatedSkillsTop.map((skill, index) => (
                <div
                  key={`skill-top-${index}-${skill.name}`}
                  className="mx-3 inline-flex items-center gap-2 rounded-full bg-card text-card-foreground px-5 py-2.5 text-sm md:text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <skill.icon className="h-5 w-5 text-accent" />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Scrolls Right */}
          <div className="relative flex overflow-x-hidden group">
            <div className="py-4 animate-marquee-right whitespace-nowrap flex flex-row">
              {duplicatedSkillsBottom.map((skill, index) => (
                <div
                  key={`skill-bottom-${index}-${skill.name}`}
                  className="mx-3 inline-flex items-center gap-2 rounded-full bg-card text-card-foreground px-5 py-2.5 text-sm md:text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <skill.icon className="h-5 w-5 text-accent" />
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
