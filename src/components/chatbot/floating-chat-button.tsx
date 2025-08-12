'use client';

import { ChatbotPopup } from './chatbot-popup';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';

export function FloatingChatButton() {
  return <ChatbotPopup profileData={RYAN_PROFILE_DATA} />;
}
