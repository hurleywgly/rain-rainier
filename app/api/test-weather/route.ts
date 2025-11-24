import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/weather-service';

export async function GET() {
    try {
        const data = await getWeatherData();
        return NextResponse.json({
            message: 'Weather Data Verification',
            data,
            logic_check: {
                hasPrecipitation: data.precipitationChance > 0,
                state: data.state,
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
