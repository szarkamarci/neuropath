import { useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { SegmentedControl } from '../../components/ui/Form';
import { counties } from '../../data/registry';
import { formatCell, isSuppressed } from '../../logic/suppression';
import { t } from '../../strings';
import type { ResearchData } from './useResearchData';

type Metric = 'registry' | 'screened';

const TILE = 78;
const GAP = 8;
const COLS = 6;
const ROWS = 4;
const W = COLS * TILE + (COLS - 1) * GAP;
const H = ROWS * TILE + (ROWS - 1) * GAP;

/** Mix of mint → teal by share of the maximum visible value. */
function tileFill(value: number, max: number): string {
  const k = Math.min(1, value / max);
  const from = [230, 242, 242];
  const to = [27, 167, 168];
  return `rgb(${from.map((c, i) => Math.round(c + (to[i]! - c) * (0.15 + 0.85 * k))).join(',')})`;
}

export function RegionMap({ data }: { data: ResearchData }) {
  const [metric, setMetric] = useState<Metric>('registry');
  const m = t.research.map;
  const values = metric === 'registry' ? data.registryByCounty : data.screenedByCounty;
  const max = Math.max(...counties.map((c) => values[c.id] ?? 0));

  return (
    <Card data-demo="region-map">
      <CardHeader
        eyebrow={m.eyebrow}
        title={m.title}
        description={m.description}
        action={
          <SegmentedControl
            ariaLabel={m.metricLabel}
            size="sm"
            value={metric}
            onChange={setMetric}
            options={[
              { value: 'registry', label: m.metrics.registry },
              { value: 'screened', label: m.metrics.screened },
            ]}
          />
        }
      />
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-[34rem]" role="img" aria-label={m.title}>
        <defs>
          <pattern id="suppressed-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#F1F3F6" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#C5C6CE" strokeWidth="2" />
          </pattern>
        </defs>
        {counties.map((c) => {
          const value = values[c.id] ?? 0;
          const hidden = isSuppressed(value);
          const x = c.col * (TILE + GAP);
          const y = c.row * (TILE + GAP);
          const dark = !hidden && value / max > 0.45;
          return (
            <g key={c.id} data-demo={`county-${c.id}`}>
              <title>{m.tileTitle(c.name, formatCell(value))}</title>
              <rect x={x} y={y} width={TILE} height={TILE} rx={10} fill={hidden ? 'url(#suppressed-hatch)' : tileFill(value, max)} stroke="rgba(11,29,58,0.08)" />
              <text x={x + TILE / 2} y={y + 26} textAnchor="middle" fontSize={12} fontWeight={600} fill={dark ? '#fff' : '#44474D'}>
                {c.short}
              </text>
              <text x={x + TILE / 2} y={y + 55} textAnchor="middle" fontSize={hidden ? 17 : 21} fontWeight={700} fill={dark ? '#fff' : '#0B1D3A'}>
                {formatCell(value)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-center gap-6 text-label-md text-on-surface-variant">
        <span className="flex items-center gap-2">
          <span className="inline-block size-3.5 rounded-sm" style={{ background: 'url(#)', backgroundColor: '#E1E3E6', backgroundImage: 'repeating-linear-gradient(45deg,#C5C6CE 0 2px,#F1F3F6 2px 6px)' }} />
          {m.suppressedLegend}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${tileFill(0, 1)}, ${tileFill(1, 1)})` }} />
          {m.scaleLegend}
        </span>
      </div>
    </Card>
  );
}
