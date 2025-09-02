
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animated-section";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import { getProjectsByLanguage } from "@/lib/project-data";
import { MobileHeader } from "@/components/layout/mobile-header";

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
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speed = Math.random() * 0.5 + 0.1;
                this.angle = Math.random() * Math.PI * 2;
                this.length = Math.random() * 20 + 5;
            }
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
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
            className="group relative h-80 w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
        >
            <div 
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                className="absolute inset-4 flex flex-col justify-end p-6 rounded-lg overflow-hidden"
            >
                <img 
                    src={project.imageUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src='/imagess/placeholder.jpg'; 
                    }}
                />
                <GenerativeArtCanvas isHovered={isHovered} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="relative z-10">
                    <motion.h3 
                        style={{ transform: "translateZ(75px)" }}
                        className="text-xl font-bold text-white mb-1"
                    >
                        {project.title}
                    </motion.h3>
                    <motion.p
                        style={{ transform: "translateZ(75px)" }}
                        className="text-sm text-slate-400 mb-3 line-clamp-2"
                    >
                        {project.description}
                    </motion.p>

                    <div className="flex flex-wrap gap-2 mb-4" style={{ transform: "translateZ(75px)" }}>
                        {project.tags.slice(0, 3).map((tag: string) => (
                            <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="bg-black/50 hover:bg-black/70 text-white border border-white/10"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {project.tags.length > 3 && (
                            <Badge 
                                variant="secondary" 
                                className="bg-black/50 hover:bg-black/70 text-white border border-white/10"
                            >
                                +{project.tags.length - 3}
                            </Badge>
                        )}
                    </div>

                    <div className="flex gap-3 mt-3" style={{ transform: "translateZ(75px)" }}>
                        {hasLiveDemo && (
                            <a 
                                href={project.liveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <ExternalLink size={16} className="text-white" />
                            </a>
                        )}
                        {hasSourceCode && (
                            <a 
                                href={project.codeLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <Github size={16} className="text-white" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight />
                </div>
            </div>
        </motion.div>
    );
};

export function ProjectsSection() {
  const { language } = useLanguage();
  const projects = getProjectsByLanguage(language);

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
