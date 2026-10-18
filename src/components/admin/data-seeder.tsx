import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedCMSDatabase } from '@/lib/supabase-seed';
import { useToast } from '@/hooks/use-toast';

export function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    if (!confirm('This will insert the hardcoded data into the database. Make sure you have created the tables first. Proceed?')) return;
    
    setLoading(true);
    const result = await seedCMSDatabase();
    
    if (result.success) {
      toast({ title: 'Success', description: 'Data seeded successfully!' });
    } else {
      toast({ title: 'Error', description: 'Failed to seed data. Check console.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg bg-red-500/10 border-red-500/20">
      <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone: Data Migration</h3>
      <p className="text-sm mb-4">
        Clicking this button will read all data from `translations`, `project-data.ts`, and `profile-data.ts` and bulk-insert it into Supabase. 
        Only do this ONCE to avoid duplicating entries!
      </p>
      <Button variant="destructive" onClick={handleSeed} disabled={loading}>
        {loading ? 'Seeding...' : 'Run Migration Seed'}
      </Button>
    </div>
  );
}
