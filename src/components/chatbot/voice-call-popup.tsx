'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { type VapiCallState } from '@/lib/vapi-config';

interface VoiceCallPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCall: () => Promise<void>;
  onEndCall: () => void;
  callState: VapiCallState;
}

export function VoiceCallPopup({ isOpen, onClose, onStartCall, onEndCall, callState }: VoiceCallPopupProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer when call becomes active
  useEffect(() => {
    if (callState.isCallActive && !timerId) {
      const id = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimerId(id);
    } else if (!callState.isCallActive && timerId) {
      clearInterval(timerId);
      setTimerId(null);
      setElapsedTime(0);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [callState.isCallActive, timerId]);

  // Handle call button click
  const handleCallButton = useCallback(async () => {
    if (callState.isCallActive) {
      onEndCall();
    } else {
      try {
        setIsLoading(true);
        await onStartCall();
      } catch (error) {
        console.error('Failed to start call:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [callState.isCallActive, onStartCall, onEndCall]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[300px] shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2">
          <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
          <div className="text-sm font-mono font-medium text-muted-foreground">
            {callState.isCallActive && formatTime(elapsedTime)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Status indicator */}
            <div className={`text-sm ${callState.error ? 'text-destructive' : 'text-muted-foreground'}`}>
              {callState.error ? callState.error : (
                isLoading ? 'Initializing...' :
                callState.isCallActive ? 'Listening...' : 'AI Assistant is ready'
              )}
            </div>

            {/* Mic control */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                size="lg"
                variant={callState.isCallActive ? "destructive" : "default"}
                className="h-16 w-16 rounded-full"
                onClick={handleCallButton}
                disabled={isLoading}
              >
                {callState.isCallActive ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className={`h-6 w-6 ${isLoading ? 'animate-pulse' : ''}`} />
                )}
              </Button>
            </div>

            {/* Close button */}
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={onClose}
              disabled={callState.isCallActive}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
