
import Link from 'next/link';
import { Linkedin, Github, Mail, Instagram /* Added Instagram */ } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-8 md:py-12 bg-card/20 dark:bg-neutral-900/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link href="/" className="mr-6 flex items-center space-x-2 mb-2 md:mb-0">
              <span className="font-bold font-headline text-lg text-foreground">
                Radityatama.ai
              </span>
            </Link>
            <p className="text-sm text-foreground/70">
              AI Engineer Portfolio
            </p>
          </div>

          <div className="flex space-x-4">
            <Link href="https://linkedin.com/in/ryan-radityatama" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <Linkedin className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
            <Link href="https://instagram.com/ryradit" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile"> {/* Add actual Instagram link */}
              <Instagram className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
            <Link href="https://ryradit.github.io" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <Github className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
            <Link href="mailto:ryradit@gmail.com" aria-label="Email Me">
              <Mail className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
        <div className="border-t border-border/20 pt-6 mt-6 text-center">
          <p className="text-sm text-foreground/60">
            &copy; {currentYear} Ryan Radityatama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
