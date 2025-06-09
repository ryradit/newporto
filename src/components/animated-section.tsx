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
        'opacity-0 transform translate-y-10 transition-all duration-700 ease-out', // Initial state
        isVisible && 'opacity-100 translate-y-0', // Visible state
        className
      )}
    >
      {children}
    </Component>
  );
}
