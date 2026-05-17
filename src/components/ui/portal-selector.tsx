'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface PortalSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PortalSelector({ open, onOpenChange }: PortalSelectorProps) {
  const { setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const themes = [
    {
      id: 'dark',
      name: 'Earth-616',
      description: 'Current Theme',
      background: 'bg-gray-800/90',
      innerBackground: 'bg-gray-900',
      gradient: 'from-blue-600/20 to-purple-600/30',
      buttonGradient: 'from-purple-600 to-blue-500',
      textColor: 'text-white',
      subtitleColor: 'text-gray-300',
      buttonText: 'Select',
      onClick: () => {
        setTheme('dark');
        setTimeout(() => onOpenChange(false), 200);
      }
    },
    {
      id: 'earth-838',
      name: 'Earth-838',
      description: 'Neumorphism Dimension',
      background: 'bg-gray-200/90',
      innerBackground: 'bg-gray-100',
      gradient: '',
      buttonGradient: 'from-gray-600 to-white',
      textColor: 'text-gray-800',
      subtitleColor: 'text-gray-600',
      buttonText: 'Visit Earth-838',
      onClick: () => {
        window.open('https://earth-838.ryradit.my.id/', '_blank');
        setTimeout(() => onOpenChange(false), 200);
      }
    },
    {
      id: 'Earth-X',
      name: 'Earth-X',
      description: 'Future Theme Dimension',
      background: 'bg-gradient-to-br from-purple-900 to-indigo-900',
      innerBackground: 'bg-purple-800/30',
      gradient: 'from-purple-600/10 to-indigo-600/20',
      buttonGradient: 'from-pink-500 to-rose-500',
      textColor: 'text-white',
      subtitleColor: 'text-purple-200',
      buttonText: 'Visit Earth-X',
      disabled: false,
      badge: 'new earth',
      onClick: () => {
        window.open('https://earth-x.ryradit.my.id/', '_blank');
        setTimeout(() => onOpenChange(false), 200);
      }
    }
  ];

  // Function to navigate carousel
  const navigateCarousel = (direction: 'next' | 'prev') => {
    setCurrentIndex(prevIndex => {
      if (direction === 'next') {
        return (prevIndex + 1) % themes.length;
      } else {
        return prevIndex === 0 ? themes.length - 1 : prevIndex - 1;
      }
    });
  };
  
  // No auto-rotation
  
  // Track animation state and add body class for full-screen effect
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      document.body.classList.add('portal-open');
    } else {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match this with animation duration
      
      document.body.classList.remove('portal-open');
      return () => clearTimeout(timeout);
    }
    
    return () => {
      document.body.classList.remove('portal-open');
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen p-0 border-none bg-black/70 [&>button]:hidden">
        <DialogTitle className="sr-only">Theme Selection Portal</DialogTitle>
        
        {/* Scattered magical particles throughout the whole background */}
        {isAnimating && Array(60).fill(0).map((_, i) => {
          // Randomly distribute particles across the entire screen
          const posX = Math.random() * 100; // % of viewport width
          const posY = Math.random() * 100; // % of viewport height
          const size = Math.random() * 4 + 1;
          const delay = Math.random() * 10;
          const duration = Math.random() * 10 + 8;
          
          // Generate random float directions for animation
          const floatX = (Math.random() * 60) - 30; // -30px to +30px
          const floatY = (Math.random() * 60) - 30;
          const floatX2 = (Math.random() * 60) - 30;
          const floatY2 = (Math.random() * 60) - 30;
          const floatX3 = (Math.random() * 60) - 30;
          const floatY3 = (Math.random() * 60) - 30;
          
          return (
            <div
              key={`bg-particle-${i}`}
              className="fixed"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                background: i % 3 === 0 ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 140, 0, 0.5)',
                borderRadius: '50%',
                boxShadow: '0 0 5px rgba(255, 165, 0, 0.5)',
                filter: 'blur(1px)',
                opacity: Math.random() * 0.5 + 0.2,
                animation: `floatParticle ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                zIndex: 5,
                // Add custom properties for the animation
                ['--float-x' as string]: `${floatX}px`,
                ['--float-y' as string]: `${floatY}px`,
                ['--float-x2' as string]: `${floatX2}px`,
                ['--float-y2' as string]: `${floatY2}px`,
                ['--float-x3' as string]: `${floatX3}px`,
                ['--float-y3' as string]: `${floatY3}px`
              }}
            />
          );
        })}
        
        {/* Main centered container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Close button - single button positioned in top right */}
          <button
            onClick={() => onOpenChange(false)}
            className={cn(
              "fixed right-8 top-8 z-50 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-all duration-300",
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95",
              "transition-all duration-500 delay-700"
            )}
            aria-label="Close portal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* External particles that float around outside the portal */}
          {isAnimating && Array(30).fill(0).map((_, i) => {
            const angle = Math.random() * 360;
            const distance = Math.random() * 200 + 420; // Position well outside the portal ring
            const posX = window.innerWidth / 2 + distance * Math.cos(angle * Math.PI/180);
            const posY = window.innerHeight / 2 + distance * Math.sin(angle * Math.PI/180);
            const size = Math.random() * 6 + 2;
            
            return (
              <div
                key={`external-${i}`}
                className="fixed"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${posX}px`,
                  top: `${posY}px`,
                  background: i % 3 === 0 ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 140, 0, 0.6)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  filter: 'blur(1px)',
                  opacity: Math.random() * 0.5 + 0.3,
                  animation: `floatParticle ${Math.random() * 15 + 10}s linear infinite`,
                  animationDelay: `${-Math.random() * 10}s`,
                  zIndex: 10
                }}
              />
            );
          })}
          
          {/* Larger energy orbs orbiting the portal */}
          {isAnimating && Array(5).fill(0).map((_, i) => {
            // These orbs will orbit the portal
            const orbitDistance = 500 + i * 50; // Different orbit distances
            const orbitSpeed = 20 + i * 5; // Different orbit speeds
            const size = Math.random() * 15 + 15; // Larger sizes for orbs
            const startAngle = i * 72; // Evenly spaced around circle (360 / 5 = 72 degrees)
            
            return (
              <div
                key={`orb-${i}`}
                className="absolute"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: '50%',
                  top: '50%',
                  background: `radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,165,0,0.6) 60%, rgba(255,140,0,0.4) 80%, transparent 100%)`,
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(255, 165, 0, 0.8)',
                  filter: 'blur(2px)',
                  opacity: 0.7,
                  animation: `orbitPortal ${orbitSpeed}s linear infinite`,
                  animationDelay: `${-i * 2}s`,
                  zIndex: 8,
                  transform: `rotate(${startAngle}deg)`,
                  ['--orbit-distance' as string]: `${orbitDistance}px`
                }}
              />
            );
          })}

          {/* Random bursting particles from the portal */}
          {isAnimating && Array(25).fill(0).map((_, i) => {
            // Particles burst from center of portal
            const angle = Math.random() * Math.PI * 2; // Random angle in radians
            const burstX = Math.cos(angle) * (Math.random() * 600 + 200); // Random distance in direction of angle
            const burstY = Math.sin(angle) * (Math.random() * 600 + 200);
            
            return (
              <div
                key={`burst-${i}`}
                className="absolute"
                style={{
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: i % 2 === 0 
                    ? 'rgba(255, 215, 0, 0.8)' 
                    : 'rgba(255, 140, 0, 0.8)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(255, 165, 0, 0.7)',
                  filter: 'blur(1px)',
                  opacity: 1,
                  animation: `burstOutward ${Math.random() * 3 + 2}s ease-out infinite ${i * 0.3}s`,
                  zIndex: 15,
                  // Custom properties for the animation
                  ['--burst-x' as string]: `${burstX}px`,
                  ['--burst-y' as string]: `${burstY}px`
                }}
              />
            );
          })}
          
          {/* Portal Background Effect - Responsive circular ring with cinematic Doctor Strange fire animation */}
          <div 
            className={cn(
              "flex items-center justify-center transition-all duration-1000 w-[92vw] h-[92vw] max-w-[320px] max-h-[320px] sm:max-w-[480px] sm:max-h-[480px] md:max-w-[600px] md:max-h-[600px] lg:max-w-[700px] lg:max-h-[700px] rounded-full relative overflow-visible aspect-square",
              isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
            style={{
              background: "transparent",
              boxShadow: "0 0 55px 15px rgba(255, 165, 0, 0.85), 0 0 110px 25px rgba(255, 100, 0, 0.55), inset 0 0 45px 12px rgba(255, 140, 0, 0.65)",
              transform: isAnimating 
                ? "scale(1) rotate(360deg)" 
                : "scale(0) rotate(0deg)",
              transition: "transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.2s ease",
              filter: "drop-shadow(0 0 16px rgba(255, 140, 0, 0.75))"
            }}
          >
            {/* Portal sparks - overflow-visible to let sparks shoot far outside the ring! */}
            <div className="absolute w-full h-full rounded-full overflow-visible">
              {/* Fire effect layers - enhanced with more dynamic gradients */}
              <div className="absolute inset-0 rounded-full" 
                style={{
                  background: "linear-gradient(90deg, rgba(255,140,0,0.8) 0%, rgba(255,165,0,0.8) 50%, rgba(255,140,0,0.8) 100%)",
                  opacity: 0.8,
                  animation: "fireBreathing 3s ease-in-out infinite alternate",
                  boxShadow: "0 0 40px 15px rgba(255, 140, 0, 0.4)"
                }}
              />
              <div className="absolute inset-0 rounded-full" 
                style={{
                  background: "linear-gradient(180deg, rgba(255,69,0,0.6) 0%, rgba(255,165,0,0.7) 50%, rgba(255,69,0,0.6) 100%)",
                  opacity: 0.6,
                  animation: "fireBreathing 4s ease-in-out infinite alternate-reverse",
                  filter: "contrast(1.2) brightness(1.1)"
                }}
              />
              <div className="absolute inset-0 rounded-full" 
                style={{
                  background: "conic-gradient(from 0deg, transparent, rgba(255,215,0,0.8), rgba(255,165,0,0.7), transparent)",
                  opacity: 0.5,
                  animation: "spin 8s linear infinite"
                }}
              />
              {/* Additional fiery ring for more depth */}
              <div className="absolute inset-0 rounded-full" 
                style={{
                  background: "conic-gradient(from 180deg, rgba(255,69,0,0.8), rgba(255,140,0,0.7), rgba(255,215,0,0.9), rgba(255,140,0,0.7), rgba(255,69,0,0.8))",
                  opacity: 0.6,
                  animation: "spin-reverse 12s linear infinite",
                  filter: "blur(2px)"
                }}
              />
              
              {/* Spark ring effects - multiple layers for enhanced circular effect */}
              <div className="absolute w-full h-full" style={{
                background: "conic-gradient(from 0deg, transparent, rgba(255, 140, 0, 0.8), rgba(255, 100, 0, 0.6), transparent)",
                animation: "spin 8s linear infinite"
              }}></div>
              
              {/* Golden Plasma Ring Layer 1 (Outer - clockwise fast organic swirl) */}
              <div className="absolute inset-[-4px] rounded-full" style={{
                background: "conic-gradient(from 0deg, rgba(255, 140, 0, 0.95), rgba(255, 200, 0, 0.75), rgba(255, 69, 0, 0.95), rgba(255, 140, 0, 0.95))",
                animation: "spin 5s linear infinite, fireWave 4s ease-in-out infinite alternate",
                filter: "blur(3px)",
                opacity: 0.8
              }}></div>

              {/* Golden Plasma Ring Layer 2 (Middle - counter-clockwise super fast organic swirl) */}
              <div className="absolute inset-[-2px] rounded-full" style={{
                background: "conic-gradient(from 180deg, rgba(255, 215, 0, 0.95), rgba(255, 100, 0, 0.75), rgba(255, 255, 255, 0.9), rgba(255, 215, 0, 0.95))",
                animation: "spin-reverse 3s linear infinite, fireWave 5s ease-in-out infinite alternate-reverse",
                filter: "blur(2px)",
                opacity: 0.85
              }}></div>

              {/* Golden Plasma Ring Layer 3 (Inner - clockwise medium organic swirl) */}
              <div className="absolute inset-[0px] rounded-full" style={{
                background: "conic-gradient(from 90deg, rgba(255, 69, 0, 0.9), rgba(255, 165, 0, 0.75), rgba(255, 140, 0, 0.9), rgba(255, 69, 0, 0.9))",
                animation: "spin 8s linear infinite, fireWave 3s ease-in-out infinite alternate",
                filter: "blur(2.5px)",
                opacity: 0.75
              }}></div>
              
              {/* Running particles animation around circle */}
              {isAnimating && Array(20).fill(0).map((_, i) => {
                const startAngle = (i * 360 / 20); // Evenly spaced starting points
                
                return (
                  <div
                    key={`runner-${i}`}
                    className="absolute"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: i % 2 === 0 ? "rgba(255, 215, 0, 0.9)" : "rgba(255, 165, 0, 0.9)",
                      filter: "blur(1px)",
                      boxShadow: "0 0 8px rgba(255, 165, 0, 0.7)",
                      animation: `runAroundCircle ${3 + i % 3}s linear infinite`,
                      animationDelay: `${i * 0.15}s`,
                      transformOrigin: "center",
                      left: "calc(50% - 4px)",
                      top: "calc(0% - 4px)"
                    }}
                  />
                );
              })}
              
              {/* Trailing chaser particles */}
              {isAnimating && Array(20).fill(0).map((_, i) => {
                return (
                  <div
                    key={`chaser-${i}`}
                    className="absolute"
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: i % 2 === 0 ? "rgba(255, 165, 0, 0.7)" : "rgba(255, 140, 0, 0.7)",
                      filter: "blur(1px)",
                      boxShadow: "0 0 5px rgba(255, 140, 0, 0.5)",
                      animation: `runAroundCircle ${3 + i % 3}s linear infinite`,
                      animationDelay: `${i * 0.15 + 0.1}s`, // Slight delay after main particle
                      transformOrigin: "center",
                      left: "calc(50% - 2px)",
                      top: "calc(0% - 2px)"
                    }}
                  />
                );
              })}
              
              {/* Energy pulses flowing around the circle */}
              {isAnimating && Array(8).fill(0).map((_, i) => {
                return (
                  <div
                    key={`pulse-${i}`}
                    className="absolute w-full h-full"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '25px',
                        height: '25px',
                        background: 'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,165,0,0.6) 60%, transparent 100%)',
                        borderRadius: '50%',
                        filter: 'blur(2px)',
                        boxShadow: '0 0 15px rgba(255,165,0,0.8)',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `runAroundCircle ${6 + i % 4}s linear infinite`,
                        animationDelay: `${i * 0.75}s`
                      }}
                    />
                  </div>
                );
              })}
              
              {/* Continuous energy flow around the circle */}
              <div className="absolute w-full h-full">
                <div className="absolute w-full h-full rounded-full overflow-visible"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(255,165,0,0.7) 15%, rgba(255,215,0,0.9) 20%, rgba(255,165,0,0.7) 25%, transparent 40%)',
                    animation: 'spin 4s linear infinite'
                  }}
                />
              </div>
              
              {/* Lightning arcs that travel around the circle */}
              {isAnimating && Array(3).fill(0).map((_, i) => {
                return (
                  <div
                    key={`arc-${i}`}
                    className="absolute w-full h-full"
                    style={{
                      animation: `spin ${10 + i * 2}s linear infinite`,
                      animationDelay: `${i * 3}s`,
                      opacity: 0.6
                    }}
                  >
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        width: '20px',
                        height: '20px',
                        background: 'radial-gradient(circle, rgba(255,235,120,0.95) 0%, rgba(255,165,0,0.7) 60%, transparent 100%)',
                        filter: 'blur(1.5px)',
                        boxShadow: '0 0 14px rgba(255,215,0,0.9)',
                        transform: 'translateX(-50%)',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                );
              })}
              
              {/* Additional sparks - more evenly distributed for perfect circle */}
              {isAnimating && Array(100).fill(0).map((_, i) => {
                const angle = (i / 100) * 360; // Distribute perfectly evenly around the circle
                const randomOffset = Math.random() * 3; // Smaller random offset for more circular look
                const distance = 48 + randomOffset; // Position sparks around the edge
                const posX = 50 + distance * Math.cos(angle * Math.PI/180);
                const posY = 50 + distance * Math.sin(angle * Math.PI/180);
                
                const sparkSize = Math.random() * 4 + 2;
                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: `${sparkSize}px`,
                      height: `${sparkSize}px`,
                      left: `${posX}%`,
                      top: `${posY}%`,
                      background: i % 2 === 0 ? 'rgba(255, 215, 0, 0.95)' : 'rgba(255, 140, 0, 0.9)',
                      filter: 'blur(0.5px)',
                      animation: `spark ${Math.random() * 1.5 + 0.5}s ease-out infinite`,
                      boxShadow: '0 0 6px rgba(255, 165, 0, 0.8)'
                    }}
                  />
                );
              })}
              
              {/* 120 movie-grade Doctor Strange radial sparks spraying outward from the portal ring */}
              {isAnimating && Array(120).fill(0).map((_, i) => {
                const angle = (i / 120) * 360; 
                const randomOffset = Math.random() * 6 - 3;
                const distance = 48 + randomOffset; 
                const posX = 50 + distance * Math.cos(angle * Math.PI/180);
                const posY = 50 + distance * Math.sin(angle * Math.PI/180);
                
                // Radial outward direction (directly away from center)
                const radialAngle = angle + (Math.random() * 24 - 12);
                const velocity = Math.random() * 160 + 80;
                const dx = Math.cos(radialAngle * Math.PI / 180) * velocity;
                const dy = Math.sin(radialAngle * Math.PI / 180) * velocity;
                const dr = Math.random() * 360 - 180;
                const duration = Math.random() * 0.7 + 0.3;
                const delay = Math.random() * 1.5;
                const size = Math.random() * 3 + 2;

                return (
                  <div
                    key={`strange-spark-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${posX}%`,
                      top: `${posY}%`,
                      background: i % 3 === 0 
                        ? 'rgba(255, 235, 120, 1)' 
                        : i % 3 === 1 
                        ? 'rgba(255, 145, 0, 1)'   
                        : 'rgba(255, 65, 0, 1)',   
                      boxShadow: '0 0 10px rgba(255, 165, 0, 1), 0 0 18px rgba(255, 69, 0, 0.8)',
                      filter: 'blur(0.5px)',
                      opacity: 0,
                      animation: `strangeSpark ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
                      animationDelay: `${delay}s`,
                      ['--dx' as string]: `${dx}px`,
                      ['--dy' as string]: `${dy}px`,
                      ['--dr' as string]: `${dr}deg`
                    }}
                  />
                );
              })}
              
              {/* Circular pattern of tiny sparkling dots */}
              {isAnimating && Array(60).fill(0).map((_, i) => {
                const angle = (i / 60) * 360; 
                const innerCircle = 45 + Math.random() * 2; 
                const outerCircle = 51 + Math.random() * 2; 
                
                const distance = i % 2 === 0 ? innerCircle : outerCircle;
                const posX = 50 + distance * Math.cos(angle * Math.PI/180);
                const posY = 50 + distance * Math.sin(angle * Math.PI/180);
                
                return (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute"
                    style={{
                      width: `${Math.random() * 3 + 2}px`,
                      height: `${Math.random() * 3 + 2}px`,
                      left: `${posX}%`,
                      top: `${posY}%`,
                      background: i % 3 === 0 ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 165, 0, 0.9)', 
                      borderRadius: '50%',
                      filter: 'blur(0.5px)',
                      boxShadow: '0 0 3px rgba(255, 165, 0, 0.8)',
                      animation: `flicker ${Math.random() * 2 + 1}s ease-in-out infinite alternate`
                    }}
                  />
                );
              })}
            </div>
            
            {/* Fiery Dimensional Gateway Center - Perfect circular window showing the active planetary dimension! */}
            <div 
              className="absolute inset-0 m-auto rounded-full overflow-hidden flex items-center justify-center bg-black transition-all duration-1000"
              style={{
                width: "90%",
                height: "90%",
                boxShadow: "inset 0 0 50px 15px rgba(255, 140, 0, 0.6)",
                aspectRatio: "1 / 1",
                border: "1px solid rgba(255, 140, 0, 0.4)"
              }}
            >
              {/* Fiery Dimensional Gateway Center - Perfect circular window showing the active planetary dimension! */}
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                {/* Space background layer */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, rgba(10, 8, 28, 0.95) 0%, rgba(2, 1, 6, 1) 100%)`
                  }}
                />
                
                {/* Swirling Cosmic Nebula - A beautiful slowly rotating blurred conic gradient */}
                <div 
                  className="absolute w-full h-full rounded-full transition-all duration-1000 animate-spin"
                  style={{
                    animation: "spin 120s linear infinite",
                    background: themes[currentIndex].id === 'dark' 
                      ? 'conic-gradient(from 0deg, rgba(30, 64, 175, 0.25), rgba(16, 185, 129, 0.15), rgba(30, 64, 175, 0.25))' 
                      : themes[currentIndex].id === 'earth-838'
                      ? 'radial-gradient(circle, rgba(209, 213, 219, 0.1) 0%, transparent 80%)'
                      : 'conic-gradient(from 180deg, rgba(147, 51, 234, 0.25), rgba(236, 72, 153, 0.15), rgba(147, 51, 234, 0.25))',
                    filter: "blur(45px)"
                  }}
                />

                {/* 30 Tiny Sparkling Cosmic Stars */}
                {isAnimating && Array(30).fill(0).map((_, i) => {
                  const starSize = Math.random() * 2 + 1;
                  const starX = Math.random() * 80 + 10;
                  const starY = Math.random() * 80 + 10;
                  const starDelay = Math.random() * 3;
                  const starDuration = Math.random() * 3 + 2;
                  
                  return (
                    <div
                      key={`portal-star-${i}`}
                      className="absolute rounded-full bg-white/70"
                      style={{
                        width: `${starSize}px`,
                        height: `${starSize}px`,
                        left: `${starX}%`,
                        top: `${starY}%`,
                        boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                        animation: `flicker ${starDuration}s ease-in-out infinite alternate`,
                        animationDelay: `${starDelay}s`
                      }}
                    />
                  );
                })}
                
                {/* Cybernetic High-Tech Grid overlay for Earth-X */}
                {themes[currentIndex].id === 'Earth-X' && (
                  <div 
                    className="absolute inset-0 rounded-full opacity-35 transition-opacity duration-1000"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(147, 51, 234, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.12) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      backgroundPosition: 'center',
                      maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
                      WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)'
                    }}
                  />
                )}
                
                {/* Gateway Light Fog & Aura Overlay */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none" 
                  style={{
                    background: themes[currentIndex].id === 'dark' 
                      ? 'radial-gradient(circle, transparent 40%, rgba(59, 130, 246, 0.15) 70%, rgba(59, 130, 246, 0.35) 100%)' 
                      : themes[currentIndex].id === 'earth-838'
                      ? 'radial-gradient(circle, transparent 40%, rgba(156, 163, 175, 0.08) 70%, rgba(156, 163, 175, 0.2) 100%)'
                      : 'radial-gradient(circle, transparent 40%, rgba(147, 51, 234, 0.15) 70%, rgba(147, 51, 234, 0.35) 100%)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3D Carousel Theme Selection Cards */}
          <div 
            className={cn(
              "absolute carousel-container z-20",
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95",
              "transition-all duration-500 delay-500"
            )}
            style={{
              position: "absolute",
              zIndex: 30,
              width: "100%",
              maxWidth: "700px",
              height: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Render all theme cards with appropriate positioning */}
            {themes.map((theme, index) => {
              // Calculate the position in carousel (only active, prev, next for 3 cards)
              const position = (() => {
                if (index === currentIndex) return 'active';
                if (index === (currentIndex + 1) % themes.length) return 'next';
                if (index === (currentIndex - 1 + themes.length) % themes.length) return 'prev';
                // Since we only have 3 cards, there should be no 'back' position
                return 'active'; // This shouldn't happen with 3 cards
              })();
              
              return (
                <div 
                  key={theme.id}
                  onClick={() => {
                    if (position === 'active' && !theme.disabled) {
                      theme.onClick?.();
                    } else if (position === 'next') {
                      navigateCarousel('next');
                    } else if (position === 'prev') {
                      navigateCarousel('prev');
                    }
                  }}
                  className={cn(
                    `backdrop-blur-sm overflow-hidden group absolute carousel-card rounded-full`,
                    position === 'active' ? 'cursor-pointer' : position === 'prev' || position === 'next' ? 'cursor-pointer' : 'cursor-default',
                    theme.disabled && position === 'active' ? 'cursor-not-allowed' : '',
                    `carousel-card ${position}`
                  )}
                  style={{
                    width: '180px',
                    height: '180px',
                    background: theme.id === 'dark' 
                      ? 'radial-gradient(circle at 30% 30%, #1e40af, #1e3a8a, #0f172a)' 
                      : theme.id === 'earth-838'
                      ? 'radial-gradient(circle at 30% 30%, #e5e7eb, #d1d5db, #9ca3af)'
                      : 'radial-gradient(circle at 30% 30%, #7c3aed, #5b21b6, #312e81)',
                    boxShadow: theme.id === 'dark' 
                      ? '0 0 30px rgba(59, 130, 246, 0.4), inset -10px -10px 20px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(59, 130, 246, 0.1)' 
                      : theme.id === 'earth-838'
                      ? '0 0 30px rgba(156, 163, 175, 0.4), inset -10px -10px 20px rgba(0,0,0,0.1), inset 10px 10px 20px rgba(255,255,255,0.7)'
                      : '0 0 30px rgba(147, 51, 234, 0.4), inset -10px -10px 20px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(147, 51, 234, 0.1)',
                    border: '2px solid',
                    borderColor: theme.id === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 
                               theme.id === 'earth-838' ? 'rgba(156, 163, 175, 0.5)' : 
                               'rgba(147, 51, 234, 0.5)'
                  }}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* Earth-like surface patterns */}
                    {theme.id === 'dark' && (
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        {/* Ocean base */}
                        <div className="absolute inset-0 bg-gradient-radial from-blue-600 via-blue-700 to-blue-900 rounded-full" />
                        {/* Continent patterns - strictly circular shapes for organic beauty without rectangles */}
                        <div className="absolute top-6 left-8 w-8 h-8 bg-green-700/90 rounded-full" />
                        <div className="absolute top-12 right-12 w-6 h-6 bg-green-600/80 rounded-full" />
                        <div className="absolute bottom-8 left-10 w-10 h-10 bg-green-800/90 rounded-full" />
                        <div className="absolute bottom-12 right-8 w-7 h-7 bg-green-700/80 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-600/70 rounded-full" />
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500/60 rounded-full" />
                        {/* Cloud patterns */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(ellipse at 75% 70%, rgba(255,255,255,0.2) 0%, transparent 30%)'
                        }} />
                        {/* Atmospheric glow */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
                        }} />
                      </div>
                    )}
                    
                    {theme.id === 'earth-838' && (
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        {/* Neumorphic Earth base */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'radial-gradient(circle at 30% 30%, #f3f4f6, #e5e7eb, #d1d5db)'
                        }} />
                        {/* Soft relief continents - strictly circular shapes for organic beauty without rectangles */}
                        <div className="absolute top-6 left-8 w-8 h-8 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.8), rgba(107, 114, 128, 0.6))',
                            boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.8)'
                          }} />
                        <div className="absolute top-12 right-12 w-6 h-6 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.7), rgba(107, 114, 128, 0.5))',
                            boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.8)'
                          }} />
                        <div className="absolute bottom-8 left-10 w-10 h-10 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.8), rgba(107, 114, 128, 0.6))',
                            boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.8)'
                          }} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.6), rgba(107, 114, 128, 0.4))',
                            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.8)'
                          }} />
                        {/* Soft atmospheric highlight */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)'
                        }} />
                      </div>
                    )}
                    
                    {theme.id === 'Earth-X' && (
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        {/* Mystical future Earth base */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'radial-gradient(circle at 30% 30%, #7c3aed, #5b21b6, #312e81)'
                        }} />
                        {/* Glowing mystical continents - strictly circular shapes for organic beauty without rectangles */}
                        <div className="absolute top-6 left-8 w-8 h-8 bg-gradient-to-br from-pink-500/80 to-purple-600/80 rounded-full blur-[1px]" 
                          style={{ filter: 'blur(1px) drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))' }} />
                        <div className="absolute top-12 right-12 w-6 h-6 bg-gradient-to-br from-cyan-500/70 to-purple-500/70 rounded-full blur-[1px]"
                          style={{ filter: 'blur(1px) drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' }} />
                        <div className="absolute bottom-8 left-10 w-10 h-10 bg-gradient-to-br from-purple-500/80 to-pink-600/80 rounded-full blur-[1px]"
                          style={{ filter: 'blur(1px) drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))' }} />
                        <div className="absolute bottom-12 right-8 w-7 h-7 bg-gradient-to-br from-indigo-500/70 to-purple-600/70 rounded-full blur-[1px]"
                          style={{ filter: 'blur(1px) drop-shadow(0 0 6px rgba(99, 102, 241, 0.6))' }} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-400/60 to-pink-500/60 rounded-full blur-[1px]"
                          style={{ filter: 'blur(1px) drop-shadow(0 0 10px rgba(168, 85, 247, 0.6))' }} />
                        {/* Mystical energy swirls */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.3) 30%, transparent 60%, rgba(236, 72, 153, 0.3) 90%, transparent)',
                          animation: 'spin 8s linear infinite'
                        }} />
                        {/* Future tech grid overlay */}
                        <div className="absolute inset-0 rounded-full" style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 60%)'
                        }} />
                      </div>
                    )}

                    {/* Earth name and description overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <h3 className={`${theme.textColor} font-bold text-lg drop-shadow-lg text-center leading-tight`}>{theme.name}</h3>
                      <p className={`${theme.subtitleColor} text-xs mt-1 drop-shadow-md text-center px-2 leading-tight`}>{theme.description}</p>
                    </div>
                    
                    {/* Orbital ring effect */}
                    <div className="absolute inset-0 rounded-full border border-white/20" style={{
                      transform: 'rotateX(75deg) rotateY(10deg)',
                      borderStyle: 'dashed',
                      borderWidth: '1px',
                      opacity: 0.4
                    }} />
                    
                    {/* Globe highlight effect */}
                    <div className="absolute top-2 left-4 w-8 h-8 rounded-full" style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)',
                      filter: 'blur(2px)'
                    }} />
                    
                    {/* Action button overlay - appears on hover or active state */}
                    <div className={cn(
                      "absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300",
                      position === 'active' ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    )}>
                      <button 
                        disabled={theme.disabled}
                        className={cn(
                          "bg-gradient-to-r text-white py-1 px-3 rounded-full text-xs font-medium hover:scale-105 hover:brightness-110 transition-all duration-300",
                          theme.id === 'dark' ? "from-blue-600 to-blue-500" :
                          theme.id === 'earth-838' ? "from-gray-600 to-gray-500" :
                          "from-purple-600 to-purple-500",
                          theme.disabled ? 'opacity-70' : ''
                        )}
                      >
                        {theme.buttonText}
                      </button>
                    </div>
                  </div>
                  {theme.badge && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs py-1 px-2 rounded-full z-20">
                      {theme.badge}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Carousel Controls */}
            <div className="carousel-controls">
              <button 
                onClick={() => navigateCarousel('prev')} 
                className="w-10 h-10 rounded-full bg-orange-600/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Previous theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="text-orange-200 text-xs font-bold">{currentIndex + 1}/{themes.length}</span>
              </div>
              
              <button 
                onClick={() => navigateCarousel('next')} 
                className="w-10 h-10 rounded-full bg-orange-600/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Next theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Portal instructions */}
          <div 
            className={cn(
              "fixed text-center text-white z-50 w-full bottom-16",
              isAnimating ? "opacity-100" : "opacity-0",
              "transition-opacity duration-500 delay-700"
            )}
          >
            <p className="text-xl font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-wide">Choose your dimension</p>
            <p className="text-sm text-orange-200 mt-1">Click outside or ESC to close the portal</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
