import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function TeamUtilizationBar({ data = [] }) {
  return <ResponsiveContainer width="100%" height={280}><BarChart data={data} layout="vertical" margin={{ left: 28 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e7ff" /><XAxis type="number" /><YAxis type="category" dataKey="name" /><Tooltip /><Bar dataKey="assignedTasks" fill="#1b4fe8" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>;
}
