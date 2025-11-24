'use client';

import { useState } from 'react';

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 px-12 sm:px-20 lg:px-36 pb-4 sm:pb-6">
      {/* Mobile/Tablet/Small Desktop: Flex row with Info Icon and Credits */}
      <div className="xl:hidden flex items-center justify-between w-full relative">
        {/* Info Icon with Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Show data source"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="11.5" stroke="white" />
              <text x="12" y="16" textAnchor="middle" fill="white" fontFamily="serif" fontSize="14" fontWeight="bold">i</text>
            </svg>
          </button>

          {/* Data attribution popup */}
          {isOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 text-left">
              <p className="font-serif text-sm text-white leading-tight">
                Data here comes from the National Weather Service & Aviation Weather Center.
              </p>
            </div>
          )}
        </div>

        {/* Credits */}
        <div className="flex items-baseline gap-1">
          <span className="font-sans font-light text-base text-white">Built by</span>
          <a
            href="https://x.com/rywigs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif font-bold text-base text-cream hover:text-white transition-colors"
          >
            @rywigs
          </a>
        </div>
      </div>

      {/* Large Desktop (XL+): Centered with right-aligned credits */}
      {/* Data attribution: Didot Regular 24pt, centered */}
      {/* Built by: Gotham Book 24pt, @rywigs: Didot Bold 24pt cream */}
      <div className="hidden xl:flex items-center justify-center">
        {/* Center - Data attribution */}
        <p className="font-serif text-2xl text-white text-center">
          Data here comes from the National Weather Service & Aviation Weather Center.
        </p>

        {/* Right - Credits on same line */}
        <div className="absolute right-8 sm:right-12 lg:right-24 flex items-baseline gap-1 whitespace-nowrap">
          <span className="font-sans font-light text-xl text-white">Built by</span>
          <a
            href="https://x.com/rywigs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif font-bold text-xl text-cream hover:text-white transition-colors"
          >
            @rywigs
          </a>
        </div>
      </div>
    </footer>
  );
}
