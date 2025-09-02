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
  // Name gradient styles - matching the gradient used in the button
  const nameGradient = {
    background: "linear-gradient(90deg, #180A38 0%, #2C0E52 15%, #5B1873 35%, #7A1C7D 50%, #AB2A8C 70%, #E0377C 90%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "textShimmer 4s ease infinite"
  };
  
  // Default gradient styles
  const defaultGradient = {
    background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #DB2777 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "textShimmer 4s ease infinite"
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
