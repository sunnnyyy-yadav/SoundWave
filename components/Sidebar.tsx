'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Search,
  Music,
  Heart,
  ListMusic,
  Menu,
  X,
} from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { playlists } = usePlayerStore();

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/search', label: 'Search', icon: Search },
  ];

  const libraryLinks = [
    { href: '/library', label: 'Library', icon: Music },
    { href: '/liked', label: 'Liked Songs', icon: Heart },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-40 md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto border-r border-dark-tertiary bg-dark-secondary/80 backdrop-blur-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-dark-tertiary p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-yellow to-accent-purple">
              <Music className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">MiX</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Menu
          </p>
          <div className="space-y-1">
            {mainLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-accent-yellow text-black shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-dark-tertiary/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Library Section */}
        <nav className="space-y-2 border-t border-dark-tertiary p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Library
          </p>
          <div className="space-y-1">
            {libraryLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-accent-yellow text-black shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-dark-tertiary/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Playlists */}
        {playlists.length > 0 && (
          <div className="space-y-2 border-t border-dark-tertiary p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Playlists
            </p>
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block truncate rounded-lg px-4 py-2 transition-all duration-200 ${
                    pathname === `/playlist/${playlist.id}`
                      ? 'bg-accent-yellow text-black'
                      : 'text-gray-300 hover:text-white hover:bg-dark-tertiary/50'
                  }`}
                >
                  {playlist.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
