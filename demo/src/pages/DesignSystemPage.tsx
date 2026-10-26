import { useState, type ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, CalendarCheck, ClipboardCheck, FolderOpen, Send, Timer, UserRoundSearch } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Badge, RiskBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Checkbox, Field, SegmentedControl, Select, Switch, TextArea, TextInput } from '../components/ui/Form';
import { MetricCard } from '../components/ui/MetricCard';
import { Modal } from '../components/ui/Modal';
import { Notice } from '../components/ui/Notice';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Table, Td, Th, THead, Tr } from '../components/ui/Table';
import { Sparkline } from '../components/charts/Sparkline';
import { TrendChart } from '../components/charts/TrendChart';
import { axisProps, chartColors, gridProps, tooltipProps } from '../components/charts/chartTheme';
import { t } from '../strings';

// Specimen content for this internal page only (synthetic, not part of the story data).
const swatches = [
  { hex: '#0B1D3A', name: 'Deep Navy', role: 'Text / Core', tag: 'Primary Deep', dark: true },
  { hex: '#1BA7A8', name: 'Teal Accent', role: 'Primary CTA', tag: 'Action Cyan', dark: true },
  { hex: '#4C7DBA', name: 'Slate Blue', role: 'Pathways & Data', tag: 'Secondary', dark: true },
  { hex: '#E6F2F2', name: 'Soft Sky Mint', role: 'Card / Pill Tint', tag: 'Tint / Wash' },
  { hex: '#F1F3F6', name: 'Ice Neutral', role: 'Background Canvas', tag: 'Surface Base' },
  { hex: '#FAF7F2', name: 'Warm Cream', role: 'Humanist Reassurance', tag: 'Paper Foundation' },
  { hex: '#E26D5C', name: 'Attention', role: 'At-risk signal', tag: 'Semantic', dark: true },
  { hex: '#006A6A', name: 'Deep Teal', role: 'Accent text (AA)', tag: 'secondary', dark: true },
];

const typeScale = [
  { token: 'display-hero', sample: 'Early insight.', className: 'text-display-hero' },
  { token: 'headline-lg', sample: 'Better care. Together.', className: 'text-headline-lg' },
  { token: 'headline-md', sample: 'Patient detail', className: 'text-headline-md' },
  { token: 'headline-sm', sample: 'Risk contributors', className: 'text-headline-sm' },
  { token: 'title-md', sample: 'Structured behavioral check', className: 'text-title-md' },
  { token: 'body-lg', sample: 'Your doctor recommends a memory check.', className: 'text-body-lg' },
  { token: 'body-md', sample: 'Imported from national eHealth record (simulated).', className: 'text-body-md' },
  { token: 'body-sm', sample: 'Last visit 12 Sep 2026 · Type 2 diabetes, hypertension', className: 'text-body-sm' },
  { token: 'label-lg', sample: 'Refer to memory clinic', className: 'text-label-lg' },
  { token: 'label-md', sample: 'RISK BAND', className: 'text-label-md' },
  { token: 'metric-number', sample: '1,842', className: 'text-metric-number' },
];

const sampleRows = [
  { name: 'Erzsébet K.', age: 68, conditions: 'T2DM, Hypertension', visit: '24 Oct 2026', band: 'high', status: 'newFlag', trend: [6.4, 6.7, 6.9, 7.2, 7.6, 7.9] },
  { name: 'László T.', age: 72, conditions: 'Hypertension, AF', visit: '21 Oct 2026', band: 'moderate', status: 'followUp', trend: [6.0, 6.1, 6.0, 6.2, 6.3, 6.3] },
  { name: 'Katalin B.', age: 64, conditions: 'T2DM', visit: '17 Oct 2026', band: 'moderate', status: 'referred', trend: [7.1, 7.0, 7.2, 7.0, 7.1, 7.2] },
  { name: 'Gábor S.', age: 59, conditions: 'Dyslipidaemia', visit: '09 Oct 2026', band: 'low', status: 'followUp', trend: [5.6, 5.5, 5.7, 5.6, 5.5, 5.6] },
] as const;

const hba1cTrend = [
  { q: 'Q4 ’23', hba1c: 6.4 },
  { q: 'Q2 ’24', hba1c: 6.7 },
  { q: 'Q4 ’24', hba1c: 6.9 },
  { q: 'Q2 ’25', hba1c: 7.2 },
  { q: 'Q4 ’25', hba1c: 7.6 },
  { q: 'Q2 ’26', hba1c: 7.9 },
];

