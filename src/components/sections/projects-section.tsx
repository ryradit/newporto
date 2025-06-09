
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

const projects = [
  {
    title: "Palm Tree Detection",
    description: "Developed an AI Computer Vision model for enhancing and optimizing the harvest route of Palm Oil and Monitoring Tree Health.",
    imageUrl: "/images/sawitpro.jpg",
    imageHint: "palm tree computer vision",
    tags: ["Computer Vision", "AI", "Algorithm Development", "Python", "Route Optimization", "Tree Health"],
    liveLink: "https://github.com/ryradit/palmtreedetection", 
    codeLink: "#", 
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
    description: "Developed an Android app to connect users with shared hobbies, featuring user profiles, event scheduling, and real-time notifications.",
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
            <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <ExternalLink className="mr-2 h-4 w-4" /> View
                      </a>
                    </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
