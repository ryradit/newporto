interface EducationItemProps {
  institution: string;
  location: string;
  degree: string;
  period: string;
  details: string[];
  institutionLogo?: string;
}

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function EducationItem({ institution, location, degree, period, details, institutionLogo }: EducationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-7 pb-8 group">
      <div className="absolute left-0 top-1.5 w-3 h-3 bg-foreground/60 rounded-full transform -translate-x-1/2 group-hover:scale-110 group-hover:bg-foreground transition-all duration-150"></div>
      <div className="absolute left-0 top-4 bottom-0 w-px bg-border transform -translate-x-1/2"></div>
      <div className="bg-card/70 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow transition-all duration-150 border border-border/60 hover:border-foreground/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted/40 border border-border/60">
            {institutionLogo ? (
              <Image
                src={institutionLogo}
                alt={`${institution} logo`}
                width={48}
                height={48}
                className="w-full h-full object-contain p-1.5"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-sm font-mono font-bold text-muted-foreground">
                  {institution.split(' ').map(word => word[0]).join('').slice(0, 2)}
                </div>
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-base font-semibold text-foreground tracking-tight mb-0.5 truncate">{institution}</h4>
            <div className="text-sm font-medium text-foreground/80 mb-2">{degree}</div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{location}</span>
              <span className="font-mono text-[11px] text-muted-foreground/80">{period}</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground transition-colors active:scale-95"
            aria-label={isExpanded ? 'Hide details' : 'Show details'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'mt-4 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li 
                key={index} 
                className="text-sm text-foreground/80 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0
                }}
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function EducationTimeline({ items }: { items: EducationItemProps[] }) {
  return (
    <div className="relative">
      {items.map((item, index) => (
        <EducationItem key={index} {...item} />
      ))}
    </div>
  );
}
