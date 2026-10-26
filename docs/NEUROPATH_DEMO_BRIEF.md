# NeuroPath — Clickable Demo Prototype: Developer Brief

You are building a **clickable, demo-grade web prototype** for NeuroPath, a dementia-risk triage and care-pathway startup. It will be shown to a startup-competition jury (BioChallenge 2026) that includes clinicians, investors and pharma people. The goal is to make the jury believe that this business can actually be implemented. The prototype must be credible, honest about what is simulated, visually polished, and impossible to break on stage.

This is **not** a marketing website and **not** a production medical system. It is a frontend-only prototype with synthetic data.

---

## 0. Before writing any code

1. **Read the design system first.** These are mandatory and override your own taste:
   - `docs/DESIGN.md`
   - `docs/stitch_modular_brand_design_system/DESIGN.md`
   - `docs/stitch_modular_brand_design_system/code.html`: the reference implementation. Reuse its tokens, component patterns, spacing, radii, shadows and class conventions.
   - `docs/stitch_modular_brand_design_system/screen.png`: the visual target. Open and look at it.
2. **Inspect the repository.** There is an existing pitch presentation (`index.html`, `styles.css`, `presentation.js`). **Do not modify or break it.** Propose where the prototype should live (e.g. `/demo` or `/apps/demo`) and how it can be opened from the presentation later.
3. **Report back before building.** Give a short summary of the following, then wait for approval:
   - The design tokens you extracted (colors, type scale, spacing, radii, shadows, component list).
   - Any conflicts between the two DESIGN.md files and `code.html`.
   - Your proposed file structure and stack.
   - Your plan, broken into the phases in section 7.

   Where sources conflict, the files in `stitch_modular_brand_design_system/` win for components and visuals. If the conflict matters, ask.

**Brand fallback** (use only where the design docs are silent):
- Navy `#0B1D3A` (primary text, headers)
- Teal `#1BA7A8` (primary accent, CTAs)
- Blue `#4C7DBA` (secondary accent, data)
- Mint `#E6F2F2` (soft surfaces)
- Light grey `#F1F3F6` (app background)
- Cream `#FAF7F2` (warm surfaces)
- Font: Inter
- Tagline: "Early insight. Better care. Together."

Tone: trustworthy, human-centered, clear, clinical, innovative. Use a calm medical-SaaS look, not a flashy startup look.

---

## 1. Tech stack and constraints

- **Stack:** Vite + React + TypeScript. Use Tailwind if `code.html` uses Tailwind (match its config and tokens); otherwise use CSS variables taken from the design docs.
- **State:** one shared in-memory store (Zustand or React context). An action taken in one role must appear in the other roles.
- **Routing:** hash-based routing (`react-router` with `HashRouter`), so the build works from any static host or a local folder.
- **Backend:** none. No API calls and no external network calls at runtime.
- **Offline:** the demo must run with **no internet**, because venue Wi-Fi fails.
  - Self-host the fonts (`@fontsource/inter`), with no Google Fonts CDN.
  - Bundle every icon and asset locally.
- **Libraries:** charts with `recharts` (or similar, bundled). Icons with `lucide-react`, styled to match the design system.
- **Build output:** `npm run build` must produce a static `dist/` with a relative `base`. Also add `npm run demo`, which builds and serves locally.
- **Displays:** desktop-first, designed for a 1920×1080 projector and a 1440×900 laptop. The patient screens are shown inside a phone-frame mockup.
- **Language:** English UI. Keep all copy in one strings file so a Hungarian translation can be added later. You do not need to build the HU translation now.
- **Code quality:** no console errors, TypeScript strict mode, components that are small and named clearly.

---

## 2. Honesty and compliance rules (non-negotiable)

The jury includes neurologists. Inflated claims destroy credibility.

- **Disclaimer.** A persistent, subtle banner or footer reads: *"Prototype · Synthetic data · Not a medical device · Risk logic is illustrative pending clinical validation."*
- **Risk model labelling.** The risk model is a **transparent, rule-based placeholder**. Label it in the UI as "Prototype risk logic (literature-based factors); to be replaced by models validated in the clinical pilot."
  - Do **not** show accuracy, AUC, sensitivity or any validation metrics.
  - Do **not** call it "AI-diagnosed."
- **Decision support, not diagnosis.** Every recommendation is framed as decision support. The clinician makes the final decision, and the UI should always show a "Clinician decision" step.
- **Synthetic data.** All patients are fictional, and the UI says so.
- **Pharma view.** Show aggregate data only.
  - Suppress any cell with n < 10 and show "<10" instead.
  - No names, no IDs, no patient-level rows.
  - Include a visible "Anonymization: aggregated, small cells suppressed, GDPR-compliant registry (planned)" note.
