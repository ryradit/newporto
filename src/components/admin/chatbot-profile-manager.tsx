import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getChatbotProfile, upsertChatbotProfile } from '@/lib/supabase-cms';
import { useToast } from '@/hooks/use-toast';

export function ChatbotProfileManager() {
  const [profileText, setProfileText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getChatbotProfile();
        if (data) {
          setProfileText(data.profile_text);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertChatbotProfile(profileText);
      toast({ title: 'Success', description: 'Chatbot profile updated successfully' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Chatbot Profile Knowledge</h2>
      <p className="text-sm text-muted-foreground">
        This text is fed directly into the AI assistant to give it knowledge about you.
      </p>
      <Textarea
        value={profileText}
        onChange={(e) => setProfileText(e.target.value)}
        rows={20}
        className="font-mono text-sm"
      />
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Profile'}
      </Button>
    </div>
  );
}
