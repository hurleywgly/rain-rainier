'use client';

import { useCallback, useEffect, useState } from 'react';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { LoadingState } from '@/components/LoadingState';
import { Footer } from '@/components/Footer';
import type { WeatherData } from '@/types/weather';

const REFRESH_INTERVAL = 60 * 1000; // 1 minute in milliseconds

export default function Home({
  searchParams,
}: {
  searchParams: { state?: string; debug?: string };
}) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [fetchMetrics, setFetchMetrics] = useState<{
    durationMs: number;
    ageSeconds?: number;
    cacheControl?: string;
    responseDate?: string;
  } | null>(null);

  const isDebugMode =
    searchParams.debug?.toLowerCase() === 'true' || searchParams.debug === '1';

  const fetchWeather = useCallback(async () => {
    const startTime = performance.now();

    try {
      const response = await fetch('/api/weather', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();
      const durationMs = Math.round(performance.now() - startTime);

      setFetchMetrics({
        durationMs,
        ageSeconds: response.headers.get('age')
          ? Number(response.headers.get('age'))
          : undefined,
        cacheControl: response.headers.get('cache-control') ?? undefined,
        responseDate: response.headers.get('date') ?? undefined,
      });
      setLastUpdated(Date.now());

      // Allow overriding state via URL parameter for testing (e.g. ?state=SNOWING)
      if (searchParams.state && process.env.NODE_ENV === 'development') {
        const overrideState = searchParams.state.toUpperCase();
        const validStates = ['RAINING', 'RAINIER_OUT', 'DRY', 'SNOWING'] as const;
        if (validStates.includes(overrideState as typeof validStates[number])) {
          data.state = overrideState as typeof validStates[number];
        }
      }

      setWeatherData(data);
      setError(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [searchParams.state]);

  useEffect(() => {
    // Initial fetch
    fetchWeather();

    // Set up auto-refresh interval and focus/visibility refresh
    const interval = setInterval(() => {
      fetchWeather();
    }, REFRESH_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchWeather();
      }
    };

    window.addEventListener('focus', fetchWeather);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchWeather);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchWeather]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !weatherData) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-white font-serif text-4xl sm:text-6xl">Weather Unavailable</h1>
          <p className="text-white/80 font-sans text-lg">Please try again later.</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchWeather();
            }}
            className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-sans transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <BackgroundVideo state={weatherData.state} />
      <WeatherOverlay data={weatherData} />
      <Footer />
      {isDebugMode ? (
        <div className="absolute bottom-4 left-4 z-50 max-w-xs rounded-lg bg-black/70 p-3 text-xs font-mono text-white shadow-lg">
          <div className="text-sm font-semibold">Weather Debug</div>
          <div className="mt-1 space-y-1">
            <div>
              Last fetch:{' '}
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}
            </div>
            <div>
              Duration: {fetchMetrics ? `${fetchMetrics.durationMs} ms` : '—'}
            </div>
            <div>
              Cache age:{' '}
              {fetchMetrics?.ageSeconds !== undefined ? `${fetchMetrics.ageSeconds}s` : '—'}
            </div>
            <div className="truncate">
              Cache-Control: {fetchMetrics?.cacheControl ?? '—'}
            </div>
            <div className="truncate">
              Response date: {fetchMetrics?.responseDate ?? '—'}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
