'use client';

import { useEffect, useRef, useState } from 'react';
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

const posterMap: Record<WeatherState, string> = {
  RAINING: '/images/raining.png',
  RAINIER_OUT: '/images/rainier-out.png',
  DRY: '/images/dry.png',
  SNOWING: '/images/snowing.png',
};

export function BackgroundVideo({ state }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state and restart video when state changes
    setVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error('Video playback error:', err);
      });
    }
  }, [state]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Poster image shown immediately as background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${posterMap[state]})` }}
      />
      {/* Video fades in when loaded */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={posterMap[state]}
        onCanPlay={() => setVideoLoaded(true)}
      >
        <source src={videoMap[state]} type="video/mp4" />
      </video>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
