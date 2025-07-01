
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type ChatMessageProps } from "@/components/chatbot/chat-message";
import { autoRespondChat } from "@/ai/flows/auto-respond-chat-flow";
import { RYAN_PROFILE_DATA } from "@/lib/profile-data";
import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, MessageSquarePlus } from "lucide-react";

const roomChatFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  companyOrIndividual: z.string().optional(),
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

type RoomChatFormValues = z.infer<typeof roomChatFormSchema>;

export function RoomChatSection() {
  const [chatMessages, setChatMessages] = useState<ChatMessageProps[]>([
    { role: "assistant", content: "Hello! I'm Ryan's AI assistant. Please provide your name and your first message to start our chat." }
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<string | null>(null);
  const [hasInitiatedChat, setHasInitiatedChat] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<RoomChatFormValues>({
    resolver: zodResolver(roomChatFormSchema),
    defaultValues: {
      name: "",
      companyOrIndividual: "",
      message: "",
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  async function onSubmit(data: RoomChatFormValues) {
    const currentUserName = hasInitiatedChat && userName ? userName : data.name;
    const currentUserCompany = hasInitiatedChat && userCompany ? userCompany : data.companyOrIndividual;

    const userMessageContent = data.message;
    const userMessage: ChatMessageProps = { role: "user", content: userMessageContent };
    
    setChatMessages((prev) => [...prev, userMessage]);
    setIsAiResponding(true);
    form.reset({ ...data, message: "" }); // Reset message field, keep name/company if first message

    if (!hasInitiatedChat) {
      setUserName(data.name);
      setUserCompany(data.companyOrIndividual || null);
      setHasInitiatedChat(true);
    }

    // Prepare history for AI (excluding the current user message which is passed separately to the flow)
    const historyForAI = chatMessages.map(msg => ({ role: msg.role, content: msg.content }));
    
    try {
      const response = await autoRespondChat({
        name: currentUserName,
        companyOrIndividual: currentUserCompany || undefined,
        message: userMessageContent, // This is the LATEST message from the user
        chatHistory: historyForAI,   // History *before* this latest message
        profileContext: RYAN_PROFILE_DATA,
      });
      const assistantMessage: ChatMessageProps = { role: "assistant", content: response.autoResponse };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessageProps = { role: "assistant", content: "Sorry, I encountered an error. Please try again or contact Ryan directly." };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiResponding(false);
    }
  }

  return (
    <AnimatedSection id="room-chat" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4">
          <MessageSquarePlus className="h-8 w-8 mr-3 text-primary" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
            <span className="text-primary">Live Chat with </span>
            <span className="bg-gradient-to-r from-blue-300 via-slate-50 to-pink-300 text-transparent bg-clip-text">
              AI Assistant
            </span>
          </h2>
        </div>
        <p className="text-center text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
          Chat with Ryan's AI assistant. It can answer questions about Ryan based on his profile or help you get in touch.
        </p>
        
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <Bot className="mr-2 h-6 w-6 text-primary" /> AI Chat Room
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] p-4 border-b" ref={scrollAreaRef}>
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} />
                ))}
                {isAiResponding && (
                  <div className="flex justify-start p-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-card-foreground rounded-bl-none shadow-sm">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Assistant is typing...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                {!hasInitiatedChat && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} disabled={isAiResponding} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyOrIndividual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / Organization <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Your company or 'Individual'" {...field} disabled={isAiResponding} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{hasInitiatedChat ? `Your Message (as ${userName})` : "Your First Message"}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-[100px]"
                          {...field}
                          disabled={isAiResponding}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isAiResponding || !form.formState.isDirty && !form.getValues("message")}>
                  {isAiResponding ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  Send Message
                </Button>
              </form>
            </Form>
          </CardFooter>
        </Card>
      </div>
    </AnimatedSection>
  );
}
