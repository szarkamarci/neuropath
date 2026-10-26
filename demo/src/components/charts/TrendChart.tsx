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
  /** Explicit y ticks; overrides tickCount. */
  yTicks?: number[];
  xTickFormatter?: (value: string) => string;
  /** Show only first and last x labels (small multiples). */
  sparseXTicks?: boolean;
}

export function TrendChart({
  data,
  xKey,
  series,
  referenceRange,
  unit,
  height = 200,
  yDomain = ['auto', 'auto'],
  yTicks,
  xTickFormatter,
  sparseXTicks,
}: TrendChartProps) {
  const firstX = data[0]?.[xKey];
  const lastX = data[data.length - 1]?.[xKey];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: sparseXTicks ? 22 : 8, bottom: 0, left: -12 }}>
        <CartesianGrid {...gridProps} />
        <XAxis
          dataKey={xKey}
          {...axisProps}
          dy={6}
          tickFormatter={xTickFormatter}
          ticks={sparseXTicks && firstX !== undefined && lastX !== undefined ? [firstX, lastX] : undefined}
          interval={sparseXTicks ? 0 : 'preserveStartEnd'}
        />
        <YAxis {...axisProps} domain={yDomain} ticks={yTicks} tickCount={4} width={48} unit={unit} allowDecimals />
        {referenceRange && (
          <ReferenceArea y1={referenceRange.from} y2={referenceRange.to} fill={chartColors.mint} fillOpacity={0.8} ifOverflow="extendDomain" />
        )}
        <Tooltip {...tooltipProps} labelFormatter={xTickFormatter ? (label) => xTickFormatter(String(label)) : undefined} />
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
