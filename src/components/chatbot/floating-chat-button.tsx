'use client';

import { ChatbotPopup } from './chatbot-popup';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';
import { usePathname } from 'next/navigation';

export function FloatingChatButton() {
  const pathname = usePathname();

  // Hide the global floating chat button on the dedicated full-screen AI Agent pages
  if (pathname === '/agent' || pathname === '/test-agent') {
    return null;
  }

  return <ChatbotPopup profileData={RYAN_PROFILE_DATA} />;
}
