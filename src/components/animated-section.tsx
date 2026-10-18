"use client";

import type { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType; // Use ElementType for more flexibility (e.g. 'div', 'section')
}

export function AnimatedSection({ children, className, id, as: Component = 'section' }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <Component
      ref={ref}
      id={id}
      className={cn(
        'opacity-0', // Initial state to hide before animation starts
        isVisible && 'animate-fade-in-up', // Animate when visible
        className
      )}
    >
      {children}
    </Component>
  );
}
