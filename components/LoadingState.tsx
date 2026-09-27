'use client';

export function LoadingState() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(120%_90%_at_20%_0%,#3b4654_0%,#1c222b_55%,#12161c_100%)]"
      role="status"
      aria-live="polite"
    >
      <div className="text-center space-y-5 px-6">
        <div
          className="w-12 h-12 border-2 border-white/20 border-t-cream rounded-full animate-spin mx-auto motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p className="text-cream/90 font-serif text-2xl sm:text-3xl tracking-[-0.02em] animate-pulse motion-reduce:animate-none">
          Loading Seattle weather...
        </p>
      </div>
    </div>
  );
}
