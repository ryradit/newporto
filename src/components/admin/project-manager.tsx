import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getProjects, upsertProject, deleteProject, CMSProject } from '@/lib/supabase-cms';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

export function ProjectManager() {
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [editingProj, setEditingProj] = useState<Partial<CMSProject> | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProjects(language);
      setProjects(data);
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
    if (!editingProj?.title || !editingProj?.description) return;
    
    try {
      await upsertProject({
        ...editingProj,
        language,
        tags: typeof editingProj.tags === 'string' 
          ? (editingProj.tags as string).split(',').map(s => s.trim()).filter(Boolean)
          : editingProj.tags || []
      });
      toast({ title: 'Saved successfully' });
      setEditingProj(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error saving', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteProject(id);
      toast({ title: 'Deleted' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  if (loading && !projects.length) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects Showcase</h2>
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

      {editingProj ? (
        <div className="p-4 border rounded space-y-4 bg-muted/20">
          <Input 
            placeholder="Project Title" 
            value={editingProj.title || ''} 
            onChange={e => setEditingProj({...editingProj, title: e.target.value})} 
          />
          <Textarea 
            placeholder="Project Description" 
            value={editingProj.description || ''} 
            onChange={e => setEditingProj({...editingProj, description: e.target.value})}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Image URL (e.g. /my-project.png)" 
              value={editingProj.image_url || ''} 
              onChange={e => setEditingProj({...editingProj, image_url: e.target.value})} 
            />
            <Input 
              placeholder="Image Hint (e.g. Next.js App)" 
              value={editingProj.image_hint || ''} 
              onChange={e => setEditingProj({...editingProj, image_hint: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Live Link URL" 
              value={editingProj.live_link || ''} 
              onChange={e => setEditingProj({...editingProj, live_link: e.target.value})} 
            />
            <Input 
              placeholder="Code Link URL" 
              value={editingProj.code_link || ''} 
              onChange={e => setEditingProj({...editingProj, code_link: e.target.value})} 
            />
          </div>
          <Input 
            placeholder="Tags (comma separated)" 
            value={typeof editingProj.tags === 'string' ? editingProj.tags : (editingProj.tags?.join(', ') || '')} 
            onChange={e => setEditingProj({...editingProj, tags: e.target.value as any})} 
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingProj(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <>
          <Button onClick={() => setEditingProj({ title: '', description: '', image_url: '', image_hint: '', live_link: '', code_link: '', tags: [], language, order_index: projects.length })} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>

          <div className="grid gap-4">
            {projects.map(proj => (
              <div key={proj.id} className="p-4 border rounded flex justify-between items-center bg-card">
                <div>
                  <h3 className="font-bold">{proj.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{proj.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingProj(proj)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(proj.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
