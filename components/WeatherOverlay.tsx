'use client';

import { useMemo } from 'react';
import type { WeatherData } from '@/types/weather';

interface WeatherOverlayProps {
  data: WeatherData;
}

const stateTextMap = {
  RAINING: "It's Raining.",
  RAINIER_OUT: "Rainier is Out.",
  DRY: "It's Dry.",
  SNOWING: "It's Snowing.",
};

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}

export function WeatherOverlay({ data }: WeatherOverlayProps) {
  const timeAgo = useMemo(() => getTimeAgo(data.timestamp), [data.timestamp]);
  const isStale = data.dataStatus === 'stale';
  const isError = data.dataStatus === 'error';
  return (
    <div className="relative z-10 flex flex-col min-h-screen px-12 sm:px-20 lg:px-36 pt-24 sm:pt-16 lg:pt-24 pb-36 sm:pb-32">
      {/* Main headline - upper left */}
      {/* Seattle = Didot Bold 120pt, -6% letter spacing */}
      {/* State = Didot Bold 180pt, -6% letter spacing */}
      <h1 className="font-serif font-bold text-cream drop-shadow-2xl leading-tight tracking-[-0.06em]">
        <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[120px]">Seattle,</div>
        <div className="text-6xl sm:text-8xl md:text-9xl lg:text-[150px] xl:text-[180px]">{stateTextMap[data.state]}</div>
      </h1>

      {/* Spacer to push weather data to bottom */}
      <div className="flex-1" />

      {/* Data status indicator */}
      {(isError || isStale) && (
        <div className="mb-4 flex items-center gap-2 text-white/70">
          <span className={`w-2 h-2 rounded-full ${isError ? 'bg-amber-400' : 'bg-yellow-400'}`} />
          <span className="font-sans text-sm">
            {isError ? 'Weather data may be unavailable' : 'Data may be outdated'}
          </span>
        </div>
      )}

      {/* Last updated indicator */}
      <div className="mb-4 text-white/50 font-sans text-xs">
        Updated {timeAgo}
      </div>

      {/* Weather data - bottom left */}
      {/* Mobile: Hero Temp + Row of 3 */}
      {/* Desktop: Horizontal row of all 4 */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-8 md:gap-10 lg:gap-16 mb-12">

        {/* Temperature - Hero on Mobile */}
        <div className="flex flex-col">
          <div className="text-2xl sm:text-xl md:text-2xl text-white font-serif mb-2 sm:mb-2">
            Temperature
          </div>
          <div className="text-white drop-shadow-lg">
            <span className="text-[80px] sm:text-5xl md:text-6xl lg:text-[64px] font-sans font-medium leading-none">{Math.round(data.temperature)}</span>
            <span className="text-6xl sm:text-4xl md:text-5xl font-sans font-medium">°</span>
          </div>
        </div>

        {/* Secondary Metrics Container - Row on Mobile */}
        <div className="flex flex-row justify-between sm:contents gap-4">
          {/* Feels Like */}
          <div className="flex flex-col">
            <div className="text-lg sm:text-lg md:text-xl lg:text-2xl text-white font-serif mb-1 sm:mb-2">
              Feels Like
            </div>
            <div className="text-white drop-shadow-lg">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-sans font-medium leading-none">{Math.round(data.feelsLike)}</span>
              <span className="text-2xl sm:text-4xl md:text-5xl font-sans font-medium">°</span>
            </div>
          </div>

          {/* Precipitation */}
          <div className="flex flex-col">
            <div className="text-lg sm:text-lg md:text-xl lg:text-2xl text-white font-serif mb-1 sm:mb-2">
              Precipitation
            </div>
            <div className="text-white drop-shadow-lg">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-sans font-medium leading-none">{Math.round(data.precipitationChance)}</span>
              <span className="text-2xl sm:text-4xl md:text-5xl font-sans font-medium">%</span>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex flex-col">
            <div className="text-lg sm:text-lg md:text-xl lg:text-2xl text-white font-serif mb-1 sm:mb-2">
              Visibility
            </div>
            <div className="text-white drop-shadow-lg">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-sans font-medium leading-none">{Math.round(data.visibility)}</span>
              <span className="text-2xl sm:text-4xl md:text-5xl font-sans font-medium">mi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
