import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/weather-service';

export const revalidate = 900; // Revalidate every 15 minutes

export async function GET() {
  try {
    const weatherData = await getWeatherData();

    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
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
