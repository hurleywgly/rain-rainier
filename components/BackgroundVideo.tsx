'use client';

import { useEffect, useRef, useState } from 'react';
import type { WeatherState } from '@/types/weather';
import { seasonThemes } from '@/lib/season-theme';
import { Atmosphere } from '@/components/Atmosphere';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

interface BackgroundVideoProps {
  state: WeatherState;
}

export function BackgroundVideo({ state }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const theme = seasonThemes[state];

  useEffect(() => {
    // Reset loaded state and restart video when state changes
    setVideoLoaded(false);
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    video.load();
    // Autoplay can be refused (e.g. iOS Low Power Mode). The poster still
    // covers the screen, so this is not an error worth surfacing.
    video.play().catch(() => {});
  }, [state, reducedMotion]);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.base }}
      aria-hidden="true"
    >
      {/* Poster still — shown immediately, and on its own for reduced motion */}
      <div
        key={theme.poster}
        className="absolute inset-0 w-full h-full bg-cover bg-center animate-season-in"
        style={{ backgroundImage: `url(${theme.poster})` }}
      />

      {/* Video fades in over the poster once it can play */}
      {!reducedMotion && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={theme.poster}
          onCanPlay={() => setVideoLoaded(true)}
        >
          <source src={theme.video} type="video/mp4" />
        </video>
      )}

      {/* Colour grade: pulls each piece of footage into its season's palette */}
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{ background: theme.grade }}
      />

      {/* Ambient layer (light, haze, rain, snow) — static when motion is reduced */}
      <Atmosphere kind={theme.atmosphere} />

      {/* Readability scrim: shaped to sit behind the headline and metrics */}
      <div className="absolute inset-0" style={{ background: theme.scrim }} />

      {/* Soft vignette to frame the composition */}
      <div className="absolute inset-0 season-vignette" />
    </div>
  );
}
