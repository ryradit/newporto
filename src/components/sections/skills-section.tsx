
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { Code2, BrainCircuit, MessageCircle, Database, Cloud, GitFork, Layers, Settings2, Server, Palette, DraftingCompass, BarChartBig, Combine, Camera, Rocket, SearchCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Skill {
  name: string;
  icon: LucideIcon;
  level?: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "AI & Machine Learning",
    skills: [
      { name: "AI Integration", icon: Combine, level: "Expertise" },
      { name: "TensorFlow", icon: Layers, level: "Proficient" },
      { name: "PyTorch", icon: Layers, level: "Proficient" },
      { name: "OpenCV", icon: Camera, level: "Proficient" },
      { name: "LLM Development", icon: MessageCircle, level: "Research Focus" },
      { name: "Natural Language Processing", icon: DraftingCompass, level: "Proficient" },
    ],
  },
  {
    name: "Software & Web Development",
    skills: [
      { name: "Python", icon: Code2, level: "Proficient" },
      { name: "React.js", icon: Code2, level: "Skilled" },
      { name: "Node.js", icon: Server, level: "Skilled" },
      { name: "JavaScript", icon: Code2, level: "Skilled" },
      { name: "Frontend Development", icon: Palette, level: "Experienced" },
      { name: "Backend Development", icon: Server, level: "Experienced" },
      { name: "System Optimization", icon: Rocket, level: "Expertise" },
    ],
  },
  {
    name: "Tools & General",
    skills: [
      { name: "Git & GitHub", icon: GitFork, level: "Proficient" },
      { name: "API Development", icon: Server, level: "Experienced" },
      { name: "Data Integration", icon: Database, level: "Expertise"},
      { name: "Cloud Platforms (Basics)", icon: Cloud, level: "Familiar" },
    ],
  },
];

export function SkillsSection() {
  return (
    <AnimatedSection id="skills" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          My Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <Card key={category.name} className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.skills.map((skill) => (
                    <li key={skill.name} className="flex items-center">
                      <skill.icon className="h-6 w-6 mr-3 text-accent flex-shrink-0" />
                      <span className="text-foreground/90">{skill.name}</span>
                      {skill.level && (
                        <span className="ml-auto text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{skill.level}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
