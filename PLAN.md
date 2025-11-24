# Rain or Rainier Implementation Plan

## 1. Project Setup
- Initialize Next.js project (TypeScript, Tailwind CSS, App Router).
- Configure fonts (Didot for headings, Gotham/Sans for body).
- Set up project structure.

## 2. Asset Management
- Move assets from `Assets/stills_backups` to `public/backgrounds`.
- Ensure all 4 states have a corresponding image:
    - `rainier-out.png`
    - `raining.png`
    - `snowing.png`
    - `dry.png`
- *Future-proofing*: Create a `BackgroundMedia` component that handles switching between these images now, but supports `<video>` tags for later.

## 3. Weather Logic & API (Server-Side)
- Create `lib/weather-service.ts`:
    - Implement the NWS + METAR fetching logic (from `mount_rainier_visibility_implementation.txt`).
    - Implement the "Rainier Visibility" heuristic (Decision Tree + Scoring).
    - Implement the "State Determination" logic to map data to one of the 4 states:
        1. **Snowing**: Precip + Temp ≤ 32°F
        2. **Raining**: Precip + Temp > 32°F
        3. **Rainier Out**: No Precip + Visibility Score High (≥70)
        4. **Dry**: Default (No Precip + Low Visibility)
- Create API Route `app/api/weather/route.ts`:
    - Calls the service.
    - Returns JSON: `{ state: 'RAINIER_OUT', temp: 58, humidity: 60, ... }`.
    - Implement caching (Next.js `unstable_cache` or simple time-based revalidation) to respect API limits.

## 4. Frontend Implementation
- **Main Page (`app/page.tsx`)**:
    - Fetch weather data from the internal API.
    - Render the `BackgroundMedia` component.
    - Render the `WeatherOverlay` component (Title + Stats grid).
- **Components**:
    - `WeatherOverlay`: Displays "Seattle, It's [State]" and stats (Temp, Feels Like, Precip, Visibility).
    - `LoadingState`: Simple fade-in or skeleton.

## 5. Testing & Verification
- Verify NWS API connectivity.
- Test logic with mock data to ensure all 4 states trigger correctly.
- Verify responsive design (Mobile vs Desktop).

## 6. Deployment Preparation
- Create `vercel.json` or `netlify.toml` if specific config is needed (likely standard Next.js build).
- Document environment variables (if any).

