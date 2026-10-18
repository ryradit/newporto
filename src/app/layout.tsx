import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from '@/components/layout/sidebar';
import { Providers } from '@/components/providers';
import { FloatingChatButton } from '@/components/chatbot/floating-chat-button';

export const metadata: Metadata = {
  title: 'Radityatama.ai - Ryan Radityatama Portfolio',
  description: 'AI Engineer Portfolio for Ryan Radityatama',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        sizes: '128x128',
        type: 'image/svg+xml'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/faveicon.svg" sizes="128x128" />
        <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <div className="flex min-h-screen">
            {/* Desktop sidebar */}
            <div className="hidden md:block">
              <Sidebar />
            </div>
            {/* Main content */}
            <main className="flex-1 md:pl-64">
              {children}
            </main>
            <FloatingChatButton />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
