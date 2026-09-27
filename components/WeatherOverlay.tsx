'use client';

import { useMemo, type CSSProperties } from 'react';
import type { WeatherData, WeatherState } from '@/types/weather';
import { seasonThemes } from '@/lib/season-theme';

interface WeatherOverlayProps {
  data: WeatherData;
}

const stateTextMap: Record<WeatherState, string> = {
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

interface MetricProps {
  label: string;
  value: number;
  unit: string;
  hero?: boolean;
  delay: number;
}

function Metric({ label, value, unit, hero = false, delay }: MetricProps) {
  return (
    <div className="flex flex-col animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <div
        className={`font-serif italic text-[color:var(--season-accent)] mb-1.5 sm:mb-2 ${
          hero ? 'text-xl sm:text-lg md:text-xl lg:text-2xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl'
        }`}
      >
        {label}
      </div>
      <div className="text-white season-text-shadow tabular-nums">
        <span
          className={`font-sans font-medium leading-none tracking-tight ${
            hero
              ? 'text-[80px] sm:text-5xl md:text-6xl lg:text-[64px]'
              : 'text-4xl sm:text-5xl md:text-6xl lg:text-[64px]'
          }`}
        >
          {value}
        </span>
        <span
          className={`font-sans font-light text-white/80 ${
            hero ? 'text-5xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-3xl md:text-4xl'
          } ${unit === '°' ? 'align-top' : 'ml-0.5'}`}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

export function WeatherOverlay({ data }: WeatherOverlayProps) {
  const timeAgo = useMemo(() => getTimeAgo(data.timestamp), [data.timestamp]);
  const isStale = data.dataStatus === 'stale';
  const isError = data.dataStatus === 'error';
  const theme = seasonThemes[data.state];

  const themeVars = {
    '--season-accent': theme.accent,
    '--season-glow': theme.glow,
  } as CSSProperties;

  return (
    <div
      className="relative z-10 flex flex-col h-full px-6 sm:px-20 lg:px-36 pt-20 sm:pt-16 lg:pt-24 pb-24 sm:pb-28"
      style={themeVars}
    >
      {/* Main headline - upper left */}
      {/* Seattle = Didot Bold 120pt, -6% letter spacing */}
      {/* State = Didot Bold 180pt, -6% letter spacing */}
      <h1
        key={data.state}
        aria-live="polite"
        className="font-serif font-bold text-cream leading-[0.95] tracking-[-0.05em] season-headline"
      >
        <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[clamp(72px,7vw,120px)] animate-rise">
          Seattle,
        </span>
        <span
          className="block text-[64px] sm:text-8xl md:text-9xl lg:text-[clamp(96px,10.5vw,180px)] mt-1 sm:mt-2 animate-rise"
          style={{ animationDelay: '120ms' }}
        >
          {stateTextMap[data.state]}
        </span>
      </h1>

      {/* Spacer to push weather data to bottom */}
      <div className="flex-1" />

      {/* Status line: freshness + any data warning */}
      <div
        className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-xs text-white/70 animate-rise"
        style={{ animationDelay: '220ms' }}
      >
        <span className="inline-flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />
          Updated {timeAgo}
        </span>
        {(isError || isStale) && (
          <span className="inline-flex items-center gap-2" role="status">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-amber-400' : 'bg-yellow-400'}`}
              aria-hidden="true"
            />
            {isError ? 'Weather data may be unavailable' : 'Data may be outdated'}
          </span>
        )}
      </div>

      {/* Hairline rule in the season's accent */}
      <div
        className="h-px w-full max-w-5xl mb-6 sm:mb-8 origin-left animate-rise"
        style={{
          animationDelay: '260ms',
          background: `linear-gradient(90deg, ${theme.accent} 0%, transparent 100%)`,
          opacity: 0.55,
        }}
        aria-hidden="true"
      />

      {/* Weather data - bottom left */}
      {/* Mobile: Hero Temp + Row of 3 */}
      {/* Desktop: Horizontal row of all 4 */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-7 sm:gap-8 md:gap-10 lg:gap-16 mb-6 sm:mb-10">
        <Metric label="Temperature" value={Math.round(data.temperature)} unit="°" hero delay={300} />

        {/* Secondary Metrics Container - Row on Mobile */}
        <div className="flex flex-row justify-between sm:contents gap-4">
          <Metric label="Feels Like" value={Math.round(data.feelsLike)} unit="°" delay={360} />
          <Metric
            label="Precipitation"
            value={Math.round(data.precipitationChance)}
            unit="%"
            delay={420}
          />
          <Metric label="Visibility" value={Math.round(data.visibility)} unit="mi" delay={480} />
        </div>
      </div>
    </div>
  );
}
