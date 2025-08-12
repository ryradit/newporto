
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type ChatMessageProps } from "@/components/chatbot/chat-message";
import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, MessageSquarePlus, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, getDoc, doc } from "firebase/firestore";

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

  // Check if user's email is in the author list
  useEffect(() => {
    if (!user?.email) return;
    // Import at the top of your file
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
    // Subscribe to chat messages regardless of auth state
    const q = query(
      collection(db, "chat_messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate(),
          user: data.user
        } as ChatMessageProps;
      });
      setChatMessages(messages);
    });

    return () => unsubscribe();
  }, [user]); // Add user to dependency array

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  async function onSubmit(data: RoomChatFormValues) {
    if (!user) {
      return; // Don't allow messages without Google authentication
    }

    setIsSubmitting(true);
    try {
      const userMessageContent = data.message;
      // Store user message in Firestore
      const userData = {
        name: user.name || user.email?.split('@')[0] || 'Anonymous',
        email: user.email,
        image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=18181b&color=ffffff&size=128`,
        isAuthor: isAuthor
      };

      await addDoc(collection(db, "chat_messages"), {
        role: isAuthor ? "author" : "user",
        content: userMessageContent,
        timestamp: serverTimestamp(),
        user: userData
      });
      
      form.reset({ message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatedSection id="room-chat" className="py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex items-center mb-3">
          <MessageSquarePlus className="h-8 w-8 mr-3 text-primary animate-pulse" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            <span className="text-primary">Live Chat</span>
          </h2>
        </div>
        <p className="text-lg text-foreground/70 mb-6 max-w-2xl">
          {translate('chatRoom.description', language)}
        </p>
        
        <Card className="max-w-2xl shadow-xl backdrop-blur-md bg-zinc-900/50 border-zinc-800/50 hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline text-xl flex items-center">
                <Bot className="mr-2 h-6 w-6 text-primary animate-bounce" /> Chat Room
              </CardTitle>
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Signed in as</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut} 
                    className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 ring-2 ring-primary/20 group-hover:ring-destructive/20 transition-all">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          <User size={14} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </Button>
                </div>
              )}
            </div>
            {!user && !loading && (
              <div className="mt-4">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Button 
                      onClick={() => signInWithGoogle()}
                      className="flex items-center gap-2 bg-zinc-800 text-white hover:bg-zinc-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/5 w-full justify-center py-6 border border-zinc-700/50"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-lg font-semibold">Sign in with Google to Chat</span>
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Feel free to sign in and share your thoughts in the conversation!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-4 border-zinc-800/50" ref={scrollAreaRef}>
              <div className="space-y-4">
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
            <CardFooter className="p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className="text-sm font-medium bg-zinc-800/50 px-3 py-1 rounded-full">
                            {translate('chatRoom.messageLabelAs', language).replace('{name}', user.name)}
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
                            className="min-h-[100px] transition-all bg-zinc-800/30 border-zinc-700/50 focus:border-primary/50 focus:ring-primary/50 resize-none"
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
            <CardFooter className="p-4 text-center border-t">
              <p className="text-muted-foreground text-sm">Sign in to share your thoughts and become part of the conversation!</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </AnimatedSection>
  );
}