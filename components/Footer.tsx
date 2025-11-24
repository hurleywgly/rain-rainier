'use client';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
      {/* Mobile: Stacked vertical layout */}
      <div className="sm:hidden flex flex-col items-center gap-2 text-center">
        {/* Data attribution */}
        <p className="font-serif text-base text-white leading-tight">
          Data here comes from the National Weather Service & Aviation Weather Center.
        </p>

        {/* Credits */}
        <div className="flex items-baseline gap-1">
          <span className="font-sans font-light text-base text-white">Built by</span>
          <span className="font-serif font-bold text-base text-cream">@rywigs</span>
        </div>
      </div>

      {/* Desktop: Centered with right-aligned credits */}
      {/* Data attribution: Didot Regular 24pt, centered */}
      {/* Built by: Gotham Book 24pt, @rywigs: Didot Bold 24pt cream */}
      <div className="hidden sm:flex items-center justify-center">
        {/* Center - Data attribution */}
        <p className="font-serif text-2xl text-white text-center">
          Data here comes from the National Weather Service & Aviation Weather Center.
        </p>

        {/* Right - Credits on same line */}
        <div className="absolute right-4 sm:right-6 lg:right-8 flex items-baseline gap-1 whitespace-nowrap">
          <span className="font-sans font-light text-2xl text-white">Built by</span>
          <span className="font-serif font-bold text-2xl text-cream">@rywigs</span>
        </div>
      </div>
    </footer>
  );
}
