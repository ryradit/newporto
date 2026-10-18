"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "name" | "default";
}

export function GradientText({ 
  children, 
  className,
  variant = "default" 
}: GradientTextProps) {
  // Striking, elegant modern tech gradient (Electric Indigo -> Vibrant Violet -> Rose Pink)
  const nameGradient = {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
  };
  
  // Refined modern accent gradient (Electric Blue -> Purple)
  const defaultGradient = {
    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.02em",
  };

  const gradientStyle = variant === "name" ? nameGradient : defaultGradient;

  return (
    <span
      className={cn("inline-block", className)}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
