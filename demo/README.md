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

## Deploying on Vercel

Static, frontend-only, no serverless functions. In the Vercel project settings set **Root Directory = `demo`**; `vercel.json` sets the Vite build (`npm run build` → `dist/`). The repository root is an older, unrelated Next.js app.

`dist/index.html` also opens directly from the folder (double-click, `file://`). The build emits one classic script for exactly this reason, so it needs no server and no network.

## Structure

| Path | Purpose |
| --- | --- |
| `src/styles/theme.css` | Design tokens (Tailwind v4 `@theme`) taken from `docs/stitch_modular_brand_design_system/` |
| `src/strings/en.ts` | All UI copy (add `hu.ts` with the same `Strings` shape later) |
| `src/components/ui/` | Buttons, cards, badges, form controls, table, modal, notices |
| `src/components/charts/` | Recharts theme, sparkline, trend chart |
| `src/components/layout/` | Top bar, role switcher, disclaimer bar, toast |
| `src/data/seed.ts` | Deterministic synthetic panel (25 patients, hero Erzsébet K.) |
| `src/logic/risk.ts` | Transparent rule-based risk model (illustrative, not validated) + tests |
| `src/logic/mbi.ts` | Behavioral check items and scoring |
| `src/features/gp/` | GP panel, patient detail, behavioral check, recommendation, decision, referral |
| `src/features/patient/` | Phone-frame patient view: notification, message, what happens next |
| `src/features/specialist/` | Referral inbox, structured referral view, cognitive assessment and diagnosis form |
| `src/store/demoStore.ts` | Shared in-memory state (Zustand) with deterministic reset |
| `src/pages/` | Start screen, role views, `#/design` component sample page |

Routes (hash-based): `#/`, `#/gp`, `#/gp/patient/:id`, `#/specialist`, `#/specialist/referral/:id`, `#/patient` (`?screen=lock|message|next`), `#/research`, `#/design`.

## Guided demo and keyboard shortcuts

"Start guided demo" (top bar or start screen) resets the data and walks the Erzsébet story in 13 steps across all four roles, highlighting what to click.

| Key | Action |
| --- | --- |
| `→` / `Space` | Next step |
| `←` | Previous step |
| `A` | Auto-play the whole story (~40 s); press again to pause |
| `R` | Reset all demo data instantly (restarts the guide at step 1) |
| `G` | Start the guide, or hide/show the step card |
| `1` `2` `3` `4` | Jump to GP, Specialist, Patient, Research & Pharma |
| `Esc` | End the guide (data stays as is) |

Shortcuts are ignored while typing in a form field. Steps are data plus idempotent store actions (`src/features/guide/steps.ts`): every step rebuilds its state by resetting and replaying the earlier steps, so back, jump, auto-play and reset always agree, and the same seed always gives the same numbers.
