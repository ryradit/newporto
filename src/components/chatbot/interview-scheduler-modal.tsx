"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Calendar, Clock, User, Mail, Building, Send, Sparkles, Loader2 } from "lucide-react";

interface InterviewSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

export function InterviewSchedulerModal({ isOpen, onClose, onCancel }: InterviewSchedulerModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  
  // Controlled inputs for AI Draft
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleAutoDraft = async () => {
    if (!name || !company) {
      toast({
        title: "Missing Information",
        description: "Please enter your Name and Company first so the AI can personalize the message.",
        variant: "destructive"
      });
      return;
    }

    setIsDrafting(true);
    try {
      const response = await fetch("/api/draft-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, context: message })
      });
      
      const data = await response.json();
      if (data.draft) {
        setMessage(data.draft);
        toast({ title: "Message Drafted!", description: "AI has successfully drafted your message." });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Drafting Failed",
        description: "Could not auto-draft message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // We manually construct the FormData to have beautifully formatted keys in the email
      const form = e.currentTarget;
      const formData = new FormData();
      
      const candidateName = (form.elements.namedItem('name') as HTMLInputElement).value;
      const company = (form.elements.namedItem('company') as HTMLInputElement).value;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const time = (form.elements.namedItem('preferred_time') as HTMLInputElement).value;
      const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

      // Web3Forms Configuration
      formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");
      formData.append("subject", `📅 INTERVIEW REQUEST: ${candidateName} from ${company}`);
      formData.append("from_name", "Ryan's AI Digital Twin");
      formData.append("replyto", email); // Allows you to hit "Reply" in Gmail and reply straight to the recruiter!

      // Email Body Content (Web3Forms will generate a clean table with these exact labels)
      formData.append("Candidate Name", candidateName);
      formData.append("Company", company);
      formData.append("Contact Email", email);
      
      // Format the date nicely
      const formattedDate = new Date(time).toLocaleString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
      });
      formData.append("Requested Date & Time", formattedDate);
      
      formData.append("Additional Message", message || "No message provided.");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Interview Request Sent!",
          description: "Ryan has received your request and will confirm the calendar invite shortly.",
        });
        onClose();
      } else {
        toast({
          title: "Failed to send request",
          description: data.message || "Make sure you added NEXT_PUBLIC_WEB3FORMS_KEY to your .env.local file.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not send the request. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-[#121212]/90 backdrop-blur-xl border border-border dark:border-white/10 text-zinc-900 dark:text-white shadow-2xl p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
        
        <div className="p-6 relative z-10">
          <DialogHeader className="mb-6 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/30">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-headline font-bold text-zinc-900 dark:text-white">Schedule Interview</DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-white/60">
              Request a meeting directly with Ryan. Select your preferred date and time.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-white/70 flex items-center gap-2">
                  <User className="w-3 h-3" /> Name
                </label>
                <Input 
                  name="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  placeholder="Jane Doe" 
                  className="bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus-visible:ring-primary/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-white/70 flex items-center gap-2">
                  <Building className="w-3 h-3" /> Company
                </label>
                <Input 
                  name="company" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required 
                  placeholder="Tech Corp" 
                  className="bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus-visible:ring-primary/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-white/70 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email
              </label>
              <Input name="email" required type="email" placeholder="jane@example.com" className="bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus-visible:ring-primary/50" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-white/70 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Preferred Time
              </label>
              <Input 
                name="preferred_time"
                required 
                type="datetime-local" 
                className="bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus-visible:ring-primary/50 dark:[color-scheme:dark]" 
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-white/70">Message (Optional)</label>
                <button 
                  type="button" 
                  onClick={handleAutoDraft}
                  disabled={isDrafting}
                  className="text-[10px] flex items-center gap-1 bg-primary/20 hover:bg-primary/30 text-primary px-2 py-1 rounded-md transition-colors font-medium border border-primary/20 disabled:opacity-50"
                >
                  {isDrafting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isDrafting ? "Drafting..." : (message.trim() ? "Polish with AI" : "Auto-Draft")}
                </button>
              </div>
              <Textarea 
                name="message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type rough notes here and let the AI polish it, or leave it blank to auto-draft a generic request..." 
                className="bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus-visible:ring-primary/50 resize-none h-20 text-sm" 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            >
              {isSubmitting ? (
                "Sending Request..."
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Request Meeting
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
