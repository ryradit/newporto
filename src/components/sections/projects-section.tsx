
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { GlowingEffect } from "../ui/glowing-effect";

const projects = [
  {
    title: "Merra.ai - AI Interview Co-Pilot",
    description: "Developed Merra AI as AI Software Engineer, an AI-powered co-pilot for interviewers that assists with question generation, real-time response analysis, and provides post-interview insights.",
    imageUrl: "/images/merra.png",
    imageHint: "AI platform dashboard",
    tags: ["AI", "SaaS", "Next.js", "Recruitment Tech", "NLP", "Startup"],
    liveLink: "https://www.trymerra.ai/",
    codeLink: "#",
  },
  {
    title: "AI-Powered Barbershop Website",
    description: "Developed an AI-enhanced website for 'King Barbershop', featuring intelligent functionalities. View the live site or browse the code on GitHub.",
    imageUrl: "/images/kingbarber.png",
    imageHint: "barbershop website",
    tags: ["AI", "Web Development", "Next.js", "React", "Vercel", "JavaScript", "UI/UX"],
    liveLink: "https://king-barbershop.vercel.app/",
    codeLink: "https://github.com/ryradit/King-Barbershop",
  },
  {
    title: "LLM Research for Mental Health",
    description: "Focused research on Indonesian Large Language Models (LLMs) for mental health applications, aiming to build empathetic and supportive conversational AI systems using NLP techniques.",
    imageUrl: "/images/mentalhealth.png",
    imageHint: "chatbot nlp",
    tags: ["LLMs", "NLP", "Python", "Research", "TensorFlow", "PyTorch"],
    liveLink: "https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2",
    codeLink: "#",
  },
  {
    title: "Sports Booking Apps Startup",
    description: "Role: Android Developer.\nDeveloped an Android app to connect users with shared hobbies, featuring user profiles, event scheduling, and real-time notifications.",
    imageUrl: "/images/sweat.png",
    imageHint: "mobile app interface",
    tags: ["Android Development", "Mobile App", "Java/Kotlin", "Firebase", "UI/UX"],
    liveLink: "#",
    codeLink: "#",
  },
];

export function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          My Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="group relative flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <GlowingEffect disabled={false} />
              <div className="aspect-video overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={project.imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">{project.title}</CardTitle>
                <CardDescription className="text-foreground/70 h-24 overflow-hidden whitespace-pre-line"> {}
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto pt-0">
                <div className="flex space-x-2 w-full">
                   <Button variant="outline" size="sm" asChild className="flex-1">
                      <a href={project.liveLink !== "#" ? project.liveLink : project.codeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Project
                      </a>
                    </Button>
                    {project.liveLink !== "#" && project.codeLink !== "#" && project.liveLink !== project.codeLink && (
                       <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                          View Code
                        </a>
                      </Button>
                    )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
