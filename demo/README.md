# NeuroPath — clickable demo prototype

Frontend-only, offline, synthetic-data prototype for the BioChallenge 2026 pitch.
Spec: [`../docs/NEUROPATH_DEMO_BRIEF.md`](../docs/NEUROPATH_DEMO_BRIEF.md).

```bash
cd demo
npm install
npm run dev     # development server
npm run demo    # production build + local preview on http://localhost:4173
npm run build   # static build in dist/
npm test        # unit tests (vitest)
```

`dist/index.html` also opens directly from the folder (double-click, `file://`). The build emits one classic script for exactly this reason, so it needs no server and no network.

## Structure

| Path | Purpose |
| --- | --- |
| `src/styles/theme.css` | Design tokens (Tailwind v4 `@theme`) taken from `docs/stitch_modular_brand_design_system/` |
| `src/strings/en.ts` | All UI copy (add `hu.ts` with the same `Strings` shape later) |
| `src/components/ui/` | Buttons, cards, badges, form controls, table, modal, notices |
| `src/components/charts/` | Recharts theme, sparkline, trend chart |
| `src/components/layout/` | Top bar, role switcher, disclaimer bar, toast |
| `src/store/demoStore.ts` | Shared in-memory state (Zustand) with deterministic reset |
| `src/pages/` | Start screen, role views, `#/design` component sample page |

Routes (hash-based): `#/`, `#/gp`, `#/specialist`, `#/patient`, `#/research`, `#/design`.
