import Link from 'next/link';
import {
  Bot,
  User,
  FolderKanban,
  Code2,
  MessageSquarePlus,
  Mail,
} from 'lucide-react';

const menuItems = [
  {
    title: 'About',
    href: '#about',
    icon: <User size={20} />,
    gradientFrom: '#a955ff',
    gradientTo: '#ea51ff',
  },
  {
    title: 'Projects',
    href: '#projects',
    icon: <FolderKanban size={20} />,
    gradientFrom: '#56CCF2',
    gradientTo: '#2F80ED',
  },
  {
    title: 'Skills',
    href: '#skills',
    icon: <Code2 size={20} />,
    gradientFrom: '#FF9966',
    gradientTo: '#FF5E62',
  },
  {
    title: 'Room Chat',
    href: '#room-chat',
    icon: <MessageSquarePlus size={20} />,
    gradientFrom: '#80FF72',
    gradientTo: '#7EE8FA',
  },
  {
    title: 'Contact',
    href: '#contact',
    icon: <Mail size={20} />,
    gradientFrom: '#ffa9c6',
    gradientTo: '#f434e2',
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
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
