import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { chartColors } from './chartTheme';

interface SparklineProps {
  values: number[];
  color?: string;
  height?: number;
  /** Fixed y-range so rows in a table share one scale; defaults to the data range. */
  domain?: [number, number];
}

/** Axis-less trend line with the latest point emphasised. */
export function Sparkline({ values, color = chartColors.teal, height = 40, domain }: SparklineProps) {
  const data = values.map((value, index) => ({ index, value }));
  const lastIndex = data.length - 1;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <YAxis hide domain={domain ?? ['dataMin', 'dataMax']} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          isAnimationActive={false}
          dot={(props: { cx?: number; cy?: number; index?: number }) =>
            props.index === lastIndex ? (
              <circle key="last" cx={props.cx} cy={props.cy} r={3} fill={color} stroke="#fff" strokeWidth={1.5} />
            ) : (
              <g key={props.index} />
            )
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
