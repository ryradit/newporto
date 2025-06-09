
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { Briefcase, Mail } from "lucide-react";

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
        // Ensure a brief pause before starting to type the next tagline
        timer = setTimeout(() => {
          // This timeout doesn't need to do anything but create a delay
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
    <AnimatedSection id="hero" className="" as="div"> {/* Removed bg-hero-pattern and related classes */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              Ryan Radityatama
            </h1>
            <div className="font-headline text-2xl sm:text-3xl md:text-4xl text-primary mb-6 min-h-[40px] sm:min-h-[48px] md:min-h-[56px] flex items-center justify-center lg:justify-start">
              <span>{displayedText}</span>
              <span className="inline-block border-r-2 border-primary h-7 sm:h-8 md:h-10 animate-blink align-middle ml-1"></span>
            </div>
            <p className="text-lg md:text-xl text-foreground/80 mb-10">
              Building intelligent solutions that bridge the gap between data and real-world impact. Exploring the frontiers of Machine Learning and Deep Learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

          {/* Right Column */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <Image
              src="/images/foto1.jpg"
              alt="Ryan Radityatama - AI Engineer"
              width={400}
              height={480}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="professional portrait"
              priority
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
