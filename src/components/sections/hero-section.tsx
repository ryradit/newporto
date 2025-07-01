
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Briefcase, Mail } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

const TAGLINES = ["AI Engineer", "NLP Specialist", "Software Engineer"];
const TYPING_SPEED = 120;
const DELETING_SPEED = 70;
const PAUSE_DURATION = 2000; // Pause after typing
const INTER_TAGLINE_PAUSE = 500; // Pause after deleting, before next tagline

export function HeroSection() {
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
    <AnimatedSection id="hero" className="flex flex-col items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-4xl">
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-300 via-slate-50 to-pink-300 text-transparent bg-clip-text">
              Ryan Radityatama
            </h1>
            <div className="font-headline text-2xl sm:text-3xl md:text-4xl text-primary mb-6 min-h-[40px] sm:min-h-[48px] md:min-h-[56px] flex items-center justify-center">
              <span>{displayedText}</span>
              <span className="inline-block border-r-2 border-primary h-7 sm:h-8 md:h-10 animate-blink align-middle ml-1"></span>
            </div>
            <p className="text-base md:text-lg text-foreground/80 mb-10">
              Building intelligent solutions that bridge the gap between data and real-world impact. Exploring the frontiers of Machine Learning and Deep Learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-10 py-6 text-base">
                <Link href="#projects">
                  <Briefcase className="mr-2 h-5 w-5" /> View Projects
                </Link>
              </Button>
              <Button asChild variant="link" size="lg" className="text-foreground/80 hover:text-primary px-2">
                <Link href="#contact" className="flex items-center gap-2">
                  <Mail className="mr-1 h-5 w-5" /> Contact Me
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </AnimatedSection>
  );
}