- **Third-party marks.** Do not use real logos or trademarks of Cambridge Cognition, Biogen, EESZT or any other company. Use neutral text labels such as "Digital cognitive assessment (partner-validated instrument)" or "National eHealth record import (simulated)."
- **Questionnaire wording.** Behavioral (MBI) items must be short paraphrased placeholder items, not reproduced verbatim from any published instrument.

---

## 3. The demo story (the spine of the app)

Everything follows **one synthetic patient end to end**, plus a realistic panel of background patients.

**Hero patient**
- Erzsébet K., 68, female.
- Type 2 diabetes and hypertension, attending a routine GP chronic-care check-up.
- Labs:
  - HbA1c rising over 3 years.
  - eGFR mildly reduced.
  - Blood pressure variable / poorly controlled.
  - Mild subjective memory complaint noted by her daughter.
  - Behavioral change: new irritability and loss of interest over the last 6+ months.

**The flow**
1. **GP:** opens the panel and sees Erzsébet flagged.
2. **GP:** sees the risk and *why*.
3. **GP:** completes a 1-minute structured behavioral check.
4. **GP:** gets a recommendation, makes the clinician decision, and refers her.
5. **Patient:** receives a plain-language notification on her phone.
6. **Specialist:** receives a pre-filled structured referral, records the cognitive assessment and a working diagnosis (e.g. MCI, suspected AD aetiology), and records registry consent.
7. **Pharma / research:** the anonymized registry cohort updates. Pre-qualified MCI candidates in the region tick up by one, and the screening-efficiency estimate updates.

---

## 4. Screens

### 4.0 Start / role picker
- NeuroPath logo, built from the design-system logo or an SVG equivalent, with the tagline.
- Four role cards: **GP**, **Specialist**, **Patient**, **Research & Pharma**.
- Primary button: **"Start guided demo"** (see section 5).
- A small "Reset demo data" link.

### 4.1 GP / primary-care view (the core; spend most effort here)

**Patient panel**
- About 25 synthetic chronic-care patients.
- Columns: name, age, conditions, last visit, NeuroPath risk band (Low / Moderate / High), status (New flag / Referred / Follow-up).
- Filters by risk band. Erzsébet is near the top as **High · New flag**.

**Patient detail**
- **Header:** name, age, sex, conditions, and the data source labelled *"Imported from national eHealth record (simulated)."*
- **Lab trends:** small sparkline or line charts for HbA1c, fasting glucose, eGFR and systolic/diastolic BP over about 3 years.
- **Risk card**
  - Risk band plus score on a clear visual scale.
  - **Top contributing factors** with direction and relative weight, in plain language. Example: "HbA1c trend ↑ (high contribution)", "BP variability (moderate)", "Age 68 (moderate)", "Reported behavioral change (moderate)".
  - Model label as described in section 2.
- **Structured behavioral check (MBI)**
  - 6–8 short items on Yes/No or frequency scales, grouped into domains: motivation, mood, impulse control, social appropriateness, beliefs/perception.
  - A visible timer, "~1 min."
  - Completing it updates the risk card live.
- **Recommendation panel**
  - "Recommended: referral to memory clinic. Suggested next step: digital cognitive assessment. Consider: further work-up per specialist."
  - Also "Not recommended now", explaining which unnecessary tests are avoided, for low-risk patients.
- **Clinician decision:** Refer / Monitor (re-screen in 6 or 12 months) / Dismiss with reason.
- **Referral modal:** a structured referral auto-filled from the record. The GP can add a note. One click sends it.
- **Workflow time indicator:** "Time added to visit: ~2 min." This must be shown, because the jury will ask about it.

### 4.2 Patient view (minimal; phone-frame mockup)
- **Notification:** "Your doctor recommends a memory check." The tone is calm and non-alarming, with plain language at about a reading age of 12.
- **"What happens next"** screen with 3 steps, the appointment date and clinic, a "What to bring" list, and a "Questions? Call…" line.
- **Optional:** a caregiver-share toggle ("Share updates with my daughter").
- Two or three screens maximum. **Do not build a full patient app.**

### 4.3 Specialist (neurologist / memory clinic) view (small)
- **Referral inbox.** Erzsébet's referral appears after the GP sends it.
- **Structured referral view:** the reason for referral, risk contributors, lab trends, behavioral check results and GP note, all on one page.
- **Record cognitive assessment.** Enter a result from a "partner-validated digital cognitive assessment," shown as a placeholder score and domain profile.
- **Working diagnosis:** a dropdown (e.g. normal / SCD / MCI / dementia) and a suspected aetiology field (AD / vascular / mixed / other / undetermined).
- **Follow-up plan** (re-assessment interval) and a **registry consent** checkbox: "Patient consents to anonymized research registry."
- On save, the GP's status for Erzsébet becomes **"Specialist assessed – follow-up scheduled."**

### 4.4 Research & Pharma dashboard (the revenue screen)

