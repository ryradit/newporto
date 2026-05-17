import Link from 'next/link';
import {
  Bot,
  User,
  FolderKanban,
  Code2,
  MessageSquarePlus,
  Mail,
  Menu,
} from 'lucide-react';
// Make sure the file exists at the specified path, or update the path if needed
import { MobileNav } from "@/components/layout/mobile-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: 'About',
    href: '/about',
    icon: <User size={20} />,
    gradientFrom: '#a955ff',
    gradientTo: '#ea51ff',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: <FolderKanban size={20} />,
    gradientFrom: '#56CCF2',
    gradientTo: '#2F80ED',
  },
  {
    title: 'Skills',
    href: '/skills',
    icon: <Code2 size={20} />,
    gradientFrom: '#FF9966',
    gradientTo: '#FF5E62',
  },

  {
    title: 'Contact',
    href: '/contact',
    icon: <Mail size={20} />,
    gradientFrom: '#ffa9c6',
    gradientTo: '#f434e2',
  },
];

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile Header */}
      <div className="md:hidden flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <MobileNav />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/imagess/foto2.jpg" alt="Ryan Radityatama" />
              <AvatarFallback>RR</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Ryan Radityatama</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-primary"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-md text-xs font-medium">
            ID
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-8 h-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex container h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">
            Radityatama.ai
          </span>
        </Link>
        <nav className="flex items-center ml-auto">
          <ul className="flex items-center gap-2">
            {menuItems.map(
              ({ title, href, icon, gradientFrom, gradientTo }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    style={
                      {
                        '--gradient-from': gradientFrom,
                        '--gradient-to': gradientTo,
                      } as React.CSSProperties
                    }
                    className="relative group w-10 h-10 bg-card shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-32 hover:shadow-none cursor-pointer"
                  >
                    {/* Gradient background on hover */}
                    <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100"></span>
                    {/* Blur glow */}
                    <span className="absolute top-1 inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-md opacity-0 -z-10 transition-all duration-500 group-hover:opacity-50"></span>

                    {/* Icon */}
                    <span className="relative z-10 text-card-foreground transition-all duration-500 group-hover:scale-0 delay-0">
                      {icon}
                    </span>

                    {/* Title */}
                    <span className="absolute text-primary-foreground uppercase tracking-wide text-xs font-bold transition-all duration-500 scale-0 group-hover:scale-100 delay-150">
                      {title}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
