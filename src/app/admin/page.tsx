"use client";

import { useAuth } from "@/contexts/auth-context";
import { AuthorManagement } from "@/components/author-management";
import { ChatbotProfileManager } from "@/components/admin/chatbot-profile-manager";
import { DataSeeder } from "@/components/admin/data-seeder";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { EducationManager } from "@/components/admin/education-manager";
import { ProjectManager } from "@/components/admin/project-manager";
import { SkillManager } from "@/components/admin/skill-manager";
import { useEffect, useState } from "react";
import { checkIfUserIsAuthor } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      if (user?.email) {
        const isAuthor = await checkIfUserIsAuthor(user.email);
        setIsAuthorized(isAuthor);
      }
    }

    checkAuthorization();
  }, [user]);

  const [activeTab, setActiveTab] = useState('authors');

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    redirect("/");
  }

  // Show unauthorized message if not an author
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={async () => {
            await signOut();
            redirect("/");
          }}
          className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>
      
      <div className="flex border-b mb-6 overflow-x-auto">
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'authors' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('authors')}
        >
          Authors
        </button>
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'projects' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'experiences' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('experiences')}
        >
          Experiences
        </button>
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'education' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('education')}
        >
          Education
        </button>
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'skills' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'chatbot' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('chatbot')}
        >
          Chatbot Profile
        </button>
        <button 
          className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'migration' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('migration')}
        >
          System Migration
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'authors' && <AuthorManagement />}
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'experiences' && <ExperienceManager />}
        {activeTab === 'education' && <EducationManager />}
        {activeTab === 'skills' && <SkillManager />}
        {activeTab === 'chatbot' && <ChatbotProfileManager />}
        {activeTab === 'migration' && <DataSeeder />}
      </div>
    </div>
  );
}
