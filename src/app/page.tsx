
import { HeroSection } from "@/components/sections/hero-section";
import { ChatbotPopup } from "@/components/chatbot/chatbot-popup";
import { RYAN_PROFILE_DATA } from "@/lib/profile-data";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
      </div>
      <ChatbotPopup profileData={RYAN_PROFILE_DATA} />
    </div>
  );
}
