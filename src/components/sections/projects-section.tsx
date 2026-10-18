
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animated-section";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import { getProjectsByLanguage, webBuilderProjects } from "@/lib/project-data";
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
            className="group relative flex flex-col h-[490px] w-full rounded-2xl bg-card/60 hover:bg-card border border-border/60 hover:border-foreground/20 overflow-hidden shadow-sm hover:shadow transition-all duration-200"
        >
            {/* 3D Inner Container */}
            <div className="w-full h-full flex flex-col" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
                
                {/* Image Section (Top 55%) */}
                <div className="relative h-[52%] w-full overflow-hidden bg-muted shrink-0 border-b border-border/40">
                    <img 
                        src={project.imageUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src='/imagess/placeholder.svg'; 
                        }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-200"></div>
                    <GenerativeArtCanvas isHovered={isHovered} />
                    
                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border/60 rounded-md px-2 py-0.5 text-foreground text-[11px] font-mono tracking-tight" style={{ transform: "translateZ(15px)" }}>
                        {project.title.split(' - ')[0] || "Showcase"}
                    </div>
                </div>

                {/* Content Section (Bottom 48%) */}
                <div className="relative flex-grow flex flex-col justify-between p-6 bg-card/40 z-10">
                    <div style={{ transform: "translateZ(25px)" }}>
                        {/* Title */}
                        <h4 className="text-xl font-semibold text-foreground mb-1.5 leading-snug line-clamp-1 tracking-tight">
                            {project.title.includes(' - ') ? project.title.split(' - ')[1] : project.title}
                        </h4>
                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                            {project.description}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {!project.tags?.includes("Web Builder") && (
                                <Link 
                                    href={`/projects/${project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-medium transition-all duration-150 text-xs active:scale-95 shadow-sm"
                                >
                                    <span>Details</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                            {hasLiveDemo && (
                                <a 
                                    href={project.liveLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border/80 hover:border-foreground/30 bg-muted/40 hover:bg-muted text-foreground/80 hover:text-foreground transition-all duration-150 text-xs font-medium active:scale-95"
                                >
                                    <span>Live</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                            {hasSourceCode && (
                                <a 
                                    href={project.codeLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border/80 hover:border-foreground/30 bg-muted/40 hover:bg-muted text-foreground/80 hover:text-foreground transition-all duration-150 text-xs font-medium active:scale-95"
                                >
                                    <span>Code</span>
                                    <Github className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Footer / Tags row */}
                    <div 
                        className="flex items-center justify-between w-full mt-auto pt-3 border-t border-border/40"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        <span className="text-[11px] font-mono text-muted-foreground">ryan.dev</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground tracking-wider lowercase">
                            {project.tags.slice(0, 3).map((tag: string, i: number) => (
                                <span key={tag} className="flex items-center gap-1.5">
                                    <span>{tag}</span>
                                    {i < Math.min(project.tags.length, 3) - 1 && <span className="text-border">•</span>}
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
  const [visibleWebBuilderCount, setVisibleWebBuilderCount] = useState(6);

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
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-3xl md:text-5xl font-bold text-center text-foreground mb-3 tracking-tight"
        >
            {translate('projects.title', language)}
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-sm md:text-base text-center text-muted-foreground max-w-2xl mx-auto mb-10"
        >
            A curated selection of machine learning architectures, vision systems, and full-stack software.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* New Section for Web Builder Projects */}
        <div className="mt-20">
            <motion.h3 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="text-2xl md:text-3xl font-bold text-center text-foreground mb-3 tracking-tight"
            >
                Fullstack Web Projects
            </motion.h3>
            <motion.p
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="text-sm text-center text-muted-foreground max-w-2xl mx-auto mb-10"
            >
                Production deployments for global clients, focusing on usability, performance, and internationalization.
            </motion.p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webBuilderProjects.slice(0, visibleWebBuilderCount).map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
            </div>

            {visibleWebBuilderCount < webBuilderProjects.length && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setVisibleWebBuilderCount(prev => prev + 6)}
                        className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded-xl text-xs font-medium transition-all duration-150 active:scale-95 shadow-sm"
                    >
                        Show More
                    </button>
                </div>
            )}
        </div>
      </div>
    </AnimatedSection>
  );
}
