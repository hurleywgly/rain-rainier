export type WeatherState = 'SNOWING' | 'RAINING' | 'RAINIER_OUT' | 'DRY';

export type DataStatus = 'fresh' | 'stale' | 'error';

export interface WeatherData {
  state: WeatherState;
  temperature: number;
  feelsLike: number;
  precipitationChance: number;
  visibility: number;
  timestamp: string;
  dataStatus: DataStatus;
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

// NWS API response types
export interface NWSObservation {
  properties: {
    temperature: { value: number | null } | null;
    windChill: { value: number | null } | null;
    heatIndex: { value: number | null } | null;
    visibility: { value: number | null } | null;
    relativeHumidity: { value: number | null } | null;
    textDescription: string | null;
    cloudLayers: CloudLayer[] | null;
  };
}

// METAR API response types
export interface METARResponse {
  temp?: number;
  visib?: string;
  clouds?: METARCloud[];
  wxString?: string;
  relh?: number;
}

// Internal type for fetched weather data
export interface WeatherFetchResult {
  nws_observation: NWSObservation | null;
  metar: METARResponse[] | null;
  timestamp: string;
}
