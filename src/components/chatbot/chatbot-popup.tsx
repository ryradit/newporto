"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageCircle, Send, X, Loader2, Sparkles, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, type ChatMessageProps } from "./chat-message";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { startVoiceCall, type VapiCallState } from "@/lib/vapi-config";
import { VoiceCallPopup } from "./voice-call-popup";
import { InterviewSchedulerModal } from "./interview-scheduler-modal";
import Client from '@vapi-ai/web';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ChatbotPopupProps {
  profileData?: string; // Kept for backwards compatibility if needed elsewhere
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
  action?: any;
};

const GREETINGS = {
  en: "Hi there! I'm Ryan's digital twin. I know everything about his resume, portfolio, and technical skills. What would you like to know about him?",
  id: "Halo! Saya kembaran digital Ryan. Saya tahu segalanya tentang resume, portofolio, dan kemampuan teknisnya. Apa yang ingin Anda ketahui tentang dia?",
  zh: "你好！我是 Ryan 的数字双胞胎。我了解他的简历、作品集和技术技能的方方面面。你想了解关于他的什么信息？"
};

const QUICK_PROMPTS = {
  en: ["What is his tech stack?", "Schedule an interview", "Why hire him?", "Download his CV?"],
  id: ["Apa tech stack utamanya?", "Jadwalkan wawancara", "Mengapa harus mempekerjakannya?", "Unduh CV-nya?"],
  zh: ["他的技术栈是什么？", "预约面试", "为什么要雇佣他？", "下载他的简历？"]
};

