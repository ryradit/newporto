"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";

export function HireAgentCta() {
  const { language } = useLanguage();

  const steps = [
    translate("hireAgent.step1", language),
    translate("hireAgent.step2", language),
    translate("hireAgent.step3", language),
  ];

  return (
    <motion.section
      id="hire-agent"
      aria-labelledby="hire-agent-title"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-4xl mx-auto mb-14 overflow-hidden rounded-[28px] border border-border/60 bg-card/60 shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_24px_48px_-24px_rgb(0_0_0/0.35)]"
    >
      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        {/* Copy */}
        <div className="flex flex-col p-7 md:p-10">
          <h2
            id="hire-agent-title"
            className="text-[1.75rem] md:text-4xl font-semibold leading-[1.1] tracking-tight text-foreground text-balance"
          >
            {translate("hireAgent.title", language)}
          </h2>
          <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed text-muted-foreground">
            {translate("hireAgent.description", language)}
          </p>

          <ol className="mt-7 space-y-3">
            {steps.map((label, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-purple-500/40 font-mono text-[10px] text-purple-600 dark:text-purple-300">
                  {i + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/agent"
              id="hire-agent-cta-button"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground py-2.5 pl-5 pr-2.5 text-sm font-medium text-background transition-transform duration-200 active:scale-[0.97]"
            >
              {translate("hireAgent.cta", language)}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {translate("hireAgent.note", language)}
            </span>
          </div>
        </div>

        {/* Agent preview */}
        <div
          aria-hidden="true"
          className="relative hidden md:flex flex-col justify-center gap-3 border-l border-border/60 bg-muted/40 p-8"
        >
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
              <Bot className="h-3 w-3" />
            </span>
            Proposal Agent
            <span className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              live
            </span>
          </div>

          <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-border/60 bg-background/80 px-3.5 py-2.5 text-xs leading-relaxed text-foreground">
            What are you looking to build?
          </div>
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-purple-600 px-3.5 py-2.5 text-xs leading-relaxed text-white">
            A booking site for my studio, live in 6 weeks.
          </div>
          <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-border/60 bg-background/80 px-3.5 py-2.5">
            <div className="h-1.5 w-24 rounded-full bg-foreground/15" />
            <div className="mt-2 h-1.5 w-32 rounded-full bg-foreground/10" />
            <div className="mt-2 h-1.5 w-16 rounded-full bg-foreground/10" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
