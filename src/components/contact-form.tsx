
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
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    const recipientEmail = "ryradit@gmail.com";
    const subject = `Contact Form Submission from ${data.name}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Attempt to open the mail client
    if (typeof window !== "undefined") {
      window.location.href = mailtoLink;
    }
    
    // Simulate a delay for user feedback, as mailto: opening is instant
    await new Promise(resolve => setTimeout(resolve, 500));


    toast({
      title: "Email Client Opened",
      description: "Your email client should now be open with the message pre-filled. Please review and send.",
      variant: "default",
    });
    // Reset form only after a slight delay to ensure mailto link is processed
    setTimeout(() => {
        form.reset();
    }, 1000);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#121212] hover:bg-zinc-50 dark:hover:bg-[#1a1a1a] border border-border dark:border-white/[0.05] hover:border-primary/30 transition-all duration-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 z-0 opacity-50"></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-white/80">{translate('contact.name', language)}</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" className="bg-zinc-100 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 focus:border-primary/50 text-zinc-900 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-white/80">{translate('contact.email', language)}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" className="bg-zinc-100 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 focus:border-primary/50 text-zinc-900 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-white/80">{translate('contact.message', language)}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your message..."
                      className="min-h-[120px] bg-zinc-100 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 focus:border-primary/50 text-zinc-900 dark:text-white resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold transition-all shadow-lg hover:shadow-primary/20" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {translate('contact.send', language)}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
