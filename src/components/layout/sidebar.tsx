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
import { Language, getLanguageLabel, getLanguageFullName } from "@/lib/language";
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
            className="relative h-24 w-24 overflow-hidden rounded-full border border-border hover:border-foreground/40 transition-all duration-200 cursor-pointer group shadow-sm active:scale-95"
          >
            <Image
              src="/imagess/foto2.jpg"
              alt="Ryan Radityatama"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20 backdrop-blur-[2px]">
              <span className="text-white text-[10px] font-mono tracking-widest uppercase">Gallery</span>
            </div>
          </button>

          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogContent className="max-w-3xl p-0 bg-transparent border-none">
              <FlipGallery />
            </DialogContent>
          </Dialog>
          <div className="text-center mt-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Ryan Radityatama</h2>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">@ryradit</p>
          </div>
          <div className="relative flex items-center justify-between gap-1 mt-3 bg-muted/40 p-1 rounded-xl border border-border/50 w-full select-none">
            {(['en', 'id', 'zh'] as Language[]).map((lang) => {
              const isActive = language === lang;
              const flags: Record<Language, string> = {
                en: '🇺🇸',
                id: '🇮🇩',
                zh: '🇨🇳'
              };
              const fullName = getLanguageFullName(lang);
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  title={fullName}
                  aria-label={`Switch to ${fullName}`}
                  className={cn(
                    "relative flex-1 h-7 inline-flex items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold tracking-wider uppercase transition-colors duration-150 focus:outline-none z-10 active:scale-95 whitespace-nowrap",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-lang-pill"
                      className="absolute inset-0 bg-background border border-border rounded-lg shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="text-xs leading-none shrink-0" role="img" aria-hidden="true">{flags[lang]}</span>
                  <span className="leading-none">{getLanguageLabel(lang)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 px-6 relative">
          {menuItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 group active:scale-[0.98]",
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-muted border border-border/60 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Hover indicator */}
                <div className="absolute inset-0 bg-muted/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10"></div>
                
                <span className={cn("relative z-10 transition-colors duration-150", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                  {item.icon}
                </span>
                <span className="ml-3.5 relative z-10 tracking-tight">{translate(item.key, language)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Selector */}
        <div className="flex justify-center py-5 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-muted/50 border border-border/50">
            {mounted && (
              <>
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "p-2 rounded-full transition-all duration-150 relative group active:scale-95",
                    theme === 'light' 
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  )}
                  title="Light Theme"
                >
                  <Sun size={16} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "p-2 rounded-full transition-all duration-150 relative group active:scale-95",
                    theme === 'dark' 
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  )}
                  title="Dark Theme"
                >
                  <Moon size={16} />
                </button>
                <button
                  onClick={() => setIsPortalOpen(true)}
                  className="p-2 rounded-full transition-all duration-150 text-amber-400 hover:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 active:scale-95 shadow-sm shadow-amber-500/20"
                  title="Doctor Strange Sling Ring Portal"
                >
                  <Layers size={16} className="animate-pulse" />
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
