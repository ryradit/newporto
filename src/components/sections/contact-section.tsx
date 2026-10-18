"use client";

import { ContactForm } from "@/components/contact-form";
import { AnimatedSection } from "@/components/animated-section";
import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { Instagram, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import { HireAgentCta } from "@/components/hire-agent-cta";
import { MobileHeader } from "@/components/layout/mobile-header";

export function ContactSection() {
  const { language } = useLanguage();
  return (
    <AnimatedSection id="contact" className="py-16 md:py-24 bg-background">
      <MobileHeader />
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <AppleHelloEnglishEffect className="h-16 -rotate-12" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-3 tracking-tight">
          {translate('contact.title', language)}
        </h2>
        <p className="text-center text-sm md:text-base text-muted-foreground mb-8 max-w-xl mx-auto">
          {translate('contact.description', language)}
        </p>
        
        {/* Social Media Links */}
        <div className="flex justify-center gap-3 mb-10">
          <Link
            href="https://www.linkedin.com/in/ryan-radityatama/"
            target="_blank"
            className="p-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 shadow-sm"
            title="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            href="https://www.instagram.com/ryradit/"
            target="_blank"
            className="p-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 shadow-sm"
            title="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </Link>
          <Link
            href="https://github.com/ryradit"
            target="_blank"
            className="p-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 shadow-sm"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="mailto:ryradit@gmail.com"
            className="p-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 shadow-sm"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </Link>
        </div>
        
        <HireAgentCta />

        <ContactForm />
      </div>
    </AnimatedSection>
  );
}
