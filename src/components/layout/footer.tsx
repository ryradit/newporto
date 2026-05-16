import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 md:py-12 bg-card/20 dark:bg-neutral-900/30">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-sm text-foreground/60">
            &copy; 2025 Ryan Radityatama. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4 text-xs text-foreground/50">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
