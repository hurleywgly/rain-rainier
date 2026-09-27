'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { LoadingState } from '@/components/LoadingState';
import { Footer } from '@/components/Footer';
import { isWeatherState, type WeatherData } from '@/types/weather';

const REFRESH_INTERVAL = 60 * 1000; // 1 minute in milliseconds
// Focus and visibilitychange usually fire together when a tab returns; skip
// back-to-back refetches inside this window.
const MIN_REFETCH_GAP = 10 * 1000;

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

  const lastFetchStartedAt = useRef(0);

  const fetchWeather = useCallback(async () => {
    const startTime = performance.now();
    lastFetchStartedAt.current = Date.now();

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
      // (dev builds only — the check is compiled out of production bundles)
      if (searchParams.state && process.env.NODE_ENV === 'development') {
        const overrideState = searchParams.state.toUpperCase();
        if (isWeatherState(overrideState)) {
          data.state = overrideState;
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
    // Don't poll while the tab is hidden; we refetch when it comes back.
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchWeather();
      }
    }, REFRESH_INTERVAL);

    const refetchIfIdle = () => {
      if (Date.now() - lastFetchStartedAt.current >= MIN_REFETCH_GAP) {
        fetchWeather();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchIfIdle();
      }
    };

    window.addEventListener('focus', refetchIfIdle);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refetchIfIdle);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchWeather]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !weatherData) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(120%_90%_at_20%_0%,#3b4654_0%,#1c222b_55%,#12161c_100%)]">
        <div className="text-center space-y-4 px-6 animate-rise" role="alert">
          <h1 className="text-cream font-serif font-bold tracking-[-0.04em] text-5xl sm:text-7xl">
            Weather Unavailable
          </h1>
          <p className="text-white/75 font-sans text-base sm:text-lg">Please try again later.</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchWeather();
            }}
            className="mt-6 px-7 py-3 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 text-white font-sans text-sm tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-viewport overflow-hidden">
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
