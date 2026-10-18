'use client';

// Type for managing voice call state
export interface VapiCallState {
  isCallActive: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  error: string | null;
  conversation?: Array<{ role: string; text: string }>;
}

// Interface for Vapi assistant configuration
export interface VapiAssistantConfig {
  assistant: {
    name: string;
    systemPrompt?: string;
    model: string;
    voice: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// This interface represents the options we can pass to create a Vapi assistant
// The exact format may change with Vapi versions
export interface VapiAssistantOptions {
  name: string;
  systemPrompt?: string;
  model: string;
  voice: string;
}

// Get VAPI HTTP client for API calls
export async function getVapiHttpClient() {
  try {
    // Import the API class directly
    const { default: Client } = await import('@vapi-ai/web');
    
    // Check if we have a valid API key first
    if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
      throw new Error('VAPI API key is not configured');
    }

    // Create a client with the API key
    const httpClient = new Client(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    
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

    const Vapi = (await import('@vapi-ai/web')).default;
    const client = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    return client;
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

    // Initialize client
    const client = await getVapiClient();
    
    // Create the assistant configuration using our interface
    const assistantOptions: VapiAssistantOptions = {
      name: "AI Assistant",
      systemPrompt: `You are an AI voice assistant answering questions about ${userProfile}'s portfolio. Be friendly, concise, and professional. Focus on highlighting their skills, experience, and achievements.`,
      model: "gpt-4",
      voice: "jenny"
    };

    console.log('Starting voice call with assistant:', assistantOptions);
    
    // Update state to active
    onStateChange({ 
      isCallActive: true, 
      isSpeaking: false,
      isMuted: false, 
      error: null 
    });

    // Start the call with the configuration
    // Using the "as any" type assertion to bypass type checking 
    // since we can't determine the exact expected structure
    await client.start(assistantOptions as any);
    
    // Set up basic event handling with type safety
    client.on("error", (error: Error) => {
      console.error('Call error:', error);
      onStateChange({
        isCallActive: false,
        isSpeaking: false,
        isMuted: false,
        error: error?.message || 'Call encountered an error'
      });
    });

    return client;
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