**Headline KPIs (aggregate, synthetic)**
- Screened patients.
- High-risk flagged.
- Referred.
- Specialist-confirmed MCI.
- Registry-consented.
- Pre-qualified trial candidates.

**Funnel chart:** screened → flagged → referred → assessed → MCI confirmed → registry → pre-qualified.

**Map of Hungarian regions or counties** showing the cohort count per region, with small-cell suppression. A simplified SVG is fine.

**Cohort builder**
- Pick inclusion criteria: age range, MCI confirmed, suspected AD aetiology, comorbidities, time since diagnosis.
- Show the matching aggregate count, with suppression applied.

**Screening-efficiency estimator.** Inputs: a baseline screen-failure rate (default 70%, adjustable 44–88%) and a cost per screen. It shows the illustrative "estimated pre-screening savings per enrolled patient." Label it **"Illustrative model; assumptions shown."**

**Real-world follow-up panel:** a placeholder longitudinal chart labelled "Phase IV / RWE follow-up (planned)."

The anonymization note from section 2 is always visible on this page.

### 4.5 Roadmap screen (optional, one static page)
Show the three phases:
1. Risk calculator.
2. Structured data & follow-up.
3. Teleconsultation network, labelled "Phase 3 · planned."

Do **not** build teleconsultation features.

---

## 5. Guided demo mode (critical for the pitch)

- **"Start guided demo"** runs a scripted walkthrough of the section 3 story across all roles.
  - Use a small step overlay, e.g. "Step 3 of 9 — The GP sees *why* Erzsébet is flagged."
  - The flow auto-switches roles at the right moments.
  - Highlight the element to click, or click it automatically in auto-play mode.
- **Controls:** → / Space = next step, ← = back, `R` = reset all data, `G` = toggle guided overlay, `1`–`4` = jump to a role.
- **Auto-play mode** (`A`) runs the whole story in about 40 seconds with smooth transitions. This is used to screen-record the video for the pitch deck.
- **Reset** restores the initial seed instantly and deterministically. The same seed must produce the same numbers every time.

---

## 6. Data and risk logic

- **Seed data.** Put everything in `src/data/seed.ts`. Make it deterministic, with no `Math.random()` at runtime unless it uses a fixed seed.
  - Panel: about 25 patients with a realistic mix (roughly 60% low, 28% moderate, 12% high risk).
  - Pharma: about 1,200–3,000 screened patients as the historical aggregate.
  - The hero patient's actions add to these counts live.
- **Risk logic.** Put it in `src/logic/risk.ts` as a pure, unit-testable function.
  - Use an additive points model over these factors: age, sex, HbA1c / glucose trend, eGFR, BP level and variability, cardiometabolic comorbidities, subjective memory complaint, and MBI item score.
  - Map the total to Low / Moderate / High bands.
  - Return the score, the band and an ordered list of contributors with a plain-language label and weight.
  - Document the weights in code comments as "illustrative, literature-inspired, not validated."
  - Erzsébet must land clearly in High after the MBI check, and in Moderate before it. This shows the behavioral component adding value.
- **Tests.** Add a few unit tests for `risk.ts` and for the small-cell suppression helper.

---

## 7. Build phases (stop and show me after each phase)

1. **Foundation.** Project setup, design tokens extracted from the design docs into the theme, layout shell (top bar with logo, role switcher, disclaimer), the start screen, and a component sample page proving that the design system has been matched (buttons, cards, badges, inputs, tables, chart styling). Compare against `screen.png`.
2. **GP view.** Panel and patient detail, risk logic, MBI check, recommendation, decision and referral.
3. **Patient view and Specialist view**, with state flowing from the GP view.
4. **Research & Pharma dashboard**, including the funnel, map, cohort builder and efficiency estimator.
5. **Guided demo mode, auto-play, keyboard shortcuts and reset.**
6. **Polish and hardening**
   - Transitions, empty states, offline check (disconnect the network and run the demo).
   - Projector-resolution check.
   - A `README.md` with run instructions and the keyboard shortcut list.
   - Copy review against the honesty rules in section 2.

---

## 8. Definition of done

- [ ] Runs fully offline from `npm run demo`, and also from the static `dist/`.
- [ ] Visually matches the design system in `docs/` (tokens, components, overall look of `screen.png`).
- [ ] The full Erzsébet story works end to end across all four roles, with shared state.
- [ ] Guided mode and 40-second auto-play work; reset is instant and deterministic.
- [ ] No validation metrics are claimed; the disclaimer is always visible; the pharma view is aggregate-only with suppression.
- [ ] No third-party logos or trademarks; no verbatim published questionnaire items.
- [ ] No console errors; risk and suppression unit tests pass.
- [ ] Looks right at 1920×1080 and 1440×900.
- [ ] The existing pitch presentation files are untouched.

When in doubt about scope, choose **fewer screens, more polish**. Every screen should earn its place in the 3-minute story.
