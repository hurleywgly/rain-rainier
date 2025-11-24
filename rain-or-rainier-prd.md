# Rain or Rainier - Product Requirements Document

## Overview

**Product Name:** Rain or Rainier  
**Version:** 1.0 (MVP)  
**Date:** November 2025  
**Owner:** Ryan

---

## Problem Statement

Seattle locals constantly wonder about two things: "Is it raining?" and "Is Rainier out?" There's no simple, beautiful way to get an instant visual answer to these questions without checking multiple weather apps or looking out the window.

---

## Product Vision

A visually stunning, minimal website that instantly answers the quintessential Seattle weather question through beautiful, dynamic video backgrounds and essential weather data. The site eliminates decision fatigue by making the weather state immediately obvious through cinematic visuals.

---

## Target Users

**Primary Users:**
- Ryan and his wife (Seattle locals, Ballard/98117)
- Daily weather checkers who want quick, visual answers

**Secondary Users:**
- Photographers timing Mount Rainier visibility for golden hour shots
- Seattle residents who appreciate beautiful, locally-relevant design

---

## Core User Stories

### As a Seattle local...
1. **I want to instantly know if it's raining** so I can decide whether to grab an umbrella before leaving the house
2. **I want to know if Mount Rainier is visible** so I can plan outdoor activities or photography
3. **I want beautiful, locally-relevant visuals** so checking the weather feels delightful rather than utilitarian
4. **I want essential weather data at a glance** so I can understand conditions beyond just rain/shine
5. **I want the site to work seamlessly on my phone** so I can check it while getting ready in the morning

### As a photographer...
6. **I want to know when Rainier is visible** so I can time my drives to viewpoints for optimal shots
7. **I want visibility data** so I can assess atmospheric conditions for photography

---

## Product Requirements

### Functional Requirements

#### 1. Weather State Detection
- System automatically determines current weather state based on real-time data
- Four possible states:
  1. **Raining** - Active precipitation in Seattle area
  2. **Rainier Out** - Mountain is visible (clear conditions)
  3. **Dry/Overcast** - No rain, but Rainier not visible
  4. **Snowing** - Winter precipitation

#### 2. Visual Presentation
- Each weather state shows a unique, looping video background:
  - **Raining:** Pacific Northwest forest in heavy rain with raindrops on lens
  - **Rainier Out:** Mount Rainier dominating frame from Aurora Bridge viewpoint
  - **Dry/Overcast:** Seattle cityscape with Space Needle, Rainier barely visible through haze
  - **Snowing:** Green Lake with snow-covered bench, gentle snowfall
- Video backgrounds loop seamlessly
- Videos are cinematic, photorealistic, with natural color grading

#### 3. Weather Data Display
Display the following data for all four states:
- **Temperature** (°F)
- **Feels Like Temperature** (°F)
- **Precipitation Percentage** (%)
- **Visibility** (miles)

Data presented with minimal, elegant typography (Didot or similar serif font)

#### 4. Auto-Refresh Behavior
- Site automatically updates weather state when conditions change
- Updates are performant and seamless (no jarring page reloads)
- Check weather API every 10-15 minutes for state changes
- Cache results to minimize API calls

#### 5. Location
- Hardcoded to ZIP code 98117 (Ballard, Seattle)
- No user configuration of location
- Personal use only (not multi-tenant)

#### 6. Rainier Visibility Logic
- System uses algorithmic decision-making to determine if Rainier is visible
- Confidence scoring happens behind the scenes (not shown to user)
- Logic considers:
  - Horizontal visibility distance
  - Cloud ceiling height
  - Cloud cover percentage
  - Precipitation status
  - Atmospheric conditions

### Non-Functional Requirements

#### 1. Performance
- Initial page load: <3 seconds
- Video backgrounds: Optimized file sizes for web delivery
- Smooth transitions between states
- Minimal API calls through caching strategy

#### 2. Mobile Responsiveness
- Fully responsive design works on all screen sizes
- Mobile-first approach (primary use case is morning phone check)
- Touch-friendly interface
- Video backgrounds adapt to portrait and landscape orientations
- Typography scales appropriately for mobile screens

