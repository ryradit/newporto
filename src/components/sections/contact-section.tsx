"use client";

import { ContactForm } from "@/components/contact-form";
import { AnimatedSection } from "@/components/animated-section";
import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";

export function ContactSection() {
  return (
    <AnimatedSection id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <AppleHelloEnglishEffect className="h-16 -rotate-12" />
        </div>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-4">
          Get In Touch
        </h2>
        <p className="text-center text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
          Have a question, a project idea, or just want to connect? Feel free to reach out. I'm always open to discussing new opportunities and collaborations.
        </p>
        <ContactForm />
      </div>
    </AnimatedSection>
  );
}
