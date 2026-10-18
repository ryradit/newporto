'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, Sparkles, ExternalLink, Check } from 'lucide-react';

interface PortalSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PortalSelector({ open, onOpenChange }: PortalSelectorProps) {
  const { setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const themes = [
    {
      id: 'dark',
      name: 'Earth-616',
      tag: 'Sacred Timeline',
      description: 'Clean Editorial Dark Dimension',
      badge: 'Active Dimension',
      isCurrent: true,
      onClick: () => {
        setTheme('dark');
        setTimeout(() => onOpenChange(false), 250);
      }
    },
    {
      id: 'earth-838',
      name: 'Earth-838',
      tag: 'Illuminati Realm',
      description: 'Sculptural Neumorphism Dimension',
      badge: 'External Dimension',
      isCurrent: false,
      onClick: () => {
        window.open('https://earth-838.ryradit.my.id/', '_blank');
        setTimeout(() => onOpenChange(false), 250);
      }
    },
    {
      id: 'Earth-X',
      name: 'Earth-X',
      tag: 'Multiversal Nexus',
      description: 'Futuristic Cybernetic Dimension',
      badge: 'New Dimension',
      isCurrent: false,
      onClick: () => {
        window.open('https://earth-x.ryradit.my.id/', '_blank');
        setTimeout(() => onOpenChange(false), 250);
      }
    }
  ];

  const navigateCarousel = useCallback((direction: 'next' | 'prev') => {
    setCurrentIndex(prevIndex => {
      if (direction === 'next') {
        return (prevIndex + 1) % themes.length;
      } else {
        return prevIndex === 0 ? themes.length - 1 : prevIndex - 1;
      }
    });
  }, [themes.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        navigateCarousel('prev');
      } else {
        navigateCarousel('next');
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigateCarousel('next');
      if (e.key === 'ArrowLeft') navigateCarousel('prev');
      if (e.key === 'Escape') onOpenChange(false);
      if (e.key === 'Enter') themes[currentIndex].onClick();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, navigateCarousel, onOpenChange, themes]);

  // Animation lifecycles
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      document.body.classList.add('portal-open');
    } else {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      document.body.classList.remove('portal-open');
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.classList.remove('portal-open');
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-0 border-none bg-black/90 backdrop-blur-xl [&>button]:hidden select-none">
        <DialogTitle className="sr-only">Doctor Strange Multiversal Portal</DialogTitle>

        {/* Ambient multiversal embers floating across screen */}
        {isAnimating && Array.from({ length: 45 }).map((_, i) => {
          const posX = (i * 2.2 + 3) % 100;
          const posY = (i * 3.7 + 7) % 100;
          const size = (i % 3) + 2;
          const delay = (i * 0.2) % 4;
          return (
            <div
              key={`ambient-ember-${i}`}
              className="fixed pointer-events-none rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                background: i % 2 === 0 ? '#ffb703' : '#fb8500',
                boxShadow: '0 0 6px #fb8500',
                opacity: 0.35,
                animation: `floatParticle ${8 + (i % 6)}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                zIndex: 5
              }}
            />
          );
        })}

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className={cn(
            "fixed right-6 top-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all duration-200 active:scale-95 shadow-lg",
            isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          aria-label="Close Doctor Strange Portal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">

          {/* Top Dimensional Title */}
          <div
            className={cn(
              "text-center mb-6 transition-all duration-500",
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Sling Ring Multiverse Gateway
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-headline">
              Choose Your Dimension
            </h2>
          </div>

          {/* Doctor Strange Sling Ring Portal Frame */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={cn(
              "relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
              "w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] sm:max-w-[420px] sm:max-h-[420px] md:max-w-[460px] md:max-h-[460px] aspect-square rounded-full",
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{
              animation: "slingRingCoreGlow 4s ease-in-out infinite"
            }}
          >
            {/* SPARK LAYER 1: Tangential & Radial Sparks Spraying from the Ring */}
            {isAnimating && Array.from({ length: 90 }).map((_, i) => {
              const angle = (i / 90) * 360;
              const distance = 49 + (i % 5) * 0.8;
              const posX = 50 + distance * Math.cos((angle * Math.PI) / 180);
              const posY = 50 + distance * Math.sin((angle * Math.PI) / 180);

              // Tangential outward spray velocity
              const sprayAngle = angle + 75 + (i % 30);
              const speed = 40 + (i % 6) * 18;
              const dx = Math.cos((sprayAngle * Math.PI) / 180) * speed;
              const dy = Math.sin((sprayAngle * Math.PI) / 180) * speed;
              const dr = (i % 2 === 0 ? 1 : -1) * (60 + (i % 120));
              const duration = 0.5 + (i % 5) * 0.15;
              const delay = (i * 0.05) % 1.6;

              return (
                <div
                  key={`sling-spark-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: `${(i % 3) + 2}px`,
                    height: `${(i % 3) + 2}px`,
                    left: `${posX}%`,
                    top: `${posY}%`,
                    background: i % 4 === 0 ? '#ffffff' : i % 2 === 0 ? '#ffea00' : '#ff7700',
                    boxShadow: '0 0 8px rgba(255, 170, 0, 0.9), 0 0 16px rgba(255, 90, 0, 0.7)',
                    opacity: 0,
                    animation: `strangeSparkTangential ${duration}s cubic-bezier(0.23, 1, 0.32, 1) infinite`,
                    animationDelay: `${delay}s`,
                    ['--dx' as string]: `${dx}px`,
                    ['--dy' as string]: `${dy}px`,
                    ['--dr' as string]: `${dr}deg`,
                    zIndex: 20
                  }}
                />
              );
            })}

            {/* SPARK LAYER 2: Incandescent Fiery Ring Perimeter (Sling Ring Plasma) */}
            <div
              className="absolute inset-[-6px] rounded-full pointer-events-none animate-spin"
              style={{
                animation: "spin 7s linear infinite",
                background: "conic-gradient(from 0deg, #ff4500, #ffaa00, #fff275, #ff4500, #ff8c00, #fffb96, #ff4500)",
                filter: "blur(3px)",
                opacity: 0.85
              }}
            />

            <div
              className="absolute inset-[-3px] rounded-full pointer-events-none"
              style={{
                animation: "spin-reverse 4.5s linear infinite",
                background: "conic-gradient(from 180deg, transparent, #ff9e00 20%, #ffffff 40%, #ff5400 70%, transparent 95%)",
                filter: "blur(1.5px)",
                opacity: 0.95
              }}
            />

            {/* High-intensity White Core Filament */}
            <div
              className="absolute inset-[0px] rounded-full pointer-events-none border-[3px] border-amber-300"
              style={{
                boxShadow: "0 0 20px #ffaa00, 0 0 40px #ff6600, inset 0 0 25px #ffaa00",
                animation: "flicker 2s ease-in-out infinite"
              }}
            />

            {/* Fiery Dimensional Gateway Center Window */}
            <div
              className="relative w-full h-full rounded-full overflow-hidden flex flex-col items-center justify-center p-6 text-center"
              style={{
                background: themes[currentIndex].id === 'dark'
                  ? 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
                  : themes[currentIndex].id === 'earth-838'
                  ? 'radial-gradient(circle at center, #1e293b 0%, #0b0f19 100%)'
                  : 'radial-gradient(circle at center, #18092e 0%, #090214 100%)',
                boxShadow: "inset 0 0 50px 10px rgba(0, 0, 0, 0.95)"
              }}
            >
              {/* Subtle Cosmic Starfield inside the gateway */}
              {isAnimating && Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute rounded-full bg-white/70 pointer-events-none"
                  style={{
                    width: `${(i % 2) + 1.5}px`,
                    height: `${(i % 2) + 1.5}px`,
                    left: `${(i * 17) % 86 + 7}%`,
                    top: `${(i * 23) % 86 + 7}%`,
                    boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                    opacity: (i % 3) * 0.25 + 0.4
                  }}
                />
              ))}

              {/* Active Dimension Content Card */}
              <div className="relative z-10 flex flex-col items-center max-w-[260px]">
                <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase mb-1">
                  {themes[currentIndex].tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  {themes[currentIndex].name}
                </h3>

                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {themes[currentIndex].description}
                </p>

                {/* Gateway Travel Action Button */}
                <button
                  onClick={themes[currentIndex].onClick}
                  className="mt-5 px-5 py-2 rounded-full bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-md hover:bg-zinc-200 active:scale-95 transition-all duration-150"
                >
                  {themes[currentIndex].isCurrent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-zinc-900" />
                      Keep {themes[currentIndex].name}
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-900" />
                      Travel to {themes[currentIndex].name}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Controls */}
          <div
            className={cn(
              "flex items-center gap-4 mt-7 transition-all duration-500",
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <button
              onClick={() => navigateCarousel('prev')}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all active:scale-95"
              aria-label="Previous Dimension"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dimension Dots */}
            <div className="flex items-center gap-2">
              {themes.map((theme, idx) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    idx === currentIndex
                      ? "w-7 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  )}
                  aria-label={`Go to ${theme.name}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigateCarousel('next')}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all active:scale-95"
              aria-label="Next Dimension"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Multiversal Dimension Subtitle */}
          <p className="text-zinc-500 text-xs mt-3">
            Press Left / Right arrows or swipe to cycle dimensions · ESC to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
