import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, chartColors, gridProps, tooltipProps } from '../../components/charts/chartTheme';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { t } from '../../strings';

// Placeholder shape only: smooth decay curves, not data and not a forecast.
const PLACEHOLDER = [0, 6, 12, 18, 24, 30, 36].map((month, i) => ({
  month,
  retained: Math.round(100 - i * 4.5),
  visits: Math.round(100 - i * 9),
}));

export function RweCard() {
  const r = t.research.rwe;
  return (
    <Card data-demo="rwe" tone="muted">
      <CardHeader eyebrow={r.eyebrow} title={r.title} description={r.description} action={<Badge tone="outline">{r.badge}</Badge>} />
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={PLACEHOLDER} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="month" {...axisProps} tickFormatter={r.xLabel} dy={6} />
          <YAxis {...axisProps} domain={[0, 100]} ticks={[0, 50, 100]} width={44} unit="%" />
          <Tooltip {...tooltipProps} labelFormatter={(m) => r.xLabel(Number(m))} />
          <Line type="monotone" dataKey="retained" name={r.series.retained} stroke={chartColors.blue} strokeWidth={2.25} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="visits" name={r.series.visits} stroke={chartColors.teal} strokeWidth={2.25} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-6 text-label-md text-on-surface-variant">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded" style={{ background: chartColors.blue }} />
          {r.series.retained}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded" style={{ background: chartColors.teal }} />
          {r.series.visits}
        </span>
      </div>
    </Card>
  );
}
