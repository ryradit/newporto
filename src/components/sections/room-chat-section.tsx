
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type ChatMessageProps } from "@/components/chatbot/chat-message";
import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, MessageSquarePlus, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { MobileHeader } from "@/components/layout/mobile-header";

const roomChatFormSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

type RoomChatFormValues = z.infer<typeof roomChatFormSchema>;

export function RoomChatSection() {
  const { language } = useLanguage();
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessageProps[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.email) return;
    const { AUTHOR_EMAILS } = require('@/lib/config');
    setIsAuthor(AUTHOR_EMAILS.includes(user.email));
  }, [user?.email]);

  const form = useForm<RoomChatFormValues>({
    resolver: zodResolver(roomChatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('timestamp', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
      } else if (data) {
        setChatMessages(data.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          user: msg.user
        })));
      }
    };
    
    fetchMessages();

    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new as any;
          setChatMessages(prev => [...prev, {
            role: newMsg.role,
            content: newMsg.content,
            timestamp: new Date(newMsg.timestamp),
            user: newMsg.user
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ 
        top: scrollAreaRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, [chatMessages]);

  async function onSubmit(data: RoomChatFormValues) {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const userData = {
        name: user.name || user.email?.split('@')[0] || 'Anonymous',
        email: user.email,
        image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=18181b&color=ffffff&size=128`,
        isAuthor: isAuthor
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          role: isAuthor ? "author" : "user",
          content: data.message,
          timestamp: new Date().toISOString(),
          user: userData
        });

      if (error) throw error;
      
      form.reset({ message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.section
      id="room-chat"
      className="py-4 md:py-8 bg-background relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MobileHeader />
      <div className="container px-2 md:px-4 lg:px-6">
        {/* Mobile User Info */}
        {user && (
          <div className="md:hidden mb-4">
            <Card className="w-full bg-zinc-900/50 border-zinc-800/50">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut?.()}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Chat Section */}
        <Card className="w-full shadow-xl backdrop-blur-md bg-zinc-900/50 border-zinc-800/50 hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline text-lg md:text-xl flex items-center">
                <Bot className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary animate-bounce" /> 
                Chat Room
              </CardTitle>
              {user && (
                <div className="hidden md:flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => signOut?.()} 
                    className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-all group"
                  >
                    <Avatar className="h-6 w-6 ring-2 ring-primary/20 group-hover:ring-destructive/20 transition-all">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} />
                      <AvatarFallback><User size={14} /></AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">Sign Out</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[350px] md:h-[400px] p-3 md:p-4 border-zinc-800/50" ref={scrollAreaRef}>
              <div className="space-y-3 md:space-y-4">
                {chatMessages.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    role={msg.role} 
                    content={msg.content}
                    user={msg.user}
                    timestamp={msg.timestamp}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          {user ? (
            <CardFooter className="p-3 md:p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4 w-full">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className="text-sm font-medium bg-zinc-800/50 px-3 py-1 rounded-full">
                            {translate('chatRoom.messageLabelAs', language).replace('{name}', user.name || '')}
                          </FormLabel>
                          {isAuthor && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all">
                              ✦ Author
                            </span>
                          )}
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder={translate('chatRoom.messagePlaceholder', language)}
                            className="min-h-[80px] md:min-h-[100px] transition-all bg-zinc-800/30 border-zinc-700/50 focus:border-primary/50 focus:ring-primary/50 resize-none"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full transition-all bg-zinc-800 hover:bg-zinc-700 text-white border-none",
                      isSubmitting && "animate-pulse"
                    )}
                    size="lg" 
                    disabled={isSubmitting || (!form.formState.isDirty && !form.getValues("message"))}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {translate('chatRoom.send', language)}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardFooter>
          ) : (
            <CardFooter className="p-4">
              <div className="w-full space-y-4">
                <Button 
                  onClick={() => signInWithGoogle?.()}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-white hover:bg-zinc-700 transition-all py-6 border border-zinc-700/50"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-lg font-semibold">Sign in with Google</span>
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Sign in to share your thoughts and become part of the conversation!
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </motion.section>
  );
}