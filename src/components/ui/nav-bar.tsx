'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const NavBar = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'id'>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Translations
  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      demo: 'Demo',
      english: 'English',
      indonesian: 'Indonesian'
    },
    id: {
      home: 'Beranda',
      about: 'Tentang',
      contact: 'Kontak',
      demo: 'Demo',
      english: 'English',
      indonesian: 'Bahasa Indonesia'
    }
  };

  const t = translations[currentLanguage];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: 'en' | 'id') => {
    setCurrentLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-blue-950/80 text-white border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/caharayablackbg.svg"
                alt="Caharaya Logo"
                width={140}
                height={40}
                priority
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center sm:items-center">
            <div className="flex space-x-8">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-purple-500/20 rounded-md transition-all duration-300 hover:scale-105"
              >
                {t.home}
              </Link>
              <Link
                href="/about"
                className="flex items-center px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-purple-500/20 rounded-md transition-all duration-300 hover:scale-105"
              >
                {t.about}
              </Link>
              <Link
                href="/contact"
                className="flex items-center px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-purple-500/20 rounded-md transition-all duration-300 hover:scale-105"
              >
                {t.contact}
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language dropdown with arrow */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-purple-500/20 rounded-md transition-all duration-300 hover:scale-105"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>{currentLanguage.toUpperCase()}</span>
                {isLanguageOpen ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-blue-900/95 ring-1 ring-black ring-opacity-5 z-50 backdrop-blur-md border border-purple-800/30">
                  <div className="py-1">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors ${currentLanguage === 'en' ? 'bg-purple-500/30 text-purple-200' : 'text-white'}`}
                    >
                      {t.english}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('id')}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors ${currentLanguage === 'id' ? 'bg-purple-500/30 text-purple-200' : 'text-white'}`}
                    >
                      {t.indonesian}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Demo button */}
            <Link
              href="/demo"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 hover:scale-105"
            >
              {t.demo}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;