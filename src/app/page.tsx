
import { HeroSection } from "@/components/sections/hero-section";
import { ChatbotPopup } from "@/components/chatbot/chatbot-popup";
import { RYAN_PROFILE_DATA } from "@/lib/profile-data";
import { getChatbotProfile } from "@/lib/supabase-cms";

export default async function HomePage() {
  const profile = await getChatbotProfile();
  const profileData = profile?.profile_text || RYAN_PROFILE_DATA;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
      </div>
      <ChatbotPopup profileData={profileData} />
    </div>
  );
}
