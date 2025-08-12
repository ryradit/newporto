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
    <div className="relative pl-8 pb-8 group">
      <div className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 group-hover:scale-125 transition-transform"></div>
      <div className="absolute left-0 top-4 bottom-0 w-px bg-primary/20 transform -translate-x-1/2"></div>
      <div className={`bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 ${isExpanded ? 'scale-[1.02]' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-background/50 border border-primary/10">
            {institutionLogo ? (
              <Image
                src={institutionLogo}
                alt={`${institution} logo`}
                width={64}
                height={64}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <div className="text-2xl font-bold text-primary/40">
                  {institution.split(' ').map(word => word[0]).join('').slice(0, 2)}
                </div>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-headline text-xl font-medium text-primary mb-1">{institution}</h3>
            <div className="text-lg font-medium text-foreground/90 mb-1">{degree}</div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">{location}</span>
              <span className="text-sm text-primary/80">{period}</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label={isExpanded ? 'Hide details' : 'Show details'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" />
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
