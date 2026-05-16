'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  User,
  FolderKanban,
  MessageSquare,
  Mail,
  Languages,
  X,
  Moon,
  Sun,
  Laptop,
  Layers
} from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FlipGallery } from "@/components/ui/flip-gallery";
import { PortalSelector } from "@/components/ui/portal-selector";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Language, getLanguageLabel } from "@/lib/language";
import { translate } from "@/translations";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    key: 'menu.home',
    href: '/',
    icon: <Home className="w-5 h-5 relative z-10" />,
  },
  {
    key: 'menu.about',
    href: '/about',
    icon: <User className="w-5 h-5 relative z-10" />,
  },
  {
    key: 'menu.projects',
    href: '/projects',
    icon: <FolderKanban className="w-5 h-5 relative z-10" />,
  },
  {
    key: 'menu.contact',
    href: '/contact',
    icon: <Mail className="w-5 h-5 relative z-10" />,
  },
];

export function Sidebar() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background/80 backdrop-blur-xl border-r border-border/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex h-full flex-col relative z-10">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-3 p-8">
          <button 
            onClick={() => setIsGalleryOpen(true)}
            className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary/20 hover:border-primary transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-primary/20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay"></div>
            <Image
              src="/imagess/foto2.jpg"
              alt="Profile"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
              <span className="text-white text-xs font-medium tracking-widest uppercase">Gallery</span>
            </div>
          </button>

          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogContent className="max-w-3xl p-0 bg-transparent border-none">
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 opacity-70 transition-opacity hover:opacity-100 hover:bg-black/80 backdrop-blur-md focus:outline-none"
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Close</span>
              </button>
              <FlipGallery />
            </DialogContent>
          </Dialog>
          <div className="text-center mt-2">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 drop-shadow-sm">Ryan Radityatama</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">@ryradit</p>
          </div>
          <div className="flex items-center gap-2 mt-4 bg-accent/30 p-1.5 rounded-xl border border-border/50">
            {(['en', 'id', 'zh'] as Language[]).map((lang) => (
              <button
                key={lang}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                  language === lang 
                    ? 'bg-background text-primary shadow-sm ring-1 ring-border/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
                onClick={() => setLanguage(lang)}
              >
                {lang === 'en' && <Languages className="h-3.5 w-3.5" />}
                <span>{getLanguageLabel(lang)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 px-6 relative">
          {menuItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300 group",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Hover indicator */}
                <div className="absolute inset-0 bg-accent/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                
                <span className={cn("relative z-10 transition-colors duration-300", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")}>
                  {item.icon}
                </span>
                <span className="ml-4 relative z-10 tracking-wide">{translate(item.key, language)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Selector */}
        <div className="flex justify-center py-6 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-accent/30 border border-border/50 backdrop-blur-sm shadow-inner">
            {mounted && (
              <>
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "p-2.5 rounded-full transition-all duration-300 relative group",
                    theme === 'light' 
                      ? 'bg-background text-amber-500 shadow-md ring-1 ring-border/50' 
                      : 'text-muted-foreground hover:text-amber-500/70 hover:bg-background/50'
                  )}
                  title="Light Theme"
                >
                  <Sun size={18} className={theme === 'light' ? 'animate-spin-slow' : ''} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "p-2.5 rounded-full transition-all duration-300",
                    theme === 'dark' 
                      ? 'bg-background text-indigo-400 shadow-md ring-1 ring-border/50' 
                      : 'text-muted-foreground hover:text-indigo-400/70 hover:bg-background/50'
                  )}
                  title="Dark Theme"
                >
                  <Moon size={18} />
                </button>
                <button
                  onClick={() => setIsPortalOpen(true)}
                  className="p-2.5 rounded-full transition-all duration-300 text-muted-foreground hover:text-orange-500 hover:bg-background/50 hover:shadow-sm"
                  title="Open Portal to Other Dimensions"
                >
                  <Layers size={18} />
                </button>
              </>
            )}
          </div>
        </div>
        
        <PortalSelector 
          open={isPortalOpen} 
          onOpenChange={setIsPortalOpen} 
        />

        {/* Footer Info */}
        <div className="flex flex-col items-center pb-6 mt-4 gap-2 text-[10px] text-muted-foreground/60 text-center px-4">
          <p>&copy; 2025 Ryan Radityatama.<br/>All rights reserved.</p>
          <Link href="/terms" className="hover:text-primary transition-colors hover:underline">
            Terms & Conditions
          </Link>
        </div>

      </div>
    </aside>
  );
}