#### 3. Reliability
- Graceful degradation if APIs are unavailable
- Fallback to cached weather state if real-time data fails
- Error states handled invisibly (don't show technical errors to users)

#### 4. Accessibility
- High contrast between text and background for readability
- Semantic HTML structure
- Alt text for any non-decorative elements

---

## User Experience

### Primary User Flow
1. User opens website (bookmark or direct URL)
2. Site immediately displays current weather state with video background
3. User sees large text stating condition: "Seattle is Raining" / "Rainier is Out" / etc.
4. User sees essential weather data below headline
5. User gets instant visual + data answer to their question
6. **End of interaction** - no clicks, no navigation, just information

### Interaction Model
- **Zero-interaction required** - This is a "look at it" experience
- No buttons, no controls, no user input
- Site updates automatically in background
- Simple, focused single-page application

---

## Technical Scope (High-Level)

### What's Included in V1
- Four weather states with video backgrounds
- Real-time weather data integration
- Mount Rainier visibility detection algorithm
- Responsive design (mobile + desktop)
- Auto-refresh functionality
- Serverless deployment

### What's Explicitly NOT Included
- User accounts or authentication
- Location selection/customization
- Historical weather data
- Social sharing features
- Notifications or alerts
- Fog state (reserved for potential future iteration)
- Fahrenheit/Celsius toggle
- Manual refresh button
- Settings or preferences

---

## Success Metrics

### Qualitative
- Site provides instant, accurate answer to "Is it raining?" or "Is Rainier out?"
- Experience feels delightful and locally authentic
- Users prefer this to checking traditional weather apps

### Quantitative (Informal)
- Correct weather state detection >90% of the time
- Rainier visibility accuracy validated against real-world observations
- Page load performance <3 seconds on 4G connection
- Mobile usability confirmed through daily usage

---

## Design Principles

1. **Instant Clarity** - The answer should be obvious within 1 second of page load
2. **Visual First** - The video background tells the story before you read any text
3. **Minimal Data** - Only essential information, no clutter
4. **Local Authenticity** - Every visual element should feel distinctly Seattle/PNW
5. **Delightful Simplicity** - Beautiful enough to check daily, simple enough to understand instantly

---

## Dependencies

### External Services
- National Weather Service API (weather data)
- Aviation METAR API (cloud ceiling data for Rainier visibility)

### Assets
- Four looping video backgrounds (5-21 seconds each)
- Typography fonts (system fonts preferred for performance)

### Technical
- Serverless hosting platform (Netlify)
- Rainier visibility detection algorithm (Python/JavaScript)
- Weather data caching layer

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits exceeded | Site stops updating | Implement aggressive caching (10-15 min), monitor usage |
| Rainier visibility algorithm inaccurate | User trust degraded | Validate against real observations, tune thresholds iteratively |
| Video files too large | Slow page loads on mobile | Compress videos, consider lower-res versions for mobile |
| Weather API downtime | Site shows stale data | Cache last known state, implement fallback APIs |

---

## Future Considerations (Out of Scope for V1)

While explicitly not included in this version, potential future enhancements could include:
- Fog state (fifth weather condition)
- Multiple location support
- Seasonal video variations (e.g., summer vs winter Rainier)
- Time-of-day variations (sunrise/sunset/golden hour timing)
- Share/screenshot functionality
- Browser notifications when Rainier becomes visible

---

## Appendix: State Transition Logic

```
Weather State Priority (from highest to lowest):

1. SNOWING
   - Precipitation detected AND temperature ≤ 33°F

2. RAINING  
   - Precipitation detected AND temperature > 33°F

3. RAINIER OUT
   - Rainier visibility confidence ≥ 80%
   - No active precipitation
   
4. DRY/OVERCAST (Default)
   - All other conditions
   - Rainier visibility confidence < 80%
   - No active precipitation
```

---

**Document Version:** 1.0  
**Last Updated:** November 16, 2025  
**Status:** Ready for Implementation
