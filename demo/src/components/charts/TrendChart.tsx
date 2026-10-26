import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, chartColors, gridProps, tooltipProps } from './chartTheme';

export interface TrendSeries {
  key: string;
  label: string;
  color?: string;
}

interface TrendChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: TrendSeries[];
  /** Shaded target/reference range, e.g. a guideline band. */
  referenceRange?: { from: number; to: number };
  unit?: string;
  height?: number;
  yDomain?: [number | 'auto', number | 'auto'];
}

export function TrendChart({ data, xKey, series, referenceRange, unit, height = 200, yDomain = ['auto', 'auto'] }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} dy={6} />
        <YAxis {...axisProps} domain={yDomain} tickCount={5} width={48} unit={unit} />
        {referenceRange && (
          <ReferenceArea y1={referenceRange.from} y2={referenceRange.to} fill={chartColors.mint} fillOpacity={0.8} ifOverflow="extendDomain" />
        )}
        <Tooltip {...tooltipProps} />
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? chartColors.series[i % chartColors.series.length]}
            strokeWidth={2.25}
            dot={{ r: 3, strokeWidth: 0, fill: s.color ?? chartColors.series[i % chartColors.series.length] }}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
