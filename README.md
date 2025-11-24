# Rain or Rainier

A beautiful, minimal website that instantly answers Seattle's quintessential weather question: **Is it raining, or is Rainier out?**

## Features

- **Real-time Weather Detection**: Uses NWS and METAR APIs to determine current conditions
- **Mount Rainier Visibility Algorithm**: Sophisticated decision tree + scoring system to predict mountain visibility
- **Four Weather States**:
  - 🌧️ **Raining**: Active precipitation (temp > 32°F)
  - ❄️ **Snowing**: Active precipitation (temp ≤ 32°F)
  - 🏔️ **Rainier Out**: No precipitation + visibility score ≥70
  - ☁️ **Dry/Overcast**: Default fallback state
- **Cinematic Video Backgrounds**: Full-screen looping videos for each state
- **Auto-Refresh**: Updates every 15 minutes automatically
- **Mobile-First Design**: Fully responsive with beautiful typography

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - National Weather Service (NWS)
  - Aviation Weather Center (METAR)
- **Deployment**: Vercel/Netlify ready

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:
   ```
   NWS_CONTACT_EMAIL=your-email@example.com
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
rain_rainier/
├── app/
│   ├── api/weather/route.ts    # Weather API endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page with auto-refresh
│   └── globals.css             # Global styles
├── components/
│   ├── BackgroundVideo.tsx     # Video background component
│   ├── WeatherOverlay.tsx      # Typography overlay
│   └── LoadingState.tsx        # Loading screen
├── lib/
│   └── weather-service.ts      # Weather logic & API integration
├── types/
│   └── weather.ts              # TypeScript type definitions
├── public/
│   ├── videos/                 # Video backgrounds (4 states)
│   └── images/                 # Image fallbacks
└── Assets/                     # Original assets (not deployed)
```

## Mount Rainier Visibility Algorithm

The visibility detection uses a dual approach:

1. **Decision Tree** (Fast Binary Check):
   - Horizontal visibility ≥ 60 miles
   - No active precipitation
   - Cloud ceiling > 12,000 ft
   - Cloud cover < 75%

2. **Weighted Scoring** (0-100 Confidence):
   - Visibility: 35%
   - Cloud Ceiling: 30%
   - Cloud Cover: 20%
   - Precipitation: 10%
   - Humidity: 5%

**Result**: Mountain visible only if tree passes AND score ≥70

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variable: `NWS_CONTACT_EMAIL`
4. Deploy!

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variable: `NWS_CONTACT_EMAIL`
5. Deploy!

## API Rate Limits

- **NWS API**: Free, no API key required (cached 15 min)
- **METAR API**: Free, no API key required (cached 15 min)

Caching strategy ensures we stay well within rate limits.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- Requires JavaScript enabled
- Video autoplay supported

## Credits

**Created by Ryan**
Weather data from National Weather Service & Aviation Weather Center
Built for Seattle locals who love checking the weather

## License

Personal project - All rights reserved
