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
      id: 'Earth-199999',
      name: 'Coming Soon',
      description: 'Future theme variant',
      background: 'bg-gradient-to-br from-purple-900 to-indigo-900',
      innerBackground: 'bg-purple-800/30',
      gradient: 'from-purple-600/10 to-indigo-600/20',
      buttonGradient: 'from-pink-500 to-rose-500',
      textColor: 'text-white',
      subtitleColor: 'text-purple-200',
      buttonText: 'Stay Tuned',
      disabled: true,
      badge: 'new earth'
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
      <DialogContent className="w-screen h-screen p-0 border-none bg-black/70">
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
          
          {/* Portal Background Effect - Single circular ring with enhanced fire animation */}
          <div 
            className={cn(
              "flex items-center justify-center transition-all duration-1000",
              isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
            style={{
              width: "800px", 
              height: "800px",
              borderRadius: "50%",
              background: "transparent",
              border: "20px solid rgba(255, 140, 0, 0.8)",
              boxShadow: "0 0 60px 15px rgba(255, 165, 0, 0.8), 0 0 120px 30px rgba(255, 100, 0, 0.6), 0 0 180px 60px rgba(255, 80, 0, 0.3), inset 0 0 30px 5px rgba(255, 165, 0, 0.5)",
              transform: isAnimating 
                ? "scale(1) rotate(360deg)" 
                : "scale(0) rotate(0deg)",
              transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease",
              position: "relative",
              overflow: "visible",
              aspectRatio: "1 / 1",
              filter: "drop-shadow(0 0 10px rgba(255, 140, 0, 0.5))"
            }}
          >
            {/* Portal sparks - only shown when animating */}
            <div className="absolute w-full h-full rounded-full overflow-hidden">
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
              
              {/* Additional circular particle rings */}
              <div className="absolute w-full h-full rounded-full" style={{
                border: "2px dotted rgba(255, 165, 0, 0.5)",
                animation: "spin 15s linear infinite"
              }}></div>
              
              <div className="absolute w-[102%] h-[102%] top-[-1%] left-[-1%] rounded-full" style={{
                border: "1px solid rgba(255, 215, 0, 0.3)",
                animation: "spin-reverse 20s linear infinite"
              }}></div>
              
              <div className="absolute w-[98%] h-[98%] top-[1%] left-[1%] rounded-full" style={{
                border: "1px dashed rgba(255, 165, 0, 0.4)",
                animation: "spin 12s linear infinite"
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
                        top: '-1px',
                        left: '50%',
                        width: '30px',
                        height: '8px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.9), transparent)',
                        filter: 'blur(2px)',
                        boxShadow: '0 0 10px rgba(255,215,0,0.8)',
                        transform: 'translateX(-50%)',
                        borderRadius: '4px'
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
                
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: `${Math.random() * 8 + 3}px`,
                      height: `${Math.random() * 10 + 8}px`,
                      left: `${posX}%`,
                      top: `${posY}%`,
                      background: `linear-gradient(to ${angle > 180 ? 'bottom' : 'top'}, rgba(255, 140, 0, 0.8), rgba(255, 180, 0, 0.9), rgba(255, 220, 0, 0.4), transparent)`,
                      borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                      transform: `rotate(${angle}deg)`,
                      filter: 'blur(1px)',
                      animation: `spark ${Math.random() * 2 + 0.5}s ease-out infinite`,
                      boxShadow: '0 0 5px rgba(255, 165, 0, 0.4)'
                    }}
                  />
                );
              })}
              
              {/* Outward radiating sparks like in Dr. Strange */}
              {isAnimating && Array(40).fill(0).map((_, i) => {
                const angle = Math.random() * 360;
                const distance = 48 + Math.random() * 30; // Sparks extend further outward
                const posX = 50 + distance * Math.cos(angle * Math.PI/180);
                const posY = 50 + distance * Math.sin(angle * Math.PI/180);
                const length = Math.random() * 60 + 30; // Much longer spark lines
                
                return (
                  <div
                    key={`outward-${i}`}
                    className="absolute"
                    style={{
                      width: `${Math.random() * 3 + 1}px`,
                      height: `${length}px`,
                      left: `${posX}%`,
                      top: `${posY}%`,
                      background: `linear-gradient(to ${angle > 180 ? 'bottom' : 'top'}, rgba(255, 165, 0, 0.9), rgba(255, 140, 0, 0.7), rgba(255, 69, 0, 0.4), transparent)`,
                      transform: `rotate(${angle}deg)`,
                      filter: 'blur(0.5px)',
                      opacity: Math.random() * 0.7 + 0.3,
                      transformOrigin: 'bottom',
                      animation: `spark ${Math.random() * 3 + 1}s ease-out infinite`,
                      boxShadow: '0 0 8px rgba(255, 140, 0, 0.6)'
                    }}
                  />
                );
              })}
              
              {/* Circular pattern of tiny sparkling dots */}
              {isAnimating && Array(60).fill(0).map((_, i) => {
                // Create perfect circles of sparkling dots
                const angle = (i / 60) * 360; // Evenly spaced around circle
                const innerCircle = 45 + Math.random() * 2; // Inner circle of dots
                const outerCircle = 51 + Math.random() * 2; // Outer circle of dots
                
                // Pick which circle this dot belongs to (inner or outer)
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
                      background: i % 3 === 0 ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 165, 0, 0.9)', // Alternate colors
                      borderRadius: '50%',
                      filter: 'blur(0.5px)',
                      boxShadow: '0 0 3px rgba(255, 165, 0, 0.8)',
                      animation: `flicker ${Math.random() * 2 + 1}s ease-in-out infinite alternate`
                    }}
                  />
                );
              })}
            </div>
            
            {/* Black center - Perfect circle with fiery edge glow */}
            <div 
              className="absolute inset-0 m-auto"
              style={{
                width: "90%",
                height: "90%",
                borderRadius: "50%",
                background: "black",
                boxShadow: "inset 0 0 40px 10px rgba(255, 140, 0, 0.4)",
                aspectRatio: "1 / 1",
                border: "1px solid rgba(255, 140, 0, 0.3)"
              }}
            ></div>
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
              // Calculate the position in carousel (active, prev, next, back)
              const position = (() => {
                if (index === currentIndex) return 'active';
                if (index === (currentIndex + 1) % themes.length) return 'next';
                if (index === (currentIndex - 1 + themes.length) % themes.length) return 'prev';
                return 'back';
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
                    `${theme.background} backdrop-blur-sm rounded-lg p-4 shadow-lg overflow-hidden h-[200px] w-[200px] group absolute carousel-card`,
                    position === 'active' ? 'cursor-pointer' : position === 'prev' || position === 'next' ? 'cursor-pointer' : 'cursor-default',
                    theme.disabled && position === 'active' ? 'cursor-not-allowed' : '',
                    `carousel-card ${position}`
                  )}
                >
                  <div className="p-2 h-full flex flex-col">
                    <div className={`${theme.innerBackground} h-3/4 rounded-full mb-4 overflow-hidden relative flex items-center justify-center border-2`} 
                      style={{
                        borderColor: theme.id === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 
                                   theme.id === 'earth-838' ? 'rgba(156, 163, 175, 0.5)' : 
                                   'rgba(147, 51, 234, 0.5)',
                        boxShadow: theme.id === 'dark' ? '0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)' :
                                 theme.id === 'earth-838' ? '0 0 20px rgba(156, 163, 175, 0.3), inset 10px 10px 20px rgba(0,0,0,0.1), inset -10px -10px 20px rgba(255,255,255,0.7)' :
                                 '0 0 20px rgba(147, 51, 234, 0.3), inset 0 0 15px rgba(147, 51, 234, 0.1)'
                      }}>
                      {/* Earth-like surface patterns */}
                      {theme.id === 'dark' && (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          {/* Continent-like patterns for Earth-616 */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-full" />
                          <div className="absolute top-2 left-4 w-8 h-6 bg-green-700/80 rounded-lg transform rotate-12" />
                          <div className="absolute top-6 right-3 w-6 h-4 bg-green-600/70 rounded transform -rotate-45" />
                          <div className="absolute bottom-4 left-6 w-10 h-5 bg-green-800/80 rounded-xl transform rotate-6" />
                          <div className="absolute bottom-6 right-2 w-7 h-4 bg-green-700/70 rounded transform rotate-12" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-green-600/60 rounded-2xl rotate-45" />
                          {/* Cloud patterns */}
                          <div className="absolute inset-0 rounded-full" style={{
                            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)'
                          }} />
                          {/* Atmospheric glow */}
                          <div className="absolute inset-0 rounded-full border border-blue-400/30" style={{
                            boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.3)'
                          }} />
                        </div>
                      )}
                      
                      {theme.id === 'earth-838' && (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          {/* Neumorphic Earth design */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-full" />
                          {/* Soft relief continents */}
                          <div className="absolute top-3 left-3 w-8 h-6 rounded-lg transform rotate-12"
                            style={{
                              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.8), rgba(107, 114, 128, 0.6))',
                              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.8)'
                            }} />
                          <div className="absolute top-6 right-2 w-6 h-4 rounded transform -rotate-45"
                            style={{
                              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.7), rgba(107, 114, 128, 0.5))',
                              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.8)'
                            }} />
                          <div className="absolute bottom-4 left-5 w-10 h-5 rounded-xl transform rotate-6"
                            style={{
                              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.8), rgba(107, 114, 128, 0.6))',
                              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.8)'
                            }} />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-8 rounded-2xl rotate-45"
                            style={{
                              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.6), rgba(107, 114, 128, 0.4))',
                              boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.8)'
                            }} />
                          {/* Soft atmospheric effect */}
                          <div className="absolute inset-0 rounded-full" style={{
                            background: 'radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                          }} />
                        </div>
                      )}
                      
                      {theme.id === 'Earth-199999' && (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          {/* Mystical future Earth */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-full" />
                          {/* Glowing mystical continents */}
                          <div className="absolute top-2 left-4 w-8 h-6 bg-gradient-to-br from-pink-500/80 to-purple-600/80 rounded-lg transform rotate-12 blur-[1px]" />
                          <div className="absolute top-6 right-3 w-6 h-4 bg-gradient-to-br from-cyan-500/70 to-purple-500/70 rounded transform -rotate-45 blur-[1px]" />
                          <div className="absolute bottom-4 left-6 w-10 h-5 bg-gradient-to-br from-purple-500/80 to-pink-600/80 rounded-xl transform rotate-6 blur-[1px]" />
                          <div className="absolute bottom-6 right-2 w-7 h-4 bg-gradient-to-br from-indigo-500/70 to-purple-600/70 rounded transform rotate-12 blur-[1px]" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-gradient-to-br from-purple-400/60 to-pink-500/60 rounded-2xl rotate-45 blur-[1px]" />
                          {/* Mystical energy swirls */}
                          <div className="absolute inset-0 rounded-full" style={{
                            background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.3) 30%, transparent 60%, rgba(236, 72, 153, 0.3) 90%, transparent)',
                            animation: 'spin 8s linear infinite'
                          }} />
                          <div className="absolute inset-0 rounded-full" style={{
                            background: 'radial-gradient(ellipse at 60% 40%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)'
                          }} />
                          {/* Future tech grid overlay */}
                          <div className="absolute inset-0 rounded-full border border-purple-400/40" style={{
                            boxShadow: 'inset 0 0 20px rgba(147, 51, 234, 0.4)'
                          }} />
                        </div>
                      )}

                      {/* Earth name and description overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <h3 className={`${theme.textColor} font-bold text-lg drop-shadow-lg`}>{theme.name}</h3>
                        <p className={`${theme.subtitleColor} text-xs mt-1 drop-shadow-md`}>{theme.description}</p>
                      </div>
                      
                      {/* Orbital ring effect */}
                      <div className="absolute inset-0 rounded-full border border-white/20" style={{
                        transform: 'rotateX(75deg)',
                        borderStyle: 'dashed',
                        borderWidth: '1px',
                        opacity: 0.3
                      }} />
                    </div>
                    <button 
                      disabled={theme.disabled}
                      className={`bg-gradient-to-r ${theme.buttonGradient} ${theme.textColor} py-2 px-4 rounded-md w-full mt-auto hover:scale-105 hover:brightness-110 transition-all duration-300 text-sm font-medium ${theme.disabled ? 'opacity-70' : ''}`}
                    >
                      {theme.buttonText}
                    </button>
                  </div>
                  {theme.badge && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs py-1 px-2 rounded-md">
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
