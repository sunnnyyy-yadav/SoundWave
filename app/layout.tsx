import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import PlayerBar from '@/components/PlayerBar';
import FirstVisitModal from '@/components/FirstVisitModal';

export const metadata: Metadata = {
  title: 'SoundWave - Music Streaming',
  description: 'Apple Music-inspired music streaming with YouTube integration',
  icons: {
    icon: '🎵',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg">
        <FirstVisitModal />
        <div className="flex h-screen flex-col bg-dark-bg">
          {/* Main content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-dark-secondary/20 via-dark-bg to-dark-bg pb-32">
              {children}
            </main>
          </div>

          {/* Bottom player bar */}
          <PlayerBar />
        </div>
      </body>
    </html>
  );
}