const bpTrend = [
  { q: 'Q4 ’23', sys: 138, dia: 84 },
  { q: 'Q2 ’24', sys: 152, dia: 90 },
  { q: 'Q4 ’24', sys: 141, dia: 86 },
  { q: 'Q2 ’25', sys: 158, dia: 94 },
  { q: 'Q4 ’25', sys: 146, dia: 88 },
  { q: 'Q2 ’26', sys: 161, dia: 95 },
];

const funnelSample = [
  { stage: 'Screened', n: 1842 },
  { stage: 'Flagged', n: 214 },
  { stage: 'Referred', n: 131 },
  { stage: 'Assessed', n: 97 },
  { stage: 'MCI', n: 41 },
];

type Frequency = 'never' | 'sometimes' | 'often';

export function DesignSystemPage() {
  const s = t.designSystem.sections;
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
      <PageIntro />

      <Section eyebrow="01" title={s.colors} aside="code.html palette + semantic signals">
        <ColorSwatches />
      </Section>

      <Section eyebrow="02" title={s.type} aside="Plus Jakarta Sans · self-hosted">
        <TypeSpecimen />
      </Section>

      <Section eyebrow="03" title={s.buttons} aside="Pill · 9999px">
        <ButtonSpecimen />
      </Section>

      <Section eyebrow="04" title={s.badges}>
        <BadgeSpecimen />
      </Section>

      <Section eyebrow="05" title={s.metrics} aside="Sample values">
        <MetricSpecimen />
      </Section>

      <Section eyebrow="06" title={s.inputs} aside="48px · 8px radius · teal focus ring">
        <InputSpecimen />
      </Section>

      <Section eyebrow="07" title={s.table}>
        <TableSpecimen />
      </Section>

      <Section eyebrow="08" title={s.charts} aside="Recharts · bundled">
        <ChartSpecimen />
      </Section>

      <Section eyebrow="09" title={s.feedback}>
        <FeedbackSpecimen />
      </Section>
    </div>
  );
}

function PageIntro() {
  return (
    <section className="pt-10 pb-6">
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm lg:p-12">
        <div className="pointer-events-none absolute -top-20 -right-20 size-96 rounded-full bg-secondary-container/20 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-10">
          <div className="max-w-3xl">
            <Badge tone="teal" className="mb-4">
              {t.designSystem.eyebrow}
            </Badge>
            <h1 className="mb-4 text-headline-lg text-primary-container">{t.designSystem.title}</h1>
            <p className="text-body-lg text-on-surface-variant">{t.designSystem.lead}</p>
          </div>
          <Logo variant="stacked" size="md" showTagline className="hidden shrink-0 lg:flex" />
        </div>
      </div>
    </section>
  );
}

function Section({ eyebrow, title, aside, children }: { eyebrow: string; title: string; aside?: string; children: ReactNode }) {
  return (
    <section className="py-8">
      <SectionHeader eyebrow={`Component ${eyebrow}`} title={title} aside={aside} />
      {children}
    </section>
  );
}

