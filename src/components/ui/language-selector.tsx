"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageLabel, getLanguageFullName, Language } from "@/lib/language";
import { Check } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; flag: string }[] = [
    { code: "en", flag: "🇺🇸" },
    { code: "id", flag: "🇮🇩" },
    { code: "zh", flag: "🇨🇳" },
  ];

  const currentOption = options.find((opt) => opt.code === language) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2.5 gap-1.5 text-xs font-semibold tracking-wide">
          <span className="text-sm shrink-0" role="img" aria-hidden="true">{currentOption.flag}</span>
          <span>{getLanguageLabel(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        {options.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <DropdownMenuItem
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className="flex items-center justify-between text-xs py-2 px-2.5 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-base" role="img" aria-hidden="true">{opt.flag}</span>
                <span className="font-semibold">{getLanguageLabel(opt.code)}</span>
                <span className="text-muted-foreground text-[11px]">· {getLanguageFullName(opt.code)}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-primary ml-2 shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
