'use client';

import type { CreateAgentDTO, CreateWebCallDto } from '@vapi-ai/web/dist/api';

// Type for managing voice call state
export interface VapiCallState {
  isCallActive: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  error: string | null;
  conversation?: Array<{ role: string; text: string }>;
}

interface AssistantOptions {
  name: string;
  firstMessage: string;
  transcriber: {
    provider: "deepgram";
    model: "nova-2";
    language: "en-US";
  };
  voice: {
    provider: "playht";
    voiceId: string;
  };
  model: {
    provider: "openai";
    model: "gpt-4";
    messages: Array<{
      role: string;
      content: string;
    }>;
  };
}

// Get VAPI HTTP client for API calls
export async function getVapiHttpClient() {
  try {
    const { Api } = await import('@vapi-ai/web/dist/api');
    // Check if we have a valid API key first
    if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
      throw new Error('VAPI API key is not configured');
    }

    const httpClient = new Api({
      baseUrl: 'https://api.vapi.ai',
      baseApiParams: {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    });
    
    return httpClient;
  } catch (error) {
    console.error('Error initializing VAPI HTTP client:', error);
    throw error;
  }
}

// Get VAPI WebSocket client for real-time communication
export async function getVapiClient() {
  try {
    // Check if we have a valid API key first
    if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
      throw new Error('VAPI API key is not configured');
    }

    const Client = (await import('@vapi-ai/web')).default;
    const wsClient = new Client(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    return wsClient;
  } catch (error) {
    console.error('Error initializing VAPI WebSocket client:', error);
    throw error;
  }
}

// Start voice call with portfolio assistant configuration
export async function startVoiceCall(
  userProfile: string,
  onStateChange: (state: VapiCallState) => void
) {
  try {
    // Initialize AudioContext
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    }

    // Test audio stream before starting call
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error('Microphone access error:', error);
      throw new Error('Please enable microphone access to use voice chat');
    }

    // Initialize both HTTP and WebSocket clients
    const httpClient = await getVapiHttpClient();
    const wsClient = await getVapiClient();
    
    // Create the agent configuration
    const agentConfig: CreateAgentDTO = {
      model: "gpt-4",
      voice: "jenny",
      name: "AI Assistant",
      context: `You are an AI voice assistant answering questions about ${userProfile}'s portfolio. Be friendly, concise, and professional. Focus on highlighting their skills, experience, and achievements.`,
      startTalking: false  // Don't start talking first, wait for user input
    };

    // First, create a web call through the HTTP API
    console.log('Creating web call with config:', agentConfig);
    const response = await httpClient.call.callControllerCreateWebCall({
      agent: agentConfig
    });
    
    if (!response.data) {
      throw new Error('Failed to create web call: ' + JSON.stringify(response.error));
    }

    console.log('Web call created:', response.data);
    onStateChange({ 
      isCallActive: true, 
      isSpeaking: false,
      isMuted: false, 
      error: null 
    });

    // Then start the WebSocket connection with the same configuration
    await wsClient.start(agentConfig);

    return wsClient;
  } catch (error) {
    console.error('Voice call error:', error);
    let errorMessage = 'Failed to start call';
    
    if (error instanceof Error) {
      if (error.message.includes('Permission denied') || error.message.includes('NotAllowedError')) {
        errorMessage = 'Please allow microphone access to use voice chat';
      } else if (error.message.includes('NotFoundError')) {
        errorMessage = 'No microphone found. Please connect a microphone and try again';
      } else if (error.message.includes('audio')) {
        errorMessage = 'Audio system error. Please check your speakers and microphone';
      } else {
        errorMessage = error.message;
      }
    }

    onStateChange({
      isCallActive: false,
      isSpeaking: false,
      isMuted: false,
      error: errorMessage
    });
    return null;
  }
}
