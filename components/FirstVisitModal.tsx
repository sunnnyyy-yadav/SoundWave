'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('mixVisited');
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('mixVisited', 'true');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-gradient-to-br from-dark-secondary to-dark-tertiary border border-white/10 rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-dark-tertiary rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent-yellow via-accent-cyan to-accent-lime bg-clip-text text-transparent">
              MiX
            </h1>
            <p className="text-gray-400">Music Streaming Platform</p>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed">
            Welcome to MiX 🎵
          </p>

          <p className="text-lg font-semibold mb-4 text-white">
            ✨ Dedicated to Her ✨
          </p>

          <p className="text-gray-400 mb-8 italic">
            For the moments that matter, the songs that resonate, and the music that brings us together.
          </p>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/sunnnyyy_________/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 px-6 py-2 bg-accent-yellow hover:bg-accent-cyan text-black font-semibold rounded-full transition-all"
          >
            Follow Creator 💫
          </a>

          {/* Close Button */}
          <div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-6 py-3 border border-white/20 hover:bg-dark-tertiary text-white rounded-full transition-colors font-medium"
            >
              Start Listening
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-yellow/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent-cyan/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
