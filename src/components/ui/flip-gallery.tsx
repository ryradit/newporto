'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageItem {
  title: string;
  url: string;
}

const images: ImageItem[] = [
  { title: 'Focus & Technical Execution', url: '/imagess/foto2.jpg' },
  { title: 'System Architecture Design', url: '/myphoto2.jpg' },
  { title: 'Exploring Creative Innovations', url: '/myphoto3.jpg' },
  { title: 'Interactive User Interface R&D', url: '/myphoto4.jpg' },
  { title: 'Continuous Growth & Learning', url: '/myphoto5.jpg' }
];

const FLIP_SPEED = 750;
const flipTiming = { duration: FLIP_SPEED, iterations: 1 };

// flip down
const flipAnimationTop = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' }
];
const flipAnimationBottom = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' }
];

// flip up
const flipAnimationTopReverse = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' }
];
const flipAnimationBottomReverse = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' }
];

export function FlipGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uniteRef = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // initialise first image once
  useEffect(() => {
    if (!containerRef.current) return;
    uniteRef.current = Array.from(containerRef.current.querySelectorAll<HTMLElement>('.unite'));
    defineFirstImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        updateIndex(1);
      }, 5000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isHovered, currentIndex]);

  const defineFirstImg = () => {
    if (!containerRef.current) return;
    uniteRef.current = Array.from(containerRef.current.querySelectorAll<HTMLElement>('.unite'));
    uniteRef.current.forEach(setActiveImage);
  };

  const setActiveImage = (el: HTMLElement) => {
    el.style.backgroundImage = `url('${images[currentIndex].url}')`;
  };

  const updateGallery = (nextIndex: number, isReverse = false) => {
    const gallery = containerRef.current;
    if (!gallery) return;

    // determine direction animation arrays
    const topAnim = isReverse ? flipAnimationTopReverse : flipAnimationTop;
    const bottomAnim = isReverse
      ? flipAnimationBottomReverse
      : flipAnimationBottom;

    const topElement = gallery.querySelector<HTMLElement>('.overlay-top');
    const bottomElement = gallery.querySelector<HTMLElement>('.overlay-bottom');
    
    if (topElement && bottomElement) {
      topElement.animate(topAnim, flipTiming);
      bottomElement.animate(bottomAnim, flipTiming);
    }

    // update images with slight delay so animation looks continuous
    uniteRef.current.forEach((el, idx) => {
      const delay =
        (isReverse && (idx !== 1 && idx !== 2)) ||
        (!isReverse && (idx === 1 || idx === 2))
          ? FLIP_SPEED - 200
          : 0;

      setTimeout(() => {
        el.style.backgroundImage = `url('${images[nextIndex].url}')`;
      }, delay);
    });
  };

  const updateIndex = (increment: number) => {
    const inc = Number(increment);
    const newIndex = (currentIndex + inc + images.length) % images.length;
    const isReverse = inc < 0;
    setCurrentIndex(newIndex);
    updateGallery(newIndex, isReverse);
  };

  const jumpToIndex = (targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    const isReverse = targetIndex < currentIndex;
    setCurrentIndex(targetIndex);
    updateGallery(targetIndex, isReverse);
  };

  return (
    <div 
      className='min-h-[560px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0D0D15]/95 to-[#05050A]/98 rounded-3xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden select-none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative tech background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center gap-2 mb-6 z-10">
        <Compass className={cn("text-purple-400 h-4 w-4", isPlaying && !isHovered && "animate-spin-slow")} />
        <span className="text-[11px] font-bold text-purple-400 tracking-[0.25em] uppercase">Visual Chronicle</span>
      </div>

      {/* Main Flip Container */}
      <div className='relative bg-black/40 border border-white/10 rounded-2xl p-3 shadow-inner shadow-black/80 z-10 group/gallery'>
        <div
          id='flip-gallery'
          ref={containerRef}
          className='relative w-[260px] h-[360px] md:w-[300px] md:h-[420px] text-center rounded-xl overflow-hidden'
          style={{ perspective: '1000px' }}
        >
          <div className='top unite bg-cover bg-no-repeat'></div>
          <div className='bottom unite bg-cover bg-no-repeat'></div>
          <div className='overlay-top unite bg-cover bg-no-repeat'></div>
          <div className='overlay-bottom unite bg-cover bg-no-repeat'></div>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-1 shadow-lg pointer-events-auto">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => jumpToIndex(idx)}
                className="p-1 focus:outline-none"
              >
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentIndex 
                      ? "w-4 bg-purple-400" 
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title & Index Display */}
      <div className="text-center mt-6 min-h-[50px] z-10 px-4 max-w-[320px]">
        <h4 className="text-white text-sm font-semibold tracking-wide animate-fade-in transition-all duration-300">
          {images[currentIndex].title}
        </h4>
        <p className="text-white/40 text-[11px] font-mono mt-1">
          {currentIndex + 1} <span className="text-purple-500/50">/</span> {images.length}
        </p>
      </div>

      {/* Controller Controls Bar */}
      <div className="mt-4 flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-2.5 shadow-lg z-10 backdrop-blur-md">
        <button
          type='button'
          onClick={() => updateIndex(-1)}
          title='Previous'
          className='text-white/60 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none'
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type='button'
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause Autoplay' : 'Start Autoplay'}
          className='text-purple-400 hover:text-purple-300 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none'
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          type='button'
          onClick={() => updateIndex(1)}
          title='Next'
          className='text-white/60 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none'
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* component-scoped styles that Tailwind cannot express */}
      <style>{`
        #flip-gallery::after {
          content: '';
          position: absolute;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(1px);
          width: 100%;
          height: 2px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 30;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        #flip-gallery > * {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background-size: 260px 360px;
          border-radius: 4px;
        }

        @media (min-width: 768px) {
          #flip-gallery > * {
            background-size: 300px 420px;
          }
        }

        .top,
        .overlay-top {
          top: 0;
          transform-origin: bottom;
          background-position: top;
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.05);
        }

        .bottom,
        .overlay-bottom {
          bottom: 0;
          transform-origin: top;
          background-position: bottom;
          border-top: 0.5px solid rgba(255, 255, 255, 0.05);
        }

        .unite {
          transition: filter 0.3s ease;
        }
      `}</style>
    </div>
  );
}
