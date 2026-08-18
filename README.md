# WORLDPULSE

**See what's happening around the world.**

WORLD PULSE is a modular Global Event Intelligence platform — a real-time, interactive world map that aggregates and visualizes events across multiple categories: earthquakes, wildfires, floods, storms, volcanoes, live flights, vessels, weather, alerts, and infrastructure.

## Features

- **Interactive Dark World Map** — MapLibre-powered map with pulsing, color-coded event markers
- **Live Event Feed** — real-time stream of events with severity indicators, timestamps, and source attribution
- **AI Global Pulse Summary** — auto-generated natural-language overview of current world activity
- **Time Machine** — scrub through events by time with play/pause controls and presets (15m, 1h, 6h, 24h, All)
- **Map Layer Controls** — toggle each event type independently (Disasters, Live Tracking, Weather, Alerts, Infrastructure)
- **Search & Filters** — full-text search across events, severity filters, and category toggles
- **Event Detail Drawer** — rich detail view with type-specific metadata (magnitude/depth, altitude/speed/heading, containment %, etc.)
- **Real-time Updates** — Supabase subscriptions push new events to the map instantly

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Map:** MapLibre GL JS with CARTO dark basemap
- **Backend:** Supabase (PostgreSQL, Realtime subscriptions)
- **Icons:** Lucide React

## Project Structure

```
src/
├── components/        # UI components (map, feed, detail, controls)
├── data/              # Event type configuration & theming
├── hooks/             # Event fetching & filtering hooks
├── lib/               # Supabase client & formatting utilities
├── types/             # TypeScript type definitions
└── App.tsx            # Main application
```

## Getting Started

```bash
npm install
npm run dev
```

## Roadmap

This is V0.1 (Foundation). Planned modules:

- V0.2 — Enhanced world map (clusters, popups, historical events)
- V0.3 — Real disaster data ingestion (USGS, NASA FIRMS, GDACS)
- V0.4 — Live event engine (API ingestion, normalization, WebSockets)
- V0.5 — Flight tracker (ADS-B data)
- V0.6 — Vessel tracker (AIS data)
- V0.7 — Weather + severe weather alerts
- V0.8 — AI engine (summaries, classification, deduplication)
- V0.9 — User accounts, saved locations, personal alerts
- V1.0 — Production (CI/CD, monitoring, security, cloud deployment)

## Data Sources (Planned)

USGS, NASA FIRMS, NOAA, GDACS, ADS-B Exchange, AIS, Smithsonian Volcanoes

---

Built as a DevOps + Data Engineering + AI portfolio project.
