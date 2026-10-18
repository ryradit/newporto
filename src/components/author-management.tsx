"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUserAsAuthor, removeUserAsAuthor, checkIfUserIsAuthor } from '@/lib/supabase-admin';
import { toast } from "@/hooks/use-toast";

export function AuthorManagement() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAuthor = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await setUserAsAuthor(email);
      if (success) {
        toast({
          title: "Success",
          description: `${email} has been set as an author`,
        });
        setEmail('');
      } else {
        toast({
          title: "Error",
          description: "Failed to set user as author",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAuthor = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await removeUserAsAuthor(email);
      if (success) {
        toast({
          title: "Success",
          description: `${email} has been removed as an author`,
        });
        setEmail('');
      } else {
        toast({
          title: "Error",
          description: "Failed to remove author status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const isAuthor = await checkIfUserIsAuthor(email);
      toast({
        title: "Author Status",
        description: isAuthor ? `${email} is an author` : `${email} is not an author`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred checking author status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Author Management</h2>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddAuthor} 
            disabled={loading}
            variant="default"
          >
            Add Author
          </Button>
          <Button 
            onClick={handleRemoveAuthor} 
            disabled={loading}
            variant="destructive"
          >
            Remove Author
          </Button>
          <Button 
            onClick={handleCheckStatus} 
            disabled={loading}
            variant="outline"
          >
            Check Status
          </Button>
        </div>
      </div>
    </div>
  );
}
