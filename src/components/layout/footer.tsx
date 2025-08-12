export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-8 md:py-12 bg-card/20 dark:bg-neutral-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-foreground/60">
            &copy; {currentYear} Ryan Radityatama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
