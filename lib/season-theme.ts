import type { WeatherState } from '@/types/weather';

/**
 * Presentation-only art direction for each weather state ("season").
 * Nothing here affects how the state is determined — it only styles it.
 */
export interface SeasonTheme {
  /** Poster still (optimized WebP) shown before/without the video. */
  poster: string;
  /** Looping background video. */
  video: string;
  /** Solid fallback while the poster is still decoding. */
  base: string;
  /** Colour-grade layer laid over the footage to unify it with the palette. */
  grade: string;
  /** Readability scrim — darkens behind the headline and the metrics row. */
  scrim: string;
  /** Accent used for labels, the rule, and small UI details. */
  accent: string;
  /** Soft glow behind the headline so it lifts off busy footage. */
  glow: string;
  /** Which ambient layer to render on top of the footage. */
  atmosphere: 'alpenglow' | 'haze' | 'rain' | 'snow';
}

export const seasonThemes: Record<WeatherState, SeasonTheme> = {
  // Clear, cold, gold light on the mountain.
  RAINIER_OUT: {
    poster: '/images/rainier-out.webp',
    video: '/videos/rainier-out.mp4',
    base: '#2b3446',
    grade:
      'linear-gradient(180deg, rgba(255,176,120,0.18) 0%, rgba(255,214,170,0.06) 38%, rgba(20,28,48,0) 60%)',
    scrim:
      'radial-gradient(120% 70% at 0% 0%, rgba(18,22,38,0.62) 0%, rgba(18,22,38,0.25) 45%, rgba(18,22,38,0) 70%), linear-gradient(0deg, rgba(14,18,30,0.78) 0%, rgba(14,18,30,0.35) 30%, rgba(14,18,30,0) 55%)',
    accent: '#F6C98B',
    glow: 'rgba(255, 196, 140, 0.35)',
    atmosphere: 'alpenglow',
  },
  // Puget Sound pewter — the default Seattle grey.
  DRY: {
    poster: '/images/dry.webp',
    video: '/videos/dry.mp4',
    base: '#3a4048',
    grade:
      'linear-gradient(180deg, rgba(196,208,220,0.10) 0%, rgba(120,134,150,0.08) 50%, rgba(40,46,56,0.10) 100%)',
    scrim:
      'radial-gradient(120% 70% at 0% 0%, rgba(26,30,38,0.6) 0%, rgba(26,30,38,0.22) 45%, rgba(26,30,38,0) 70%), linear-gradient(0deg, rgba(22,26,32,0.8) 0%, rgba(22,26,32,0.35) 30%, rgba(22,26,32,0) 55%)',
    accent: '#C9D6E2',
    glow: 'rgba(200, 214, 228, 0.22)',
    atmosphere: 'haze',
  },
  // Deep evergreen and wet slate.
  RAINING: {
    poster: '/images/raining.webp',
    video: '/videos/raining.mp4',
    base: '#16211f',
    grade:
      'linear-gradient(180deg, rgba(40,72,70,0.22) 0%, rgba(20,40,40,0.10) 55%, rgba(8,16,18,0.2) 100%)',
    scrim:
      'radial-gradient(120% 70% at 0% 0%, rgba(8,16,16,0.66) 0%, rgba(8,16,16,0.28) 45%, rgba(8,16,16,0) 70%), linear-gradient(0deg, rgba(6,12,14,0.82) 0%, rgba(6,12,14,0.38) 30%, rgba(6,12,14,0) 55%)',
    accent: '#9FD3C7',
    glow: 'rgba(120, 190, 178, 0.25)',
    atmosphere: 'rain',
  },
  // Ice blue — needs the heaviest scrim because the footage is mostly white.
  SNOWING: {
    poster: '/images/snowing.webp',
    video: '/videos/snowing.mp4',
    base: '#5b6778',
    grade:
      'linear-gradient(180deg, rgba(120,150,190,0.22) 0%, rgba(160,184,214,0.10) 50%, rgba(40,56,84,0.18) 100%)',
    scrim:
      'radial-gradient(130% 80% at 0% 0%, rgba(22,32,52,0.78) 0%, rgba(22,32,52,0.42) 45%, rgba(22,32,52,0) 72%), linear-gradient(0deg, rgba(18,28,46,0.86) 0%, rgba(18,28,46,0.5) 32%, rgba(18,28,46,0) 58%)',
    accent: '#CFE3FF',
    glow: 'rgba(170, 200, 240, 0.3)',
    atmosphere: 'snow',
  },
};
