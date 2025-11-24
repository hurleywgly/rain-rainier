'use client';

import { useEffect, useState } from 'react';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { LoadingState } from '@/components/LoadingState';
import { Footer } from '@/components/Footer';
import type { WeatherData } from '@/types/weather';

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    try {
      const response = await fetch('/api/weather', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      setError(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWeather();

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      fetchWeather();
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

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
    </main>
  );
}
