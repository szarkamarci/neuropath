import { useEffect, useRef, useState } from 'react';
import { CircleCheck, PencilLine, Timer } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SegmentedControl } from '../../components/ui/Form';
import { cn } from '../../lib/cn';
import { formatDuration } from '../../lib/format';
import {
  MBI_MAX_SCORE,
  mbiAnsweredCount,
  mbiDomains,
  mbiDomainScores,
  mbiItems,
  mbiScore,
  type MbiAnswer,
} from '../../logic/mbi';
import { useDemoStore } from '../../store/demoStore';
import { useMbiAnswers } from '../../store/selectors';
import { t } from '../../strings';

const SCALE: MbiAnswer[] = [0, 1, 2];

export function MbiCheckCard({ patientId }: { patientId: string }) {
  const answers = useMbiAnswers(patientId);
  const completedSeconds = useDemoStore((s) => s.mbiCompletedById[patientId]);
  const setMbiAnswer = useDemoStore((s) => s.setMbiAnswer);
  const completeMbi = useDemoStore((s) => s.completeMbi);
  const reopenMbi = useDemoStore((s) => s.reopenMbi);
  const elapsed = useElapsedSeconds(mbiAnsweredCount(answers) > 0 && completedSeconds === undefined);

  const m = t.gp.mbi;
  const answered = mbiAnsweredCount(answers);
  const score = mbiScore(answers) ?? 0;
  const done = completedSeconds !== undefined;

  return (
    <Card data-demo="mbi-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-label-md text-on-surface-variant uppercase">{m.eyebrow}</div>
          <h2 className="text-title-md text-navy">{m.title}</h2>
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-lg tabular-nums',
            done ? 'border-secondary/20 bg-mint text-secondary' : 'border-outline-variant/40 bg-surface-container-low text-navy',
          )}
          data-demo="mbi-timer"
        >
          <Timer className="size-4" />
          {done ? formatDuration(completedSeconds) : answered > 0 ? formatDuration(elapsed) : m.duration}
        </div>
      </div>

      {done ? (
        <CompletedSummary
          score={score}
          seconds={completedSeconds}
          domainScores={mbiDomainScores(answers)}
          onEdit={() => reopenMbi(patientId)}
        />
      ) : (
        <>
          <p className="text-body-sm text-ink">{m.intro}</p>
          <p className="mt-1 text-[11px] text-muted">{m.placeholderNote}</p>

          <div className="mt-4 flex flex-col divide-y divide-outline-variant/20 rounded-lg border border-outline-variant/30">
            {mbiDomains.map((domain) => (
              <div key={domain} className="px-4 py-2.5">
                <div className="mb-1 text-label-md tracking-wide text-secondary uppercase">{m.domains[domain]}</div>
                {mbiItems
                  .filter((item) => item.domain === domain)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-1.5" data-demo={`mbi-item-${item.id}`}>
                      <span className="text-body-sm text-navy">{m.items[item.id]}</span>
                      <SegmentedControl
                        ariaLabel={m.items[item.id]}
                        size="sm"
                        className="shrink-0"
                        value={answers[item.id] !== undefined ? String(answers[item.id]) : null}
                        onChange={(value) => setMbiAnswer(patientId, item.id, Number(value) as MbiAnswer)}
                        options={SCALE.map((v) => ({ value: String(v), label: m.scale[v] }))}
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-body-sm text-on-surface-variant">
              <span className="font-semibold text-navy">{m.progress(answered, mbiItems.length)}</span>
              {answered > 0 && <span> · {m.score(score, MBI_MAX_SCORE)}</span>}
              <div className="text-[11px] text-muted">{m.liveNote}</div>
            </div>
            <Button
              data-demo="mbi-complete"
              disabled={answered < mbiItems.length}
              onClick={() => completeMbi(patientId, elapsed)}
              iconLeft={<CircleCheck className="size-4" />}
            >
              {m.complete}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

interface CompletedSummaryProps {
  score: number;
  seconds: number;
  domainScores: ReturnType<typeof mbiDomainScores>;
  onEdit: () => void;
}

function CompletedSummary({ score, seconds, domainScores, onEdit }: CompletedSummaryProps) {
  const m = t.gp.mbi;
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-secondary/20 bg-mint/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <CircleCheck className="size-5 text-secondary" />
          <div>
            <div className="text-label-lg text-navy">
              {m.completed} · {m.score(score, MBI_MAX_SCORE)}
            </div>
            <div className="text-body-sm text-on-surface-variant">{m.completedIn(formatDuration(seconds))}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit} iconLeft={<PencilLine className="size-3.5" />}>
          {m.edit}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {mbiDomains.map((domain) => (
          <Badge key={domain} tone={domainScores[domain] > 0 ? 'attention' : 'outline'}>
            {m.domains[domain]} · {domainScores[domain]}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/** Counts seconds while `running`; keeps the last value when paused. */
function useElapsedSeconds(running: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    if (!running) {
      startedAt.current = null;
      return;
    }
    startedAt.current = Date.now() - elapsed * 1000;
    const id = window.setInterval(() => {
      if (startedAt.current !== null) setElapsed(Math.round((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
    // Deliberately keyed on `running` only: resume from the current value when it flips.
  }, [running]);
  return elapsed;
}
