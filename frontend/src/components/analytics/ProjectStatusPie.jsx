import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function ProjectStatusPie({ distribution = {} }) {
  const data = [
    { name: 'On Track', value: distribution.onTrack || 0, color: '#006e4b' },
    { name: 'At Risk', value: distribution.atRisk || 0, color: '#b7791f' },
    { name: 'Critical', value: distribution.critical || 0, color: '#ba1a1a' }
  ];
  return <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>{data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>;
}
