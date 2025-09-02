"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Languages, Globe2 } from "lucide-react";
import { translateText } from "@/lib/translate-utils";

function formatTimeAgo(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `about ${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

interface MessageAction {
  type: "download-cv";
  label: string;
  onClick: () => void;
}

export interface ChatMessageProps {
  role: "user" | "assistant" | "author";
  content: string;
  timestamp?: Date;
  user?: {
    name: string;
    email: string;
    image: string;
    isAuthor?: boolean;
  };
  action?: MessageAction;
}

export function ChatMessage({ role, content, user, timestamp, action }: ChatMessageProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    en?: string;
    id?: string;
    zh?: string;
  }>({});
  const [showTranslation, setShowTranslation] = useState<"none" | "en" | "id" | "zh">("none");
  
  // Consider message as author's if role is author or user has isAuthor flag, or if it's an AI response
  const isAuthor = role === "author" || user?.isAuthor || role === "assistant";
  
  // Generate fallback avatar URL
  const fallbackAvatarUrl = user?.name 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=18181b&color=ffffff&size=128`
    : "";

  const handleTranslate = async (language: "en" | "id" | "zh") => {
    try {
      setIsTranslating(true);
      if (!translatedContent[language]) {
        const translated = await translateText(content, language);
        if (translated) {
          setTranslatedContent(prev => ({
            ...prev,
            [language]: translated
          }));
        }
      }
      setShowTranslation(showTranslation === language ? "none" : language);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2 px-4 py-1",
        isAuthor ? "justify-end" : "justify-start"
      )}
    >
      {!isAuthor && (
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user?.image || fallbackAvatarUrl} 
            alt={user?.name || "User"} 
          />
          <AvatarFallback className="bg-zinc-800 text-zinc-50">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        {user && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground/80 flex items-center gap-2">
              {user.name}
              {isAuthor && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm animate-gradient">
                  ✦ Author
                </span>
              )}
            </span>
            {timestamp && (
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(timestamp)}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "rounded-2xl py-2 px-3 inline-block",
              isAuthor
                ? "bg-zinc-800 text-zinc-50"
                : "bg-zinc-700/50 text-zinc-50"
            )}
          >
            <div className="space-y-2">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
              {showTranslation !== "none" && translatedContent[showTranslation] && (
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {translatedContent[showTranslation]}
                </p>
              )}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleTranslate("en")}
                  className={`text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors ${showTranslation === "en" ? "text-primary" : ""}`}
                  disabled={isTranslating}
                >
                  <Globe2 size={12} />
                  {isTranslating ? "Translating..." : "EN"}
                </button>
                <button
                  onClick={() => handleTranslate("id")}
                  className={`text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors ${showTranslation === "id" ? "text-primary" : ""}`}
                  disabled={isTranslating}
                >
                  <Globe2 size={12} />
                  {isTranslating ? "Translating..." : "ID"}
                </button>
                <button
                  onClick={() => handleTranslate("zh")}
                  className={`text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors ${showTranslation === "zh" ? "text-primary" : ""}`}
                  disabled={isTranslating}
                >
                  <Languages size={12} />
                  {isTranslating ? "Translating..." : "中文"}
                </button>
              </div>
            </div>
          </div>
          {action && (
            <div className="flex justify-start mt-2">
              <button
                onClick={action.onClick}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 rounded-md shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
      {isAuthor && (
        <Avatar className="h-8 w-8">
          {role === "assistant" ? (
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot size={18} />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage 
                src={user?.image || fallbackAvatarUrl} 
                alt={user?.name || "Author"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      )}
    </div>
  );
}
