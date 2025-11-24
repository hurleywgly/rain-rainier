'use client';

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

export function WeatherOverlay({ data }: WeatherOverlayProps) {
  return (
    <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16 pb-36 sm:pb-32">
      {/* Main headline - upper left */}
      {/* Seattle = Didot Bold 120pt, -6% letter spacing */}
      {/* State = Didot Bold 180pt, -6% letter spacing */}
      <h1 className="font-serif font-bold text-cream drop-shadow-2xl leading-tight tracking-[-0.06em]">
        <div className="text-[80px] sm:text-[120px]">Seattle,</div>
        <div className="text-[120px] sm:text-[180px]">{stateTextMap[data.state]}</div>
      </h1>

      {/* Spacer to push weather data to bottom */}
      <div className="flex-1" />

      {/* Weather data - bottom left */}
      {/* Labels: Didot Regular 24pt */}
      {/* Values: Gotham Medium 64pt (with units at 48pt) */}
      {/* Mobile: 2x2 grid, Desktop: horizontal row */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-end gap-6 sm:gap-12 lg:gap-16 mb-12">
        {/* Temperature */}
        <div className="flex flex-col">
          <div className="text-2xl text-white font-serif mb-2">
            Temperature
          </div>
          <div className="text-white drop-shadow-lg">
            <span className="text-[64px] font-sans font-medium leading-none">{Math.round(data.temperature)}</span>
            <span className="text-5xl font-sans font-medium">°</span>
          </div>
        </div>

        {/* Feels Like */}
        <div className="flex flex-col">
          <div className="text-2xl text-white font-serif mb-2">
            Feels Like
          </div>
          <div className="text-white drop-shadow-lg">
            <span className="text-[64px] font-sans font-medium leading-none">{Math.round(data.feelsLike)}</span>
            <span className="text-5xl font-sans font-medium">°</span>
          </div>
        </div>

        {/* Precipitation */}
        <div className="flex flex-col">
          <div className="text-2xl text-white font-serif mb-2">
            Precipitation
          </div>
          <div className="text-white drop-shadow-lg">
            <span className="text-[64px] font-sans font-medium leading-none">{Math.round(data.precipitationChance)}</span>
            <span className="text-5xl font-sans font-medium">%</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex flex-col">
          <div className="text-2xl text-white font-serif mb-2">
            Visibility
          </div>
          <div className="text-white drop-shadow-lg">
            <span className="text-[64px] font-sans font-medium leading-none">{Math.round(data.visibility)}</span>
            <span className="text-5xl font-sans font-medium">mi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
