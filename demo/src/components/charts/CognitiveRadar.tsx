import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { cognitiveDomains, type CognitiveProfile } from '../../logic/assessment';
import { t } from '../../strings';
import { chartColors } from './chartTheme';

export function CognitiveRadar({ profile, height = 220 }: { profile: CognitiveProfile; height?: number }) {
  const data = cognitiveDomains.map((d) => ({ domain: t.cognitiveDomains[d], score: profile[d] }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={chartColors.grid} />
        <PolarAngleAxis dataKey="domain" tick={{ fill: chartColors.navy, fontSize: 12, fontWeight: 600 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="score" stroke={chartColors.teal} strokeWidth={2.25} fill={chartColors.teal} fillOpacity={0.22} isAnimationActive={false} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
