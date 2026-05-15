import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getEducation, upsertEducation, deleteEducation, CMSEducation } from '@/lib/supabase-cms';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

export function EducationManager() {
  const [education, setEducation] = useState<CMSEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [editingEdu, setEditingEdu] = useState<Partial<CMSEducation> | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEducation(language);
      setEducation(data);
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
    if (!editingEdu?.institution || !editingEdu?.degree) return;
    
    try {
      await upsertEducation({
        ...editingEdu,
        language,
        details: typeof editingEdu.details === 'string' 
          ? (editingEdu.details as string).split('\n').filter(Boolean)
          : editingEdu.details || []
      });
      toast({ title: 'Saved successfully' });
      setEditingEdu(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error saving', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteEducation(id);
      toast({ title: 'Deleted' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  if (loading && !education.length) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education</h2>
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

      {editingEdu ? (
        <div className="p-4 border rounded space-y-4 bg-muted/20">
          <Input 
            placeholder="Institution" 
            value={editingEdu.institution || ''} 
            onChange={e => setEditingEdu({...editingEdu, institution: e.target.value})} 
          />
          <Input 
            placeholder="Degree" 
            value={editingEdu.degree || ''} 
            onChange={e => setEditingEdu({...editingEdu, degree: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Location" 
              value={editingEdu.location || ''} 
              onChange={e => setEditingEdu({...editingEdu, location: e.target.value})} 
            />
            <Input 
              placeholder="Period" 
              value={editingEdu.period || ''} 
              onChange={e => setEditingEdu({...editingEdu, period: e.target.value})} 
            />
          </div>
          <Input 
            placeholder="Institution Logo URL (optional)" 
            value={editingEdu.institution_logo || ''} 
            onChange={e => setEditingEdu({...editingEdu, institution_logo: e.target.value})} 
          />
          <Textarea 
            placeholder="Details (one per line)" 
            value={typeof editingEdu.details === 'string' ? editingEdu.details : (editingEdu.details?.join('\n') || '')} 
            onChange={e => setEditingEdu({...editingEdu, details: e.target.value as any})}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingEdu(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <>
          <Button onClick={() => setEditingEdu({ institution: '', degree: '', location: '', period: '', institution_logo: '', details: [], language, order_index: education.length })} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>

          <div className="grid gap-4">
            {education.map(edu => (
              <div key={edu.id} className="p-4 border rounded flex justify-between items-center bg-card">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingEdu(edu)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(edu.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