export function ChatbotPopup({ profileData }: ChatbotPopupProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [callState, setCallState] = useState<VapiCallState>({
    isCallActive: false,
    isSpeaking: false,
    isMuted: false,
    error: null
  });
  const activeCallRef = useRef<Client | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: GREETINGS[(language as keyof typeof GREETINGS) || 'en']
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll state for quick prompts
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!suggestionsRef.current) return;
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - suggestionsRef.current.offsetLeft);
    setScrollLeft(suggestionsRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !suggestionsRef.current) return;
    e.preventDefault();
    const x = e.pageX - suggestionsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    suggestionsRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(x - startX));
  };

  // Update greeting when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: GREETINGS[(language as keyof typeof GREETINGS) || 'en'] }];
      }
      return prev;
    });
  }, [language]);

  // Global event listener to open chatbot from anywhere
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const toggleChatbot = () => setIsOpen(!isOpen);

  // --- Voice Call Logic ---
  const startCall = async () => {
    try {
      const call = await startVoiceCall(profileData || "", (newState) => {
        setCallState(newState);
      });

      if (call) {
        activeCallRef.current = call;
        toast({
          title: "Voice call started",
          description: "You can now speak with the AI assistant",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to start voice call",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const endCall = async () => {
    if (activeCallRef.current) {
      await activeCallRef.current.stop();
      activeCallRef.current = null;
    }
    setCallState(prev => ({ ...prev, isCallActive: false }));
  };
  // ------------------------

  const handleCVDownload = async () => {
    try {
      if (typeof window !== "undefined") {
        window.open("https://drive.google.com/drive/folders/1TLOvtTZNk3MOc39ARQ9Ndg-wOP_MvPoy?usp=sharing", "_blank", "noopener,noreferrer");
      }
      toast({
        title: "Opening CV",
        description: "Ryan's CV is opening in a new tab.",
      });
    } catch (error) {
      console.error('CV download error:', error);
      toast({
        title: "Failed to open",
        description: "Could not open the CV link.",
        variant: "destructive",
      });
    }
  };

  const isCVRequest = (text: string): boolean => {
    const cvKeywords = [
      'cv', 'resume', 'curriculum vitae', '简历', 'unduh cv', 'download cv',
      'can you provide his cv', 'get cv', 'view cv',
      'share cv', 'send cv', 'give cv'
    ];
    return cvKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Check if this is a CV download request
      if (isCVRequest(content)) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking
        
        const cvMessage: Message = {
          role: "assistant",
          content: "Here's Ryan's Software Engineering CV. It includes his technical skills, work experience, and projects. Feel free to download it below.",
          action: {
            type: "download-cv",
            label: "Download CV",
            onClick: handleCVDownload
          }
        };
        setMessages((prev) => [...prev, cvMessage]);
        setIsLoading(false);
        return;
      }

      const messagesToSend = newMessages.filter(m => {
        const isGreeting = Object.values(GREETINGS).some(g => m.content.startsWith(g.substring(0, 10)));
        return !(m.role === 'assistant' && isGreeting);
      });
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend, language }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to fetch response');
      }
      
      const data = await response.json();
      let rawAnswer = data.answer;
      
      // Check for Website Controller command
      const commandMatch = rawAnswer.match(/\|\|\|({.*})\|\|\|/);
      if (commandMatch) {
        try {
          const command = JSON.parse(commandMatch[1]);
          if (command.action === 'navigate' && command.target) {
            setTimeout(() => {
              router.push(command.target);
            }, 1000); // Small delay to let the user read the chat first
          } else if (command.action === 'schedule_interview') {
            setTimeout(() => {
              setShowScheduler(true);
            }, 1000);
          }
          // Remove the command string from the visible answer
          rawAnswer = rawAnswer.replace(commandMatch[0], '').trim();
        } catch (e) {
          console.error("Failed to parse AI command", e);
        }
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: rawAnswer }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my neural network right now. Please try again later or contact Ryan directly!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (index: number, targetLanguage: string) => {
    setTranslatingIndex(index);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: messages[index].content, 
          targetLanguage 
        }),
      });
      
      if (!response.ok) throw new Error('Translation failed');
      const data = await response.json();
      
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[index].content = data.translation;
        return newMsgs;
      });
    } catch (error) {
      toast({ title: "Translation failed", description: "Could not translate message.", variant: "destructive" });
    } finally {
      setTranslatingIndex(null);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    };
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  return (
    <>
      <GradientButton
        className="fixed bottom-6 right-6 h-14 !min-w-0 !px-6 !py-0 !rounded-full z-50 animate-fade-in group shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-primary/30 backdrop-blur-[2px]"
        onClick={toggleChatbot}
        aria-label="Toggle Chatbot"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {isOpen ? 
              <X size={20} className="transition-transform duration-300 ease-out group-hover:rotate-90" /> : 
              <MessageCircle size={20} className="transition-transform duration-300 ease-out group-hover:rotate-12" />
            }
          </div>
          <span className="text-sm font-medium whitespace-nowrap tracking-wide">
            {language === 'en' ? 'Chat with AI Assistant' : 
             language === 'id' ? 'Ngobrol dengan AI Asisten' : 
             language === 'zh' ? '与AI助手聊天' : 'Chat with AI Assistant'}
          </span>
        </div>
      </GradientButton>

      {isOpen && (
        <div className={cn(
            "fixed bottom-24 right-6 z-40 w-full max-w-[380px]",
            isOpen ? "animate-slide-in-up" : "animate-slide-out-down"
          )}
        >
          <Card className="shadow-2xl h-[65vh] max-h-[600px] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#121212] border border-border dark:border-white/[0.05] relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 opacity-50 pointer-events-none"></div>
            
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/5 relative z-10 bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/30 shadow-lg">
                    <AvatarImage src="/imagess/foto2.jpg" className="object-cover" />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#121212]"></span>
                </div>
                <div>
                  <CardTitle className="font-headline text-lg text-zinc-900 dark:text-white/90 flex items-center gap-2">
                    Ryan's Digital Twin <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  </CardTitle>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChatbot} 
                className="text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0 flex-grow overflow-hidden relative z-10">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex w-full gap-3 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <Avatar className={cn(
                        "h-8 w-8 flex-shrink-0 mt-1 shadow-sm",
                        msg.role === 'user' ? "hidden" : "ring-1 ring-primary/40"
                      )}>
                        {msg.role === 'assistant' ? (
                          <AvatarImage src="/imagess/foto2.jpg" className="object-cover" />
                        ) : null}
                      </Avatar>
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm flex flex-col gap-2",
                        msg.role === 'user' 
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tr-sm" 
                          : "bg-primary/10 border border-primary/20 text-zinc-900 dark:text-white/90 rounded-tl-sm backdrop-blur-sm"
                      )}>
                        <div>
                          {msg.content.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              {i !== msg.content.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                        {msg.action && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-white border border-primary/30 transition-all"
                            onClick={msg.action.onClick}
                          >
                            {msg.action.label}
                          </Button>
                        )}
                        {msg.role === 'assistant' && (
                          <div className="flex gap-1.5 mt-2 pt-2 border-t border-black/10 dark:border-white/10 items-center">
                            <span className="text-[10px] text-zinc-500 dark:text-white/40 mr-1">Translate:</span>
                            <button onClick={() => handleTranslate(index, 'English')} disabled={translatingIndex === index} className="text-[10px] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50">EN</button>
                            <button onClick={() => handleTranslate(index, 'Indonesian')} disabled={translatingIndex === index} className="text-[10px] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50">ID</button>
                            <button onClick={() => handleTranslate(index, 'Chinese (Simplified)')} disabled={translatingIndex === index} className="text-[10px] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50">ZH</button>
                            {translatingIndex === index && <Loader2 className="w-3 h-3 animate-spin text-zinc-500 dark:text-white/50 ml-1" />}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex w-full gap-3 max-w-[85%] mr-auto"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-1 ring-1 ring-primary/40 shadow-sm">
                        <AvatarImage src="/imagess/foto2.jpg" className="object-cover" />
                      </Avatar>
                      <div className="rounded-2xl px-4 py-4 bg-primary/5 border border-primary/10 rounded-tl-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="p-3 flex-col gap-3 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/40 relative z-10 backdrop-blur-md">
              {/* Quick Prompts - Scrollable horizontally */}
              <div 
                ref={suggestionsRef}
                className="flex w-full overflow-x-auto pb-1 gap-2 no-scrollbar cursor-grab active:cursor-grabbing" 
                style={{ scrollbarWidth: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={() => setIsDragging(false)}
                onMouseUp={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
              >
                {(QUICK_PROMPTS[language as keyof typeof QUICK_PROMPTS] || QUICK_PROMPTS.en).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (dragDistance < 5) handleSendMessage(prompt);
                    }}
                    disabled={isLoading}
                    className="whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-primary/20 text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white border border-black/5 dark:border-white/5 hover:border-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={onSubmit} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Ask anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700/50 focus-visible:ring-primary/50 text-zinc-900 dark:text-white rounded-xl h-10"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !inputValue.trim()} 
                  className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground shadow-sm transition-all"
                >
                  <Send size={18} className="ml-0.5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Voice Call Popup */}
      <VoiceCallPopup
        isOpen={showVoiceCall}
        onClose={() => setShowVoiceCall(false)}
        onStartCall={startCall}
        onEndCall={endCall}
        callState={callState}
      />

      <InterviewSchedulerModal 
        isOpen={showScheduler} 
        onClose={() => setShowScheduler(false)} 
        onCancel={() => {
          setShowScheduler(false);
          // AI automatically responds when they cancel the interview
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I noticed you closed the scheduling window. Did you change your mind, or do you need to check your calendar first? I'm here whenever you're ready to set up a time!" 
          }]);
        }}
      />
    </>
  );
}