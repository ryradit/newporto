'use client';

import Link from 'next/link';
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
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Language, getLanguageLabel } from "@/lib/language";
import { translate } from "@/translations";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    key: 'menu.home',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    key: 'menu.about',
    href: '/about',
    icon: <User className="w-5 h-5" />,
  },
  {
    key: 'menu.projects',
    href: '/projects',
    icon: <FolderKanban className="w-5 h-5" />,
  },
  {
    key: 'menu.chatRoom',
    href: '/chat-room',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    key: 'menu.contact',
    href: '/contact',
    icon: <Mail className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background/95 border-r border-border/40">
      <div className="flex h-full flex-col">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-2 p-6">
          <button 
            onClick={() => setIsGalleryOpen(true)}
            className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20 hover:border-primary transition-colors duration-200 cursor-pointer group"
          >
            <Image
              src="/imagess/foto2.jpg"
              alt="Profile"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-white text-sm">View Gallery</span>
            </div>
          </button>

          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogContent className="max-w-3xl p-0 bg-transparent border-none">
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Close</span>
              </button>
              <FlipGallery />
            </DialogContent>
          </Dialog>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Ryan Radityatama</h2>
            <p className="text-sm text-muted-foreground">@ryradit</p>
          </div>
          <div className="flex items-center gap-2">
            {(['en', 'id', 'zh'] as Language[]).map((lang, index) => (
              <div key={lang} className="flex items-center">
                {index > 0 && <div className="h-4 w-[1px] bg-border/40" />}
                <button
                  className={`inline-flex items-center gap-1.5 rounded-lg ${
                    language === lang ? 'border border-border/40' : ''
                  } px-2.5 py-1.5 text-xs font-medium ${
                    language === lang ? 'text-foreground' : 'text-muted-foreground'
                  } hover:bg-accent transition-colors`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang === 'en' && <Languages className="h-4 w-4" />}
                  <span>{getLanguageLabel(lang)}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.icon}
              <span className="ml-3">{translate(item.key, language)}</span>
            </Link>
          ))}
        </nav>

        {/* Theme Selector */}
        <div className="flex justify-center py-3">
          <div className="flex items-center gap-2 p-2 rounded-full bg-accent/50">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "p-2 rounded-full transition-all",
                theme === 'light' 
                  ? 'bg-background text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Light Theme"
            >
              <Sun size={16} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "p-2 rounded-full transition-all",
                theme === 'dark' 
                  ? 'bg-background text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Dark Theme"
            >
              <Moon size={16} />
            </button>
            <button
              onClick={() => {
                setIsPortalOpen(true);
              }}
              className="p-2 rounded-full transition-all text-muted-foreground hover:text-foreground hover:text-orange-500"
              title="Open Portal to Other Dimensions"
            >
              <Layers size={16} />
            </button>
          </div>
        </div>
        
        {/* Portal Selector */}
        <PortalSelector 
          open={isPortalOpen} 
          onOpenChange={setIsPortalOpen} 
        />

        {/* Footer */}
        <div className="border-t border-border/40 p-4">
          <p className="text-center text-xs text-muted-foreground">
            {translate('footer.rights', language)}
          </p>
        </div>
      </div>
    </aside>
  );
}