function ColorSwatches() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
      {swatches.map((sw) => (
        <div key={sw.hex} className="flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm">
          <div className="flex h-24 items-end border-b border-outline-variant/20 p-3" style={{ background: sw.hex }}>
            <span
              className={
                sw.dark
                  ? 'rounded bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-white'
                  : 'rounded bg-black/10 px-2 py-0.5 text-[10px] font-semibold text-navy'
              }
            >
              {sw.tag}
            </span>
          </div>
          <div className="p-3">
            <div className="text-body-md font-bold text-navy">{sw.hex}</div>
            <div className="text-body-sm text-on-surface-variant">{sw.name}</div>
            <div className="mt-2 border-t border-outline-variant/20 pt-2 text-label-md text-on-surface-variant">{sw.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypeSpecimen() {
  return (
    <Card padded={false} className="divide-y divide-outline-variant/20">
      {typeScale.map((row) => (
        <div key={row.token} className="flex items-baseline gap-8 px-6 py-3">
          <code className="w-32 shrink-0 font-mono text-[11px] text-on-surface-variant">{row.token}</code>
          <span className={`${row.className} truncate text-navy`}>{row.sample}</span>
        </div>
      ))}
    </Card>
  );
}

function ButtonSpecimen() {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" iconRight={<ArrowRight className="size-4" />}>
          Primary CTA
        </Button>
        <Button size="lg" variant="secondary">
          Secondary CTA
        </Button>
        <Button size="lg" variant="tertiary">
          Tertiary / Neutral
        </Button>
        <Button size="lg" variant="dark" iconLeft={<Send className="size-4" />}>
          Dark
        </Button>
        <Button size="lg" variant="ghost">
          Ghost
        </Button>
        <Button size="lg" variant="danger">
          Dismiss
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-outline-variant/20 pt-6">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </Card>
  );
}

function BadgeSpecimen() {
  return (
    <Card className="grid grid-cols-3 gap-6">
      <BadgeGroup label="Tones">
        <Badge>Neutral</Badge>
        <Badge tone="teal">Teal</Badge>
        <Badge tone="blue">Blue</Badge>
        <Badge tone="attention">Attention</Badge>
        <Badge tone="navy">Navy</Badge>
        <Badge tone="outline">Outline</Badge>
      </BadgeGroup>
      <BadgeGroup label="Risk band">
        <RiskBadge band="low" />
        <RiskBadge band="moderate" />
        <RiskBadge band="high" />
      </BadgeGroup>
      <BadgeGroup label="Workflow status">
        <StatusBadge status="newFlag" />
        <StatusBadge status="referred" />
        <StatusBadge status="followUp" />
        <StatusBadge status="assessed" />
      </BadgeGroup>
    </Card>
  );
}

function BadgeGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-label-md text-on-surface-variant uppercase">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MetricSpecimen() {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-title-md font-bold text-primary-container">Today’s triage overview</span>
        <Badge tone="outline">Sample values</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard icon={<ClipboardCheck />} value={12} label="Screenings" sublabel="Completed" />
        <MetricCard icon={<UserRoundSearch />} value={3} label="At risk" sublabel="Needs review" tone="attention" />
        <MetricCard icon={<FolderOpen />} value={2} label="Referrals" sublabel="In progress" tone="blue" />
        <MetricCard icon={<CalendarCheck />} value={5} label="Follow-ups" sublabel="Due this week" />
      </div>
    </div>
  );
}

function InputSpecimen() {
  const [consent, setConsent] = useState(true);
  const [share, setShare] = useState(false);
  const [answer, setAnswer] = useState<'yes' | 'no' | null>('yes');
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  return (
    <Card className="grid grid-cols-2 gap-x-10 gap-y-6">
      <Field label="Text input" htmlFor="ds-text" hint="Focus to see the teal ring.">
        <TextInput id="ds-text" placeholder="e.g. Follow-up in 6 months" />
      </Field>
      <Field label="Select" htmlFor="ds-select">
        <Select id="ds-select" defaultValue="mci">
          <option value="normal">Normal cognition</option>
          <option value="scd">Subjective cognitive decline</option>
          <option value="mci">Mild cognitive impairment (MCI)</option>
          <option value="dementia">Dementia</option>
        </Select>
      </Field>
      <Field label="Text area" htmlFor="ds-note" className="col-span-2">
        <TextArea id="ds-note" placeholder="Note for the specialist (optional)" />
      </Field>
      <div className="flex flex-col gap-5">
        <Checkbox
          checked={consent}
          onChange={setConsent}
          label="Patient consents to anonymized research registry."
          description="Consent recorded by the specialist."
        />
        <Switch checked={share} onChange={setShare} label="Share updates with my daughter" description="Caregiver sharing (optional)" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-body-md text-navy">Yes / No item</span>
          <SegmentedControl
            ariaLabel="Yes or no"
            value={answer}
            onChange={setAnswer}
            options={[
              { value: 'yes', label: t.common.yes },
              { value: 'no', label: t.common.no },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-body-md text-navy">Frequency item</span>
          <SegmentedControl
            ariaLabel="Frequency"
            size="sm"
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: 'never', label: 'Never' },
              { value: 'sometimes', label: 'Sometimes' },
              { value: 'often', label: 'Often' },
            ]}
          />
        </div>
      </div>
    </Card>
  );
}

