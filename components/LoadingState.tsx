'use client';

export function LoadingState() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-white/80 font-serif text-2xl">Loading Seattle weather...</p>
      </div>
    </div>
  );
}
