# Phasmophobia Ghost ID System

A real-time ghost identification tool for [Phasmophobia](https://store.steampowered.com/app/739630/Phasmophobia/). Filter by evidence and observed behaviors to narrow down which ghost you're dealing with.

**Live:** [gis.eroizzy.com](https://gis.eroizzy.com)

## Features

- Filter by all 7 evidence types (EMF 5, Spirit Box, Ultraviolet, Ghost Writing, Ghost Orb, Freezing Temps, DOTS Projector)
- Filter by observed behaviors (breaker box interaction, gender, handprint type, etc.)
- Covers all 29 ghost types including Kormos and Aswang
- Handles The Mimic's phantom Ghost Orb — marking Orb as confirmed keeps The Mimic visible
- Ghost cards dim when ruled out, highlight when confirmed
- Animated ghost silhouettes across the full viewport

## Stack

- Vite + React + TypeScript
- No CSS-in-JS library — inline styles via `src/theme/colors.ts`
- Docker (multi-stage) — dev container with HMR, prod served via nginx
- Published to `ghcr.io` on merge to main

## Dev

```bash
make install     # npm install
make dev         # Docker dev container at http://localhost:5173 (with HMR)
make dev-local   # run Vite directly without Docker
make lint        # ESLint (max-warnings 0)
make build       # tsc + vite build → dist/
make preview     # build then serve dist/ locally
```

## Adding a ghost

Edit `src/data/ghosts.json`. Each ghost entry needs:

```json
{
  "id": "uniqueId",
  "name": "Ghost Name",
  "evidence": ["emf5", "spiritBox", "ultraviolet"],
  "fakeEvidence": ["ghostOrb"],
  "strength": "...",
  "weakness": "...",
  "huntSanityThreshold": 50,
  "uniqueBehaviors": [],
  "identifyingClues": [],
  "interactions": {}
}
```

`fakeEvidence` is optional — only set it when the ghost reliably shows evidence that isn't part of its real three (e.g. The Mimic always emits Ghost Orb as a fake 4th clue).

## Adding a behavior filter

Add an entry to the top-level `interactions` array in `ghosts.json`:

```json
{
  "id": "myFilter",
  "label": "Human-readable label",
  "description": "...",
  "filterType": "toggle",
  "defaultValue": false,
  "trueLabel": "Yes",
  "falseLabel": "No"
}
```

Then set overrides on individual ghost entries as needed. No code changes required — the filter system is fully data-driven.

## Docker

```bash
# Production image
make docker-build
docker run -p 8080:80 ghost-identification-system

# Dev container (bind-mounted source, HMR enabled)
make dev
```

The production image is published automatically to `ghcr.io/issachar-vin/ghost-identification-system:latest` on every merge to main.
