# Ghost Identification System

Phasmophobia ghost identification helper — React frontend app.

## Stack

- **Vite + React + TypeScript** — `src/` is the entire app
- **No CSS-in-JS library** — inline styles referencing `src/theme/colors.ts`
- **No test framework yet** — `make lint && make build` is the quality gate
- **Docker** — multi-stage build serving via nginx; published to `ghcr.io` on merge to main

## Dev workflow

```bash
make install   # npm install
make dev       # vite dev server — http://localhost:5173
make build     # tsc + vite build → dist/
make lint      # eslint (max-warnings 0)
make preview   # build then serve dist/ locally
```

## Key files

| Path | Purpose |
|------|---------|
| `src/data/ghosts.json` | Single source of truth — all 27 ghosts, evidence, behaviors, interaction overrides |
| `src/theme/colors.ts` | Every color constant — edit here, nowhere else |
| `src/hooks/useGhostFilter.ts` | All filtering logic — evidence 3-state + interaction filters |
| `src/types/` | Shared TypeScript interfaces; `filters.ts` for UI filter state |
| `src/components/` | Flat component directory — no barrel index files |

## Data conventions

- `ghosts.json` has a top-level `interactions` array defining filterable behaviors with a `defaultValue`
- Each ghost carries only an `interactions` partial object — absent keys inherit the default
- Adding a new filter type: add an entry to `interactions[]` in the JSON and a new case in `FilterSidebar`

## Branch & PR rules

- **Never push directly to main** — branch protection is enabled
- Branch naming: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/` + kebab description (max 5 words)
- PRs require CI (lint + build) to pass before merge
- Docker image is published automatically on merge to main via `docker-publish.yml`
