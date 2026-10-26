/**
 * Shared Recharts styling. Hex values mirror src/styles/theme.css because
 * Recharts writes them straight into SVG attributes.
 */
export const chartColors = {
  teal: '#1BA7A8',
  blue: '#4C7DBA',
  navy: '#0B1D3A',
  attention: '#E26D5C',
  mint: '#E6F2F2',
  grid: '#E6E8EB',
  axis: '#75777E',
  /** Categorical order for multi-series charts. */
  series: ['#1BA7A8', '#4C7DBA', '#0B1D3A', '#E26D5C'],
} as const;

export const axisProps = {
  stroke: chartColors.axis,
  tick: { fill: chartColors.axis, fontSize: 12, fontFamily: 'inherit' },
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = {
  stroke: chartColors.grid,
  strokeDasharray: '3 3',
  vertical: false,
} as const;

export const tooltipProps = {
  cursor: { stroke: chartColors.axis, strokeDasharray: '3 3' },
  contentStyle: {
    borderRadius: 8,
    border: '1px solid rgba(197, 198, 206, 0.5)',
    boxShadow: '0 12px 24px -4px rgba(11, 29, 58, 0.08), 0 4px 8px -2px rgba(11, 29, 58, 0.03)',
    fontSize: 12,
    padding: '8px 12px',
  },
  labelStyle: { color: chartColors.navy, fontWeight: 600, marginBottom: 2 },
  itemStyle: { padding: 0 },
} as const;
