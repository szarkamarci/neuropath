/**
 * All user-facing copy lives here so a Hungarian file can be added later
 * with the same shape (see `Strings` type below).
 */
export const en = {
  brand: {
    name: 'NeuroPath',
    tagline: 'Early insight. Better care. Together.',
  },

  disclaimer:
    'Prototype · Synthetic data · Not a medical device · Risk logic is illustrative pending clinical validation.',

  nav: {
    home: 'Home',
    designSystem: 'Design system',
    synthetic: 'Synthetic data',
    startGuided: 'Start guided demo',
    rolesLabel: 'Switch role',
  },

  roles: {
    gp: {
      label: 'GP',
      title: 'GP · Primary care',
      description: 'Chronic-care panel with risk flags, the reasons behind them, a 1-minute behavioral check and a structured referral.',
    },
    specialist: {
      label: 'Specialist',
      title: 'Specialist · Memory clinic',
      description: 'Pre-filled structured referrals, cognitive assessment results, working diagnosis and registry consent.',
    },
    patient: {
      label: 'Patient',
      title: 'Patient · Phone',
      description: 'A calm, plain-language notification and what happens next, with optional caregiver sharing.',
    },
    research: {
      label: 'Research & Pharma',
      title: 'Research & Pharma',
      description: 'Aggregate, anonymized registry cohorts, regional counts and an illustrative screening-efficiency model.',
    },
  },

  start: {
    eyebrow: 'Dementia-risk triage & care pathway',
    headline: 'From routine check-up',
    headlineAccent: 'to the right care pathway.',
    lead: 'Follow one synthetic patient, Erzsébet K., from a GP chronic-care visit to a memory-clinic assessment and an anonymized research registry, across four connected roles.',
    startGuided: 'Start guided demo',
    exploreGp: 'Explore GP view',
    reset: 'Reset demo data',
    resetDone: 'Demo data restored to the initial seed.',
    rolesTitle: 'Choose a role',
    openRole: 'Open view',
    guidedComingSoon: 'Guided walkthrough is added in build phase 5. Opening the GP view instead.',
    facts: ['Frontend-only prototype', 'Fully offline', 'Synthetic, deterministic data'],
  },

  placeholder: {
    eyebrow: 'In progress',
    body: 'This view is built in a later phase of the prototype.',
    phase: (n: number) => `Planned for build phase ${n}`,
    back: 'Back to start',
  },

  designSystem: {
    eyebrow: 'Build phase 1 · Component sample',
    title: 'NeuroPath demo UI kit',
    lead: 'Every component the prototype uses, rendered from the shared tokens. Compare against docs/stitch_modular_brand_design_system/screen.png.',
    sections: {
      colors: 'Color palette',
      type: 'Typography',
      buttons: 'Buttons',
      badges: 'Badges & status pills',
      metrics: 'Metric cards',
      inputs: 'Form inputs',
      table: 'Table',
      charts: 'Chart styling',
      feedback: 'Notices & dialog',
    },
  },

  risk: {
    bands: { low: 'Low', moderate: 'Moderate', high: 'High' },
    modelLabel:
      'Prototype risk logic (literature-based factors); to be replaced by models validated in the clinical pilot.',
  },

  status: {
    newFlag: 'New flag',
    referred: 'Referred',
    followUp: 'Follow-up',
    assessed: 'Specialist assessed – follow-up scheduled',
  },

  common: {
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    yes: 'Yes',
    no: 'No',
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

export type Strings = Widen<typeof en>;
