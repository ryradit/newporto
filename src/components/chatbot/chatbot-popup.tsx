"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageCircle, Send, X, Loader2 } from "lucide-react";
import { ChatMessage, type ChatMessageProps } from "./chat-message";
import { answerQuestionsAboutRyan } from "@/ai/flows/answer-questions-about-ryan";
import { cn } from "@/lib/utils";

interface ChatbotPopupProps {
  profileData: string;
}

export function ChatbotPopup({ profileData }: ChatbotPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    { role: "assistant", content: "Hi there! I'm Ryan's AI assistant. Ask me anything about his profile." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessageProps = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await answerQuestionsAboutRyan({
        question: inputValue,
        profile: profileData,
      });
      const assistantMessage: ChatMessageProps = { role: "assistant", content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting answer from AI:", error);
      const errorMessage: ChatMessageProps = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-accent hover:bg-accent/90 text-accent-foreground animate-fade-in"
        onClick={toggleChatbot}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </Button>

      {isOpen && (
        <div className={cn(
            "fixed bottom-24 right-6 z-40 w-full max-w-sm",
            isOpen ? "animate-slide-in-up" : "animate-slide-out-down"
          )}
        >
          <Card className="shadow-2xl h-[60vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-lg">AI Assistant</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChatbot} className="text-muted-foreground">
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <ChatMessage key={index} role={msg.role} content={msg.content} />
                  ))}
                   {isLoading && (
                    <div className="flex justify-start p-3">
                       <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-card-foreground rounded-bl-none shadow-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                       </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Ask about Ryan..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send size={20} />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
