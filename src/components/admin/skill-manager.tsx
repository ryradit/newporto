import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSkills, upsertSkill, deleteSkill, CMSSkill } from '@/lib/supabase-cms';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

export function SkillManager() {
  const [skills, setSkills] = useState<CMSSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<CMSSkill> | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!editingSkill?.name || !editingSkill?.icon_name) return;
    
    try {
      await upsertSkill({
        ...editingSkill
      });
      toast({ title: 'Saved successfully' });
      setEditingSkill(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error saving', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteSkill(id);
      toast({ title: 'Deleted' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  if (loading && !skills.length) return <div>Loading...</div>;

  const topSkills = skills.filter(s => s.row_placement === 'top');
  const bottomSkills = skills.filter(s => s.row_placement === 'bottom');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Skills Banners</h2>
      </div>

      {editingSkill ? (
        <div className="p-4 border rounded space-y-4 bg-muted/20">
          <Input 
            placeholder="Skill Name" 
            value={editingSkill.name || ''} 
            onChange={e => setEditingSkill({...editingSkill, name: e.target.value})} 
          />
          <Input 
            placeholder="Lucide Icon Name (e.g. Code2, Wind, Server)" 
            value={editingSkill.icon_name || ''} 
            onChange={e => setEditingSkill({...editingSkill, icon_name: e.target.value})} 
          />
          <select 
            value={editingSkill.row_placement || 'top'} 
            onChange={(e) => setEditingSkill({...editingSkill, row_placement: e.target.value})}
            className="w-full p-2 bg-background border rounded"
          >
            <option value="top">Top Scrolling Row</option>
            <option value="bottom">Bottom Scrolling Row</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingSkill(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <>
          <Button onClick={() => setEditingSkill({ name: '', icon_name: '', row_placement: 'top', order_index: skills.length })} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4">Top Row</h3>
              <div className="grid gap-2">
                {topSkills.map(skill => (
                  <div key={skill.id} className="p-3 border rounded flex justify-between items-center bg-card">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({skill.icon_name})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingSkill(skill)}><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(skill.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Bottom Row</h3>
              <div className="grid gap-2">
                {bottomSkills.map(skill => (
                  <div key={skill.id} className="p-3 border rounded flex justify-between items-center bg-card">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({skill.icon_name})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingSkill(skill)}><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(skill.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
