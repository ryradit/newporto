"use client";

import { ContactForm } from "@/components/contact-form";
import { AnimatedSection } from "@/components/animated-section";
import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { Instagram, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";

export function ContactSection() {
  const { language } = useLanguage();
  return (
    <AnimatedSection id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <AppleHelloEnglishEffect className="h-16 -rotate-12" />
        </div>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-4">
          {translate('contact.title', language)}
        </h2>
        <p className="text-center text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          {translate('contact.description', language)}
        </p>
        
        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mb-12">
          <Link
            href="https://linkedin.com/in/ryanradityatama"
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link
            href="https://instagram.com/ryanradityatama"
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </Link>
          <Link
            href="https://github.com/ryanradityatama"
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href="mailto:ryanradityatama@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-6 w-6" />
          </Link>
        </div>
        
        <ContactForm />
      </div>
    </AnimatedSection>
  );
}
