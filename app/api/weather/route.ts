import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      const params: Record<string, string> = {};
      params.lat = '-1.2921';
      params.lng = '36.8219';
      const data = await bffGet('/weather', params);
      return NextResponse.json(data);
    }

    const data = await bffGet('/weather', { lat, lng });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[WEATHER BFF]', err instanceof Error ? err.message : String(err));
    return NextResponse.json({
      temp: 24,
      condition: 'Cloudy',
      humidity: 65,
      forecast: 'Weather service temporarily unavailable',
      locationName: 'Unknown',
    });
  }
}
