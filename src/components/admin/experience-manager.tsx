import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getExperiences, upsertExperience, deleteExperience, CMSExperience } from '@/lib/supabase-cms';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

export function ExperienceManager() {
  const [experiences, setExperiences] = useState<CMSExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [editingExp, setEditingExp] = useState<Partial<CMSExperience> | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getExperiences(language);
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [language]);

  const handleSave = async () => {
    if (!editingExp?.title || !editingExp?.company) return;
    
    try {
      await upsertExperience({
        ...editingExp,
        language,
        responsibilities: typeof editingExp.responsibilities === 'string' 
          ? (editingExp.responsibilities as string).split('\n').filter(Boolean)
          : editingExp.responsibilities || []
      });
      toast({ title: 'Saved successfully' });
      setEditingExp(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error saving', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteExperience(id);
      toast({ title: 'Deleted' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  if (loading && !experiences.length) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Experiences</h2>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 bg-background border rounded"
        >
          <option value="en">English</option>
          <option value="id">Indonesian</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {editingExp ? (
        <div className="p-4 border rounded space-y-4 bg-muted/20">
          <Input 
            placeholder="Title" 
            value={editingExp.title || ''} 
            onChange={e => setEditingExp({...editingExp, title: e.target.value})} 
          />
          <Input 
            placeholder="Company" 
            value={editingExp.company || ''} 
            onChange={e => setEditingExp({...editingExp, company: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Location" 
              value={editingExp.location || ''} 
              onChange={e => setEditingExp({...editingExp, location: e.target.value})} 
            />
            <Input 
              placeholder="Period (e.g. Dec 2025 - Now)" 
              value={editingExp.period || ''} 
              onChange={e => setEditingExp({...editingExp, period: e.target.value})} 
            />
          </div>
          <Input 
            placeholder="Company Logo URL (e.g. /dreamhost logo.png)" 
            value={editingExp.company_logo || ''} 
            onChange={e => setEditingExp({...editingExp, company_logo: e.target.value})} 
          />
          <Textarea 
            placeholder="Responsibilities (one per line)" 
            value={typeof editingExp.responsibilities === 'string' ? editingExp.responsibilities : (editingExp.responsibilities?.join('\n') || '')} 
            onChange={e => setEditingExp({...editingExp, responsibilities: e.target.value as any})}
            rows={5}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingExp(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <>
          <Button onClick={() => setEditingExp({ title: '', company: '', location: '', period: '', company_logo: '', responsibilities: [], language, order_index: experiences.length })} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>

          <div className="grid gap-4">
            {experiences.map(exp => (
              <div key={exp.id} className="p-4 border rounded flex justify-between items-center bg-card">
                <div>
                  <h3 className="font-bold">{exp.title} <span className="text-muted-foreground font-normal">at {exp.company}</span></h3>
                  <p className="text-sm text-muted-foreground">{exp.period} | {exp.location}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingExp(exp)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(exp.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
