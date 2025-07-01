"use client";

import Link from 'next/link';
import { Linkedin, Github, Mail, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const socials = [
  { name: 'LinkedIn', href: 'https://linkedin.com/in/ryan-radityatama', Icon: Linkedin },
  { name: 'Instagram', href: 'https://instagram.com/ryradit', Icon: Instagram },
  { name: 'GitHub', href: 'https://ryradit.github.io', Icon: Github },
  { name: 'Email', href: 'mailto:ryradit@gmail.com', Icon: Mail },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

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
            {socials.map((social) => (
              <motion.div
                key={social.name}
                onMouseEnter={() => setHoveredIcon(social.name)}
                onMouseLeave={() => setHoveredIcon(null)}
                animate={{ opacity: hoveredIcon && hoveredIcon !== social.name ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={social.href}
                  target={social.name !== 'Email' ? "_blank" : undefined}
                  rel={social.name !== 'Email' ? "noopener noreferrer" : undefined}
                  aria-label={social.name === 'Email' ? 'Email Me' : `${social.name} Profile`}
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <social.Icon className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
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
