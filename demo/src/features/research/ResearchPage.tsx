import { ShieldCheck } from 'lucide-react';
import { t } from '../../strings';
import { CohortBuilder } from './CohortBuilder';
import { EfficiencyCard } from './EfficiencyCard';
import { FunnelCard } from './FunnelCard';
import { KpiRow } from './KpiRow';
import { RegionMap } from './RegionMap';
import { RweCard } from './RweCard';
import { useResearchData } from './useResearchData';

export function ResearchPage() {
  const data = useResearchData();
  const r = t.research;
  return (
    <div>
      {/* Always visible while scrolling (brief §2/§4.4). */}
      <div
        role="note"
        data-demo="anonymization-note"
        className="sticky top-[72px] z-30 flex items-center justify-center gap-2 border-b border-secondary/20 bg-mint/95 px-6 py-2 text-label-lg text-secondary backdrop-blur-sm"
      >
        <ShieldCheck className="size-4" />
        {r.anonymization}
        <span className="font-normal text-on-surface-variant">· {r.synthetic}</span>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-12">
        <div className="mb-gutter max-w-3xl">
          <span className="text-label-md tracking-wider text-secondary uppercase">{r.eyebrow}</span>
          <h1 className="text-headline-md text-navy">{r.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{r.lead}</p>
        </div>

        <KpiRow data={data} />

        <div className="mt-gutter grid grid-cols-12 items-start gap-gutter">
          <div className="col-span-7">
            <FunnelCard data={data} />
          </div>
          <div className="col-span-5">
            <RegionMap data={data} />
          </div>
        </div>

        <div className="mt-gutter grid grid-cols-2 items-start gap-gutter">
          <CohortBuilder data={data} />
          <EfficiencyCard data={data} />
        </div>

        <div className="mt-gutter">
          <RweCard />
        </div>
      </div>
    </div>
  );
}
