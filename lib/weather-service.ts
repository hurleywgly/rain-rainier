import type { WeatherData, WeatherParameters, VisibilityResult, CloudLayer, METARCloud } from '@/types/weather';

// Configuration
const NWS_STATIONS_URL = "https://api.weather.gov/stations/KSEA/observations/latest";
const AVIATION_METAR_URL = "https://aviationweather.gov/api/data/metar?ids=KSEA&format=json";
const NWS_CONTACT_EMAIL = process.env.NWS_CONTACT_EMAIL || "contact@example.com";

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function getWeatherData(): Promise<WeatherData> {
  try {
    // Step 1: Fetch weather data from APIs
    const weatherData = await fetchWeatherData();

    // Step 2: Extract parameters
    const params = extractParameters(weatherData);

    // Step 3: Determine weather state
    const state = determineWeatherState(params);

    // Step 4: Return formatted data
    return {
      state,
      temperature: params.temperature || 0,
      feelsLike: params.feelsLike || 0,
      precipitationChance: params.hasPrecipitation ? 100 : 0,
      visibility: params.visibilityMiles || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return fallback data
    return {
      state: 'DRY',
      temperature: 0,
      feelsLike: 0,
      precipitationChance: 0,
      visibility: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// DATA FETCHING
// ============================================================================

async function fetchWeatherData() {
  const data: {
    nws_observation: any;
    metar: any;
    timestamp: string;
  } = {
    nws_observation: null,
    metar: null,
    timestamp: new Date().toISOString(),
  };

  // Fetch NWS observation
  try {
    const response = await fetch(NWS_STATIONS_URL, {
      headers: {
        'User-Agent': `RainOrRainier/1.0 (${NWS_CONTACT_EMAIL})`,
      },
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (response.ok) {
      data.nws_observation = await response.json();
    }
  } catch (error) {
    console.error('NWS API error:', error);
  }

  // Fetch METAR data
  try {
    const response = await fetch(AVIATION_METAR_URL, {
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (response.ok) {
      const metarData = await response.json();
      data.metar = metarData;
    }
  } catch (error) {
    console.error('METAR API error:', error);
  }

  return data;
}

// ============================================================================
// PARAMETER EXTRACTION
// ============================================================================

function extractParameters(weatherData: any): WeatherParameters {
  const params: WeatherParameters = {
    visibilityMiles: null,
    cloudCeilingFt: null,
    cloudCoverPct: null,
    hasPrecipitation: false,
    humidityPct: null,
    weatherDescription: null,
    temperature: null,
    feelsLike: null,
  };

  // Extract from NWS observation
  if (weatherData.nws_observation?.properties) {
    const nws = weatherData.nws_observation.properties;

    // Visibility (convert meters to miles)
    if (nws.visibility?.value) {
      params.visibilityMiles = nws.visibility.value / 1609.34;
    }

    // Temperature (convert Celsius to Fahrenheit)
    if (nws.temperature?.value !== null) {
      params.temperature = (nws.temperature.value * 9/5) + 32;
    }

    // Feels like temperature (convert Celsius to Fahrenheit)
    if (nws.windChill?.value !== null) {
      params.feelsLike = (nws.windChill.value * 9/5) + 32;
    } else if (nws.heatIndex?.value !== null) {
      params.feelsLike = (nws.heatIndex.value * 9/5) + 32;
    } else {
      params.feelsLike = params.temperature;
    }

    // Cloud layers
    if (nws.cloudLayers) {
      params.cloudCeilingFt = findCloudCeiling(nws.cloudLayers);
      params.cloudCoverPct = calculateCloudCover(nws.cloudLayers);
    }

    // Precipitation
    if (nws.textDescription) {
      params.hasPrecipitation = detectPrecipitation(nws.textDescription);
      params.weatherDescription = nws.textDescription;
    }

    // Humidity
    if (nws.relativeHumidity?.value !== null) {
      params.humidityPct = nws.relativeHumidity.value;
    }
  }

  // Extract from METAR (override if available - more accurate)
  if (weatherData.metar && Array.isArray(weatherData.metar) && weatherData.metar.length > 0) {
    const metar = weatherData.metar[0];

    // Visibility (already in statute miles)
    if (metar.visib) {
      params.visibilityMiles = parseFloat(metar.visib);
    }

    // Temperature (convert Celsius to Fahrenheit)
    if (metar.temp !== undefined) {
      params.temperature = (metar.temp * 9/5) + 32;
    }

    // Cloud ceiling
    if (metar.clouds) {
      params.cloudCeilingFt = parseMETARCeiling(metar.clouds);
      params.cloudCoverPct = parseMETARCloudCover(metar.clouds);
    }

    // Precipitation
    if (metar.wxString) {
      params.hasPrecipitation = metar.wxString.includes('RA') || metar.wxString.includes('SN') || metar.wxString.includes('DZ');
    }

    // Humidity
    if (metar.relh !== undefined) {
      params.humidityPct = metar.relh;
    }
  }

  return params;
}

function findCloudCeiling(cloudLayers: CloudLayer[]): number | null {
  let ceilingFt: number | null = null;

  for (const layer of cloudLayers) {
    const amount = layer.amount || '';
    let baseFt = layer.base?.value || null;

    if (baseFt !== null) {
      // Convert meters to feet if needed (assume values < 1000 are already in feet)
      baseFt = baseFt < 1000 ? baseFt : baseFt * 3.28084;

      // BKN = broken (5/8 to 7/8), OVC = overcast (8/8)
      if ((amount === 'BKN' || amount === 'OVC')) {
        if (ceilingFt === null || baseFt < ceilingFt) {
          ceilingFt = baseFt;
        }
      }
    }
  }

  return ceilingFt;
}

function calculateCloudCover(cloudLayers: CloudLayer[]): number | null {
  const coverageMap: Record<string, number> = {
    'FEW': 12.5,
    'SCT': 37.5,
    'BKN': 75.0,
    'OVC': 100.0,
  };

  let maxCover = 0;
  for (const layer of cloudLayers) {
    const amount = layer.amount || '';
    const cover = coverageMap[amount] || 0;
    if (cover > maxCover) {
      maxCover = cover;
    }
  }

  return maxCover;
}

function parseMETARCeiling(clouds: METARCloud[]): number | null {
  let ceilingFt: number | null = null;

  for (const cloud of clouds) {
    const cover = cloud.cover || '';
    const base = cloud.base || 0;
    const baseFt = base * 100; // Base is in hundreds of feet AGL

    if (cover === 'BKN' || cover === 'OVC') {
      if (ceilingFt === null || baseFt < ceilingFt) {
        ceilingFt = baseFt;
      }
    }
  }

  return ceilingFt;
}

function parseMETARCloudCover(clouds: METARCloud[]): number | null {
  if (!clouds || clouds.length === 0) return 0;

  const coverageMap: Record<string, number> = {
    'FEW': 12.5,
    'SCT': 37.5,
    'BKN': 75.0,
    'OVC': 100.0,
  };

  let maxCover = 0;
  for (const cloud of clouds) {
    const cover = coverageMap[cloud.cover] || 0;
    maxCover = Math.max(maxCover, cover);
  }

  return maxCover;
}

function detectPrecipitation(description: string): boolean {
  const precipKeywords = ['rain', 'snow', 'drizzle', 'showers', 'sleet', 'hail'];
  return precipKeywords.some(keyword => description.toLowerCase().includes(keyword));
}

// ============================================================================
// MOUNT RAINIER VISIBILITY LOGIC
// ============================================================================

function evaluateRainierVisibility(params: WeatherParameters): VisibilityResult {
  // Decision tree evaluation
  const treeResult = decisionTreeEvaluation(params);

  // Scoring evaluation
  const scoreResult = scoringEvaluation(params);

  // Combine both: visible only if tree passes AND score >= 70
  return {
    isVisible: treeResult.isVisible && scoreResult.score >= 70,
    confidence: scoreResult.score,
    visibilityStatus: getStatusText(scoreResult.score),
    parameters: params,
    timestamp: new Date().toISOString(),
  };
}

function decisionTreeEvaluation(params: WeatherParameters): { isVisible: boolean; reason: string } {
  const { visibilityMiles, cloudCeilingFt, hasPrecipitation, cloudCoverPct } = params;

  // Check horizontal visibility
  if (visibilityMiles === null || visibilityMiles < 60) {
    return {
      isVisible: false,
      reason: `Insufficient horizontal visibility (${visibilityMiles} mi < 60 mi required)`,
    };
  }

  // Check for precipitation
  if (hasPrecipitation) {
    return {
      isVisible: false,
      reason: 'Active precipitation obscuring view',
    };
  }

  // Check cloud ceiling
  if (cloudCeilingFt !== null && cloudCeilingFt < 12000) {
    return {
      isVisible: false,
      reason: `Cloud ceiling too low (${cloudCeilingFt.toFixed(0)} ft < 12,000 ft required)`,
    };
  }

  // Check cloud cover
  if (cloudCoverPct !== null && cloudCoverPct > 75) {
    return {
      isVisible: false,
      reason: `Heavy cloud cover (${cloudCoverPct.toFixed(0)}% > 75%)`,
    };
  }

  return {
    isVisible: true,
    reason: 'All visibility conditions met',
  };
}

function scoringEvaluation(params: WeatherParameters): { score: number; breakdown: Record<string, number> } {
  const weights = {
    visibility: 0.35,
    ceiling: 0.30,
    cloudCover: 0.20,
    precipitation: 0.10,
    humidity: 0.05,
  };

  const scores = {
    visibility: scoreVisibility(params.visibilityMiles),
    ceiling: scoreCeiling(params.cloudCeilingFt),
    cloudCover: scoreCloudCover(params.cloudCoverPct),
    precipitation: scorePrecipitation(params.hasPrecipitation),
    humidity: scoreHumidity(params.humidityPct),
  };

  const totalScore = Object.keys(weights).reduce((sum, key) => {
    return sum + scores[key as keyof typeof scores] * weights[key as keyof typeof weights];
  }, 0);

  return {
    score: Math.round(totalScore),
    breakdown: scores,
  };
}

// Scoring functions
function scoreVisibility(visibilityMiles: number | null): number {
  if (visibilityMiles === null) return 50;
  if (visibilityMiles >= 65) return 100;
  if (visibilityMiles >= 50) return 70;
  if (visibilityMiles >= 30) return 50;
  if (visibilityMiles >= 10) return 20;
  return 0;
}

function scoreCeiling(ceilingFt: number | null): number {
  if (ceilingFt === null) return 100; // No ceiling = clear
  if (ceilingFt >= 14000) return 100;
  if (ceilingFt >= 11500) return 70;
  if (ceilingFt >= 8000) return 40;
  if (ceilingFt >= 5000) return 20;
  return 0;
}

function scoreCloudCover(cloudCoverPct: number | null): number {
  if (cloudCoverPct === null) return 50;
  if (cloudCoverPct <= 25) return 100;
  if (cloudCoverPct <= 50) return 60;
  if (cloudCoverPct <= 75) return 30;
  return 0;
}

function scorePrecipitation(hasPrecipitation: boolean): number {
  return hasPrecipitation ? 0 : 100;
}

function scoreHumidity(humidityPct: number | null): number {
  if (humidityPct === null) return 50;
  if (humidityPct < 70) return 100;
  if (humidityPct < 85) return 50;
  return 0;
}

function getStatusText(score: number): string {
  if (score >= 80) return "Likely Visible";
  if (score >= 60) return "Possibly Visible";
  if (score >= 40) return "Unlikely Visible";
  return "Not Visible";
}

// ============================================================================
// WEATHER STATE DETERMINATION
// ============================================================================

function determineWeatherState(params: WeatherParameters): 'SNOWING' | 'RAINING' | 'RAINIER_OUT' | 'DRY' {
  // Priority 1: Snowing (precipitation + temp <= 32°F)
  if (params.hasPrecipitation && params.temperature !== null && params.temperature <= 32) {
    return 'SNOWING';
  }

  // Priority 2: Raining (precipitation + temp > 32°F)
  if (params.hasPrecipitation && params.temperature !== null && params.temperature > 32) {
    return 'RAINING';
  }

  // Priority 3: Rainier Out (no precipitation + high visibility score)
  if (!params.hasPrecipitation) {
    const visibilityResult = evaluateRainierVisibility(params);
    if (visibilityResult.isVisible) {
      return 'RAINIER_OUT';
    }
  }

  // Priority 4: Dry/Overcast (default)
  return 'DRY';
}
