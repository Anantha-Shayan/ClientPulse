import { formatDate } from '../../utils/formatDate';

export default function MilestoneTimeline({ milestones = [] }) {
  return <div className="grid gap-3">{milestones.map((m) => <div key={m.id} className="border-l-4 border-ocean bg-white py-2 pl-4"><p className="font-bold">{m.title}</p><p className="text-sm text-slate-500">{formatDate(m.dueDate)} · {m.status}</p></div>)}</div>;
}
