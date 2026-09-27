import type { SeasonTheme } from '@/lib/season-theme';

interface AtmosphereProps {
  kind: SeasonTheme['atmosphere'];
}

/**
 * Pure-CSS ambient layer drawn over the footage. Deliberately faint: the
 * video carries the scene, this just adds depth. All motion lives in
 * globals.css and is disabled under prefers-reduced-motion.
 */
export function Atmosphere({ kind }: AtmosphereProps) {
  switch (kind) {
    case 'alpenglow':
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="atmo-alpenglow" />
        </div>
      );
    case 'haze':
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="atmo-haze atmo-haze--near" />
          <div className="atmo-haze atmo-haze--far" />
        </div>
      );
    case 'rain':
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="atmo-rain atmo-rain--far" />
          <div className="atmo-rain atmo-rain--near" />
        </div>
      );
    case 'snow':
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="atmo-snow atmo-snow--far" />
          <div className="atmo-snow atmo-snow--near" />
        </div>
      );
  }
}
