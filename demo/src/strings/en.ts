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
    cardTitle: 'NeuroPath risk',
    cardEyebrow: 'Decision support',
    outOf: (max: number) => `/ ${max} points`,
    contributorsTitle: 'Top contributing factors',
    noContributors: 'No notable risk factors in the current record.',
    weights: { high: 'High contribution', moderate: 'Moderate', low: 'Low' },
    protective: 'Lowers risk',
    beforeCheck: 'Before behavioral check',
    deltaFromCheck: (delta: number) => `+${delta} points from the behavioral check`,
    noDeltaFromCheck: 'Behavioral check did not change the score',
    checkPending: 'Behavioral check not yet done — score uses routine data only.',
    scaleLabels: { low: 'Low', moderate: 'Moderate', high: 'High' },
  },

  riskFactors: {
    age: (age: number) => `Age ${age}`,
    sex: 'Female sex',
    glycaemicUp: (slope: number) => `HbA1c trend rising (+${slope.toFixed(1)} % per year)`,
    glycaemicDown: 'HbA1c improving over time',
    egfr: (egfr: number) => `Reduced kidney function (eGFR ${egfr})`,
    bpHigh: (mean: number) => `High average blood pressure (${mean} mmHg systolic)`,
    bpControlled: 'Blood pressure well controlled',
    bpVariability: (sd: number) => `Blood pressure variability (±${sd} mmHg between visits)`,
    comorbidity: (n: number) => `${n} cardiometabolic conditions`,
    memory: 'Subjective memory complaint (patient or family)',
    behavior: (score: number) => `Reported behavioral change (check score ${score}/14)`,
  },

  conditions: {
    t2dm: 'Type 2 diabetes',
    htn: 'Hypertension',
    dlp: 'Dyslipidaemia',
    af: 'Atrial fibrillation',
    chd: 'Coronary heart disease',
    obesity: 'Obesity',
    ckd: 'Chronic kidney disease',
  },

  sex: { F: 'Female', M: 'Male' },

  status: {
    routine: 'Routine care',
    newFlag: 'New flag',
    referred: 'Referred',
    followUp: 'Follow-up',
    monitor: 'Monitoring',
    dismissed: 'Flag dismissed',
    assessed: 'Specialist assessed – follow-up scheduled',
  },

  gp: {
    clinic: 'Dr. Nagy · Primary care practice (synthetic)',
    panel: {
      eyebrow: 'GP · Chronic-care panel',
      title: 'Today’s chronic-care panel',
      lead: 'Patients with diabetes, hypertension or other cardiometabolic conditions. Risk is recalculated from routine data at each visit.',
      source: 'Imported from national eHealth record (simulated)',
      filterLabel: 'Filter by risk band',
      filterAll: 'All',
      count: (n: number) => `${n} patients`,
      metrics: {
        panel: 'Panel size',
        panelSub: 'Chronic-care patients',
        high: 'High risk',
        highSub: 'Needs review',
        flags: 'New flags',
        flagsSub: 'Not yet actioned',
        referred: 'Referred',
        referredSub: 'Memory clinic',
      },
      columns: {
        name: 'Patient',
        age: 'Age',
        conditions: 'Conditions',
        lastVisit: 'Last visit',
        risk: 'NeuroPath risk',
        status: 'Status',
      },
      today: 'Today',
      open: 'Open',
      empty: 'No patients in this risk band.',
    },
    detail: {
      back: 'Back to panel',
      visit: 'Chronic-care check-up',
      years: (age: number) => `${age} years`,
      source: 'Imported from national eHealth record (simulated)',
      timeAdded: 'Time added to visit',
      timeAddedValue: '~2 min',
      labsTitle: 'Lab & vitals trends',
      labsEyebrow: 'Last 3 years',
      labs: {
        hba1c: 'HbA1c',
        hba1cUnit: '%',
        glucose: 'Fasting glucose',
        glucoseUnit: 'mmol/L',
        egfr: 'eGFR',
        egfrUnit: 'mL/min/1.73m²',
        bp: 'Blood pressure',
        bpUnit: 'mmHg',
        systolic: 'Systolic',
        diastolic: 'Diastolic',
        latest: 'Latest',
        targetBand: 'Shaded: typical target range',
      },
      notesTitle: 'From the record',
      noNotes: 'No relevant notes.',
      notFound: 'Patient not found.',
    },
    mbi: {
      eyebrow: 'Structured behavioral check',
      title: 'Behavioral change check',
      duration: '~1 min',
      intro: 'Ask the patient or a family member: compared with before, has there been a change lasting 6 months or more?',
      placeholderNote: 'Short paraphrased placeholder items · not a validated instrument.',
      scale: { 0: 'No', 1: 'Sometimes', 2: 'Often' },
      domains: {
        motivation: 'Motivation',
        mood: 'Mood',
        impulse: 'Impulse control',
        social: 'Social appropriateness',
        beliefs: 'Beliefs & perception',
      },
      items: {
        lostInterest: 'Lost interest in hobbies or usual activities',
        withdrawn: 'Less interested in friends or family',
        lowMood: 'Seems more low, sad or worried',
        irritable: 'More irritable or quick to anger',
        impulsive: 'Acts on impulse more than before',
        socialOutOfCharacter: 'Says or does things that are out of character',
        unusualBeliefs: 'New unusual beliefs, or sees/hears things others don’t',
      },
      progress: (answered: number, total: number) => `${answered} of ${total} answered`,
      score: (score: number, max: number) => `Score ${score} / ${max}`,
      complete: 'Complete check',
      completed: 'Check completed',
      completedIn: (time: string) => `Completed in ${time}`,
      edit: 'Edit answers',
      clear: 'Clear',
      liveNote: 'The risk card updates as you answer.',
    },
    recommendation: {
      eyebrow: 'Recommendation',
      decisionSupport: 'Decision support only — the clinician makes the final decision.',
      high: {
        title: 'Recommended: referral to memory clinic',
        steps: [
          'Suggested next step: digital cognitive assessment (partner-validated instrument).',
          'Consider: further work-up per specialist.',
        ],
      },
      moderatePending: {
        title: 'Complete the behavioral check',
        steps: [
          'Routine data alone place this patient in the moderate band.',
          'The 1-minute behavioral check refines the recommendation before deciding.',
        ],
      },
      moderate: {
        title: 'Suggested: monitor and re-screen in 6 months',
        steps: [
          'Optimise glycaemic and blood-pressure control.',
          'Consider referral if memory or behavioral concerns progress.',
        ],
      },
      low: {
        title: 'Not recommended now: referral or further testing',
        steps: ['Re-screen at the next annual chronic-care review.'],
        avoidedTitle: 'Unnecessary work-up avoided',
        avoided: ['Memory-clinic referral', 'Brain MRI / CT', 'CSF or PET biomarker testing'],
      },
    },
    decision: {
      eyebrow: 'Clinician decision',
      title: 'Your decision',
      recommended: 'Recommended',
      refer: 'Refer',
      referDesc: 'Structured referral to the memory clinic',
      monitor: 'Monitor',
      monitorDesc: 'Re-screen later',
      dismiss: 'Dismiss',
      dismissDesc: 'Record a reason',
      months: (n: number) => `${n} months`,
      monitorConfirm: 'Schedule re-screen',
      dismissReasonLabel: 'Reason',
      dismissReasons: {
        knownDiagnosis: 'Already under specialist care',
        explained: 'Change explained by another cause',
        declined: 'Patient declined further assessment',
        clinical: 'Clinical judgement — not indicated',
      },
      dismissConfirm: 'Dismiss flag',
      recordedReferred: 'Referral sent to memory clinic',
      recordedMonitor: (months: number) => `Monitoring · re-screen in ${months} months`,
      recordedDismissed: (reason: string) => `Flag dismissed · ${reason}`,
      recordedOn: (date: string) => `Recorded ${date}`,
      change: 'Change decision',
      noFlag: 'No action needed for this patient today.',
    },
    referral: {
      title: 'Structured referral',
      description: 'Auto-filled from the record. Review, add a note, and send.',
      to: 'To',
      toValue: 'Regional Memory Clinic (synthetic)',
      from: 'From',
      patient: 'Patient',
      reason: 'Reason for referral',
      reasonValue: (band: string, findings: string[]) =>
        `${band} NeuroPath risk${findings.length ? ` with ${findings.join(' and ')}` : ''}. Request specialist assessment.`,
      reasonMemory: 'subjective memory complaint',
      reasonBehavior: 'reported behavioral change',
      riskSummary: 'Risk summary',
      labsSummary: 'Lab trends',
      hba1cTrend: (from: number, to: number) => `HbA1c ${from} → ${to} %`,
      egfrLatest: (v: number) => `eGFR ${v}`,
      bpSummary: (mean: number, sd: number) => `BP ${mean} mmHg avg. systolic, ±${sd} between visits`,
      mbiSummary: 'Behavioral check',
      mbiNotDone: 'Not completed',
      suggested: 'Suggested next step',
      suggestedValue: 'Digital cognitive assessment (partner-validated instrument)',
      note: 'Note for the specialist',
      notePlaceholder: 'Optional — e.g. daughter will accompany the patient.',
      send: 'Send referral',
      sent: 'Referral sent to the memory clinic.',
    },
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
