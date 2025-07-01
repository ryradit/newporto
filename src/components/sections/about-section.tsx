
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSection() {
  return (
    <AnimatedSection id="about" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          About Me
        </h2>
        <Card className="overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/3">
              <Image
                src="/images/foto2.jpg"
                alt="Ryan Radityatama professional"
                width={600}
                height={800}
                className="object-cover h-full w-full"
                data-ai-hint="working computer"
              />
            </div>
            <div className="md:w-2/3">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">AI Software Engineer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80 text-lg text-justify">
                <p>
                  I am an AI Software Engineer with expertise in AI integration, software development, and system optimization. I am skilled in developing innovative software solutions using React and Node, with a strong background in integrating AI models for enhanced functionality.
                </p>
                <p>
                  Proficient in tools such as TensorFlow, PyTorch, and OpenCV, I have experience in both frontend and backend development. I hold a Master's degree in Computer Science from Beijing Institute of Technology, with a research focus on Indonesian LLMs for mental health applications.
                </p>
                <p>
                  I am adept at leading software development projects, improving system performance, and driving continuous innovation.
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}
