
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animated-section";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import { getProjectsByLanguage } from "@/lib/project-data";
import { getProjects } from "@/lib/supabase-cms";
import { MobileHeader } from "@/components/layout/mobile-header";
import Link from 'next/link';

// A utility function for class names
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// Generative Art Canvas Component
const GenerativeArtCanvas = ({ isHovered }: { isHovered: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        let lines: Line[] = [];
        const numLines = 30;

        class Line {
            x: number;
            y: number;
            speed: number;
            angle: number;
            length: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.speed = Math.random() * 0.5 + 0.1;
                this.angle = Math.random() * Math.PI * 2;
                this.length = Math.random() * 20 + 5;
            }
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                if (this.x < 0 || this.x > canvas!.width || this.y < 0 || this.y > canvas!.height) {
                    this.x = Math.random() * canvas!.width;
                    this.y = Math.random() * canvas!.height;
                }
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
                ctx.strokeStyle = `rgba(168, 85, 247, ${Math.random() * 0.3 + 0.1})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        const init = () => {
            lines = [];
            for (let i = 0; i < numLines; i++) {
                lines.push(new Line());
            }
        };

        const animate = () => {
            if (!ctx) return;
            
            if (isHovered) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                lines.forEach(line => {
                    line.update();
                    line.draw();
                });
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        
        canvas.width = 400;
        canvas.height = 400;
        init();
        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />;
};

// Gallery Card Component with 3D tilt effect
const ProjectCard = ({ project, index }: { project: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };
    
    const cardVariants = {
        offscreen: { y: 50, opacity: 0 },
        onscreen: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8, delay: index * 0.1 } }
    };

    const hasLiveDemo = project.liveLink !== "#";
    const hasSourceCode = project.codeLink !== "#" && project.codeLink !== project.liveLink;

    return (
        <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative flex flex-col h-[520px] w-full rounded-[2rem] bg-white dark:bg-[#121212] border border-border dark:border-white/5 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
        >
            {/* 3D Inner Container */}
            <div className="w-full h-full flex flex-col" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                
                {/* Image Section (Top 55%) */}
                <div className="relative h-[55%] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0">
                    <img 
                        src={project.imageUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src='/imagess/placeholder.jpg'; 
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    <GenerativeArtCanvas isHovered={isHovered} />
                    
                    {/* Top Left Text from Reference */}
                    <div className="absolute top-6 left-6 text-zinc-900 dark:text-white/90 text-sm font-serif tracking-wide" style={{ transform: "translateZ(20px)" }}>
                        {project.title.split(' - ')[0] || "Project Showcase"}
                    </div>
                </div>

                {/* Content Section (Bottom 45%) */}
                <div className="relative flex-grow flex flex-col justify-between p-6 md:p-8 bg-white dark:bg-[#121212] z-10">
                    <div style={{ transform: "translateZ(40px)" }}>
                        {/* Title using Serif font like reference */}
                        <h3 className="text-2xl md:text-3xl font-serif text-zinc-900 dark:text-white mb-2 leading-tight line-clamp-2">
                            {project.title.includes(' - ') ? project.title.split(' - ')[1] : project.title}
                        </h3>
                        {/* Description */}
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-6">
                            {project.description}
                        </p>
                        
                        {/* "Send a message" style buttons for Live Demo / Source Code */}
                        <div className="flex flex-wrap gap-3">
                            <Link 
                                href={`/projects/${project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 text-xs tracking-wide"
                            >
                                <span>View Details</span>
                            </Link>
                            {hasLiveDemo && (
                                <a 
                                    href={project.liveLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 text-xs tracking-wide"
                                >
                                    <span>Live Demo</span>
                                </a>
                            )}
                            {hasSourceCode && (
                                <a 
                                    href={project.codeLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 text-xs tracking-wide"
                                >
                                    <span>Source Code</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Footer / Tags row matching reference */}
                    <div 
                        className="flex items-center justify-between w-full mt-auto pt-4"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        <span className="text-xs text-zinc-500 font-medium">ryan.dev</span>
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 tracking-wider lowercase">
                            {project.tags.slice(0, 3).map((tag: string, i: number) => (
                                <span key={tag} className="flex items-center gap-2">
                                    <span>{tag}</span>
                                    {i < Math.min(project.tags.length, 3) - 1 && <span className="text-zinc-300 dark:text-zinc-600">✦</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export function ProjectsSection() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects(language);
        if (data && data.length > 0) {
          // Map CMS fields to component fields
          setProjects(data.map(p => ({
            ...p,
            imageUrl: p.image_url,
            imageHint: p.image_hint,
            liveLink: p.live_link,
            codeLink: p.code_link
          })));
        } else {
          setProjects(getProjectsByLanguage(language));
        }
      } catch (err) {
        setProjects(getProjectsByLanguage(language));
      }
    }
    load();
  }, [language]);

  return (
    <AnimatedSection id="projects" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <MobileHeader />
      <div className="container mx-auto px-4">
        <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            className="font-headline text-3xl md:text-5xl font-bold text-center text-primary mb-4"
        >
            {translate('projects.title', language)}
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
            className="text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-12"
        >
            A showcase of my work, combining creative design with technical excellence.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
