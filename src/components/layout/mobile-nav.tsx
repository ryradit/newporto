"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";

interface NavigationItem {
  name: string;
  href: string;
  section: string;
  icon: JSX.Element;
}

const getNavigationItems = (pathname: string, lang: 'en' | 'id' | 'zh'): NavigationItem[] => [
  {
    name: translate('menu.home', lang),
    href: '/',
    section: 'home',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: translate('menu.about', lang),
    href: '/about',
    section: 'about',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },

  {
    name: translate('menu.projects', lang),
    href: '/projects',
    section: 'projects',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M3 3v18h18" />
        <path d="M18.7 8.7V18H9.4" />
        <path d="M18.7 8.7c0-5.6-5.6-5.6-5.6-5.6s-5.6 0-5.6 5.6" />
      </svg>
    ),
  },

  {
    name: translate('menu.chatRoom', lang),
    href: '/chat-room',
    section: 'chat-room',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
  },
  {
    name: translate('menu.contact', lang),
    href: '/contact',
    section: 'contact',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export function MobileNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const { language } = useLanguage();
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(() => []);
  
  useEffect(() => {
    setNavigationItems(getNavigationItems(pathname || '/', language));
  }, [pathname, language]);

  useEffect(() => {
    setMounted(true);
    // Update active section based on current pathname
    setActiveSection(pathname || '/');
    // Update navigation items when pathname changes
    setNavigationItems(getNavigationItems(pathname || '/', language));
  }, [pathname]);

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative w-10 h-10 hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/15 active:scale-95 rounded-xl flex flex-col items-center justify-center transition-all duration-300 shadow-md"
        >
          <div className="flex flex-col items-center justify-center gap-1.5 w-5 h-5 relative">
            <span className={cn(
              "w-5 h-[2px] bg-white/80 rounded-full transition-all duration-300 absolute",
              isOpen ? "rotate-45" : "-translate-y-1.5"
            )} />
            <span className={cn(
              "w-5 h-[2px] bg-white/80 rounded-full transition-all duration-300 absolute",
              isOpen && "opacity-0 scale-x-0"
            )} />
            <span className={cn(
              "w-5 h-[2px] bg-white/80 rounded-full transition-all duration-300 absolute",
              isOpen ? "-rotate-45" : "translate-y-1.5"
            )} />
          </div>
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full max-w-[300px] p-0 bg-background/95 backdrop-blur-md border-r border-r-border"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Navigation menu for accessing different sections of the website
        </SheetDescription>
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="relative p-6 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                <Image
                  src="/imagess/foto2.jpg"
                  alt="Ryan Radityatama"
                  fill
                  sizes="(max-width: 768px) 64px, 64px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg">Ryan Radityatama</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Software Engineer & AI Engineer</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-md text-xs font-medium">
                AI Engineer
              </span>
              <span className="bg-secondary/10 text-secondary-foreground px-2.5 py-0.5 rounded-md text-xs font-medium">
                Software Engineer
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    await router.push(item.href);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1",
                    isActive 
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
