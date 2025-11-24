'use client';

import { useEffect, useRef } from 'react';
import type { WeatherState } from '@/types/weather';

interface BackgroundVideoProps {
  state: WeatherState;
}

const videoMap: Record<WeatherState, string> = {
  RAINING: '/videos/raining.mp4',
  RAINIER_OUT: '/videos/rainier-out.mp4',
  DRY: '/videos/dry.mp4',
  SNOWING: '/videos/snowing.mp4',
};

export function BackgroundVideo({ state }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Restart video when state changes
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error('Video playback error:', err);
      });
    }
  }, [state]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={videoMap[state]} type="video/mp4" />
      </video>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
