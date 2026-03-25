# 🌧️ Mumbai MonsoonMap

> **A full-stack geospatial web application** that visualizes Mumbai's monsoon flood risk through interactive maps, real-time meteorological data, and GIS-enriched heatmaps. Built with React, Vite, and a Node.js/Express backend — deployable serverlessly on Vercel.

---

## 📌 Table of Contents

- [Overview](#overview)
- [GIS & Geospatial Architecture](#gis--geospatial-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [External Data Sources & APIs](#external-data-sources--apis)
- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [File Structure](#file-structure)
- [Setup & Installation](#setup--installation)
- [API Reference](#api-reference)
- [Tide Fallback Logic](#tide-fallback-logic)
- [Alert Computation Engine](#alert-computation-engine)

---

## Overview

Mumbai MonsoonMap is a spatial decision-support tool built to surface hyperlocal flood risk across Mumbai's 603 km² urban footprint. During monsoon season (June–September), Mumbai receives over 2,400mm of rainfall — concentrated into micro-watersheds shaped by the city's coastal geography, elevation gradients, and legacy drainage infrastructure.

This application fuses **live meteorological data**, **IMD (India Meteorological Department) district warnings**, **tidal sea-level readings**, and a curated **static GIS flood-zone dataset** into a single interactive map interface — enabling users to query any location in Mumbai and receive a computed, multi-factor flood risk assessment in real time.

---

## GIS & Geospatial Architecture

The application's core is a **geospatial enrichment pipeline** that operates on every location query. Here's how the GIS layers interact:

```
┌─────────────────────────────────────────────────────────────────┐
│                     GIS LAYER STACK                             │
│                                                                 │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │  Base Map   │   │  Flood Zone  │   │  Coastal Boundary    │ │
│  │  (Leaflet + │   │  Layer       │   │  Heuristic Layer     │ │
│  │  OpenStreet │   │  (Static GIS │   │  (Coordinate-based   │ │
│  │  Map tiles) │   │  Dataset)    │   │  proximity model)    │ │
│  └──────┬──────┘   └──────┬───────┘   └──────────┬───────────┘ │
│         │                 │                        │             │
│         └─────────────────┴────────────────────────┘            │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  Enrichment │                              │
│                    │  Engine     │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                  │
│         ▼                 ▼                 ▼                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Rainfall   │  │  IMD Alert   │  │  Tidal Sea   │          │
│  │  Intensity  │  │  Layer       │  │  Level Layer │          │
│  │  (per zone) │  │  (live API)  │  │  (coastal    │          │
│  └─────────────┘  └──────────────┘  │   only)      │          │
│                                     └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Spatial Operations Performed

| Operation | Method | Data Source |
|---|---|---|
| Forward Geocoding | REST (Nominatim) | OpenStreetMap |
| Reverse Geocoding | REST (Nominatim) | OpenStreetMap |
| Nearest Flood Zone Lookup | Euclidean distance (lat/lng) | Static GIS dataset |
| Coastal Proximity Detection | Haversine distance to reference points | Internal heuristic |
| Rainfall Intensity Mapping | Zone-attribute join | `floodZones.js` |
| Tidal Sea Level Fetch | Coordinate → Marine API | Open-Meteo |
| IMD Alert Spatial Join | District name → API lookup | IMD District Warnings API |

### Flood Zone Dataset

The internal `floodZones.js` dataset captures known Mumbai waterlogging hotspots, each record containing:

```
{
  id            — Unique zone identifier
  name          — Locality name (e.g., "Andheri Subway")
  lat / lng     — Centroid coordinates (WGS84)
  riskLevel     — Categorical risk: low | medium | high | critical
  waterLevel    — Historical peak water depth (metres)
  drainageCondition — Poor | Moderate | Good
  elevation     — Mean elevation (metres above MSL)
  historicalFloods  — Count of recorded flood events
  rainfallIntensity — Zone-calibrated mm/hr threshold
}
```

Nearest-zone matching uses a **minimum Euclidean distance** spatial join against the query coordinate — a lightweight, dependency-free alternative to PostGIS point-in-polygon, appropriate for the dataset scale.

---

## Key Features

- 🗺️ **Interactive GIS Map** — Dark-themed Leaflet map with dynamic marker placement, auto-centering, and zoom-to-location on every search
- 📍 **Location Search** — Free geocoding via OpenStreetMap Nominatim, supporting locality names, landmarks, and pin codes across Mumbai
- 🌊 **Multi-Factor Flood Risk Assessment** — Computed alert levels integrating rainfall intensity, IMD district warnings, and tidal context
- 🏖️ **Coastal Heuristic Layer** — Automatically detects coastal locations and appends tidal sea-level data from the Open-Meteo Marine API
- 🚨 **IMD Alert Integration** — Live Red / Orange / Yellow / None district warnings from India Meteorological Department
- 📊 **Alerts Dashboard** — Dedicated alerts page with computed risk breakdowns per searched location
- 🎨 **Alert Color Legend** — In-map legend showing CRITICAL / HIGH / MODERATE / LOW risk color coding

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Build Tool | Vite |
| Framework | React + TypeScript |
| Map Engine | react-leaflet (Leaflet.js) |
| Styling | TailwindCSS |
| Tile Provider | OpenStreetMap |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Middleware | CORS, express.json() |
| Architecture | MVC — routes → controllers → services |

---

## External Data Sources & APIs

| API | Endpoint | Auth | Purpose |
|---|---|---|---|
| IMD District Warnings | `mausam.imd.gov.in/api/warnings_district_api.php` | None | Live district-level met alerts |
| OSM Nominatim (Forward) | `nominatim.openstreetmap.org/search` | None | Place name → coordinates |
| OSM Nominatim (Reverse) | `nominatim.openstreetmap.org/reverse` | None | Coordinates → address |
| Open-Meteo Marine | `marine-api.open-meteo.com/v1/marine` | None | Sea level + tidal height |

All external APIs are **free and open** — no API keys required for deployment.

---

## System Architecture

```
                    ┌────────────────────────────┐
                    │        User Browser         │
                    │  React + Leaflet Frontend   │
                    │  Search │ Map │ Alerts View  │
                    └───────────────┬─────────────┘
                                    │  HTTP fetch()
                                    ▼
                    ┌────────────────────────────┐
                    │      Express REST API        │
                    │       localhost:5000          │
                    │                              │
                    │  GET /api/search?query=      │
                    │  GET /api/location?lat=&lng= │
                    └──────┬──────────────┬────────┘
                           │              │
              ┌────────────┘              └─────────────┐
              │                                         │
              ▼                                         ▼
  ┌───────────────────────┐             ┌───────────────────────────┐
  │   Geospatial Services │             │   Meteorological Services │
  │                       │             │                           │
  │  nominatimService.js  │             │  imdService.js            │
  │  coastalHeuristic.js  │             │  tideService.js           │
  │  mumbaiEnrichment     │             │  alertService.js          │
  │  Service.js           │             │                           │
  └──────────┬────────────┘             └───────────────┬───────────┘
             │                                          │
     ┌───────┴───────┐                    ┌─────────────┴──────────┐
     ▼               ▼                    ▼                        ▼
┌─────────┐   ┌───────────┐        ┌──────────┐         ┌──────────────┐
│Nominatim│   │ floodZones│        │  IMD API │         │ Open-Meteo   │
│  (OSM)  │   │    .js    │        │ (mausam) │         │ Marine API   │
└─────────┘   └───────────┘        └──────────┘         └──────────────┘
```

---

## Data Flow

### Search Flow

```
User types location query
         │
         ▼
Frontend: GET /api/search?query=<place>
         │
         ▼
Backend: nominatimService  ──→  OSM Nominatim  ──→  [candidates]
         │
         ▼
For each candidate:
  ├── mumbaiEnrichmentService  →  nearest flood zone (spatial join)
  ├── alertService             →  rainfallIntensity + threshold check
  ├── imdService               →  district warning level (cached)
  └── coastalHeuristic         →  is coastal?
         │                              │
         │                        YES   ▼
         │                     tideService → Open-Meteo marine API
         │                              │
         ▼                              ▼
  Merged enriched result (alertLevel + rainfall + imd + tide?)
         │
         ▼
Frontend: places marker, centers map, shows BottomDrawer
```

### Alert Computation Flow

```
Rainfall threshold exceeded?  ──YES──┐
        │                            │
        NO                           │   IMD Warning exists?  ──YES──→  CRITICAL
        │                            └──→       │
        ▼                                       NO
IMD Warning exists?                             │
   │                                            ▼
  YES ──→ HIGH / MODERATE (by IMD level)     HIGH (rainfall only, threshold exceeded)
   │
   NO ──→ LOW (no rain threshold, no IMD)
```

---

## File Structure

```
monsoon-map/
│
├── README.md
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
│
├── src/
│   ├── pages/
│   │   ├── Index.tsx          # Main map view
│   │   ├── Alerts.tsx         # Computed alerts dashboard
│   │   ├── AreaDetail.tsx     # Per-location flood detail view
│   │   └── Simulation.tsx     # Flood scenario simulation
│   │
│   ├── components/
│   │   └── map/
│   │       ├── SearchBar.tsx  # Location search input
│   │       ├── AlertLegend.tsx # Risk color legend overlay
│   │       └── BottomDrawer.tsx # Location detail drawer
│   │
│   └── lib/
│       └── api.ts             # Frontend API client
│
└── backend/
    ├── package.json
    ├── .env
    │
    └── src/
        ├── server.js          # Entry point
        ├── app.js             # Express app config
        │
        ├── routes/
        │   └── index.routes.js
        │
        ├── controllers/
        │   ├── searchController.js
        │   ├── locationController.js
        │   ├── healthController.js
        │   └── dataController.js
        │
        ├── services/
        │   ├── nominatimService.js      # OSM geocoding proxy
        │   ├── imdService.js            # IMD warning fetcher + cache
        │   ├── alertService.js          # Multi-factor alert computation
        │   ├── searchService.js         # Search orchestration
        │   ├── locationService.js       # Reverse geocode + enrichment
        │   ├── tideService.js           # Open-Meteo marine API client
        │   ├── coastalHeuristic.js      # Coordinate-based coastal detection
        │   └── mumbaiEnrichmentService.js # Flood zone spatial join
        │
        └── data/
            ├── mumbaiLocations.js       # Curated Mumbai localities
            └── floodZones.js            # GIS flood zone dataset
```

---

## Setup & Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mumbai-monsoonmap.git
cd mumbai-monsoonmap
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment

```bash
# backend/.env
PORT=5000
```

Frontend optionally reads:
```bash
# .env (root)
VITE_API_BASE_URL=http://localhost:5000
```

### 5. Run the application

**Frontend** (from project root):
```bash
npm run dev
# → http://localhost:8080/
```

**Backend** (from `/backend`):
```bash
npm run dev
# → http://localhost:5000/
```

---

## API Reference

### Health Check

```
GET /
→ "Backend is running"
```

### Search — Geocode + GIS Enrichment

```
GET /api/search?query=<place>
```

**Response schema:**
```json
[
  {
    "name": "Vile Parle",
    "display_name": "Vile Parle, Mumbai Suburban, Maharashtra, India",
    "latitude": 19.0999,
    "longitude": 72.8440,
    "address": "Vile Parle, Mumbai Suburban",
    "alertLevel": "HIGH",
    "rainfall": {
      "rainfallIntensity": 80,
      "riskLevel": "high",
      "rainfallAlertLevel": "HIGH",
      "thresholdExceeded": true
    },
    "imd": {
      "available": false,
      "district": "Mumbai Suburban",
      "level": "None"
    },
    "floodZone": {
      "id": "4",
      "name": "Andheri Subway",
      "lat": 19.1197,
      "lng": 72.8464,
      "riskLevel": "high",
      "waterLevel": "1.0m",
      "drainageCondition": "Poor",
      "elevation": 5,
      "historicalFloods": 9,
      "rainfallIntensity": 80
    },
    "tide": {
      "tideType": "HIGH",
      "tideLevel": 0.2,
      "tideRisk": "medium"
    }
  }
]
```

> `tide` is **only present** for coastal locations. Non-coastal responses omit all tide fields.

### Reverse Geocode + GIS Enrichment

```
GET /api/location?lat=<lat>&lng=<lng>
GET /api/location?latitude=<lat>&longitude=<lng>
```

**Example:**
```bash
curl "http://localhost:5000/api/location?latitude=18.91&longitude=72.82"
```

---

## Tide Fallback Logic

Tidal sea-level data is conditionally layered onto the flood risk model for coastal locations only.

```
Query coordinate received
         │
         ▼
coastalHeuristic.js:
  compute Haversine distance to N coastal reference points
         │
  ┌──────┴──────┐
  │  < threshold │──YES──→  fetch Open-Meteo marine API
  │              │              │
  └──────────────┘          derive:
         │                    tideType  (HIGH | LOW)
         NO                  tideLevel (metres)
         │                    tideRisk  (low | medium | high)
         ▼                        │
  omit tide fields ←──────────────┘ append to enriched result
```

Tide data is an **additive layer** — it does not replace or modify the rainfall/IMD alert computation.

---

## Alert Computation Engine

Alert levels follow a priority-merge across three independent data sources:

| Condition | Resulting Alert |
|---|---|
| Rainfall threshold exceeded **AND** IMD warning present | `CRITICAL` |
| IMD Red warning only | `HIGH` |
| IMD Orange warning only | `MODERATE` |
| Rainfall threshold exceeded only | `HIGH` |
| IMD Yellow warning only | `MODERATE` |
| No threshold breach, no IMD warning | `LOW` |

Alert levels map to map marker colors: 🔴 CRITICAL → 🟠 HIGH → 🟡 MODERATE → 🟢 LOW

---

## License

MIT — open for use, extension, and contribution.