function TableSpecimen() {
  const [selected, setSelected] = useState<string>(sampleRows[0].name);
  return (
    <Card padded={false} className="overflow-hidden">
      <Table>
        <THead>
          <tr>
            <Th>Patient</Th>
            <Th>Age</Th>
            <Th>Conditions</Th>
            <Th>Last visit</Th>
            <Th className="w-36">HbA1c trend</Th>
            <Th>Risk band</Th>
            <Th>Status</Th>
          </tr>
        </THead>
        <tbody>
          {sampleRows.map((row) => (
            <Tr key={row.name} interactive selected={row.name === selected} onClick={() => setSelected(row.name)}>
              <Td className="font-semibold text-navy">{row.name}</Td>
              <Td className="tabular-nums">{row.age}</Td>
              <Td className="text-on-surface-variant">{row.conditions}</Td>
              <Td className="text-on-surface-variant tabular-nums">{row.visit}</Td>
              <Td className="py-1.5">
                <Sparkline values={[...row.trend]} color={row.band === 'high' ? chartColors.attention : chartColors.blue} height={32} domain={[5, 8.5]} />
              </Td>
              <Td>
                <RiskBadge band={row.band} />
              </Td>
              <Td>
                <StatusBadge status={row.status} />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

function ChartSpecimen() {
  return (
    <div className="grid grid-cols-3 gap-gutter">
      <Card>
        <CardHeader eyebrow="Line · reference band" title="HbA1c" description="% · shaded: target range" />
        <TrendChart data={hba1cTrend} xKey="q" series={[{ key: 'hba1c', label: 'HbA1c', color: chartColors.teal }]} referenceRange={{ from: 5, to: 7 }} yDomain={[5, 9]} />
      </Card>
      <Card>
        <CardHeader eyebrow="Line · multi-series" title="Blood pressure" description="mmHg · systolic / diastolic" />
        <TrendChart
          data={bpTrend}
          xKey="q"
          series={[
            { key: 'sys', label: 'Systolic', color: chartColors.blue },
            { key: 'dia', label: 'Diastolic', color: chartColors.navy },
          ]}
          yDomain={[60, 180]}
        />
      </Card>
      <Card>
        <CardHeader eyebrow="Bar · aggregate" title="Funnel (sample)" description="Synthetic counts" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={funnelSample} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 8 }}>
            <CartesianGrid {...gridProps} horizontal={false} vertical />
            <XAxis type="number" {...axisProps} hide />
            <YAxis type="category" dataKey="stage" {...axisProps} width={72} />
            <Tooltip {...tooltipProps} cursor={{ fill: chartColors.mint }} />
            <Bar dataKey="n" name="Patients" radius={[0, 6, 6, 0]} barSize={18} isAnimationActive={false}>
              {funnelSample.map((d, i) => (
                <Cell key={d.stage} fill={i === funnelSample.length - 1 ? chartColors.teal : chartColors.blue} />
              ))}
              <LabelList dataKey="n" position="right" fill={chartColors.navy} fontSize={12} fontWeight={600} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function FeedbackSpecimen() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid grid-cols-2 gap-gutter">
      <div className="flex flex-col gap-3">
        <Notice tone="model" title="Model label">
          {t.risk.modelLabel}
        </Notice>
        <Notice tone="privacy" title="Anonymization">
          Aggregated, small cells suppressed, GDPR-compliant registry (planned).
        </Notice>
        <Notice tone="info">Imported from national eHealth record (simulated).</Notice>
        <Notice tone="attention" title="Decision support only">
          The clinician makes the final decision.
        </Notice>
      </div>
      <Card tone="cream" className="flex flex-col items-start justify-between gap-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-label-md text-secondary uppercase">
            <Timer className="size-3.5" /> Level 3 dialog
          </div>
          <p className="text-body-md text-ink">16px radius, level-3 shadow, Esc / backdrop to close. Used for the structured referral.</p>
        </div>
        <Button variant="dark" onClick={() => setOpen(true)}>
          Open sample dialog
        </Button>
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Structured referral"
        description="Auto-filled from the record. Review before sending."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={() => setOpen(false)} iconLeft={<Send className="size-4" />}>
              Send referral
            </Button>
          </>
        }
      >
        <Field label="Note for the specialist" htmlFor="ds-modal-note">
          <TextArea id="ds-modal-note" placeholder="Optional" />
        </Field>
      </Modal>
    </div>
  );
}
