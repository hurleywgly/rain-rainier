import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/weather-service';

const CACHE_SECONDS = 60;

export const revalidate = CACHE_SECONDS; // Revalidate every minute

export async function GET() {
  try {
    const weatherData = await getWeatherData();

    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
