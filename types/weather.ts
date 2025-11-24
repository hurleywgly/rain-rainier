export type WeatherState = 'SNOWING' | 'RAINING' | 'RAINIER_OUT' | 'DRY';

export interface WeatherData {
  state: WeatherState;
  temperature: number;
  feelsLike: number;
  precipitationChance: number;
  visibility: number;
  timestamp: string;
}

export interface WeatherParameters {
  visibilityMiles: number | null;
  cloudCeilingFt: number | null;
  cloudCoverPct: number | null;
  hasPrecipitation: boolean;
  humidityPct: number | null;
  weatherDescription: string | null;
  temperature: number | null;
  feelsLike: number | null;
}

export interface VisibilityResult {
  isVisible: boolean;
  confidence: number;
  visibilityStatus: string;
  parameters: WeatherParameters;
  timestamp: string;
}

export interface CloudLayer {
  amount?: string;
  base?: {
    value: number;
  };
}

export interface METARCloud {
  cover: string;
  base: number;
}
