import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

export default function MilestoneCard({ milestone }) {
  const status = milestone.computedStatus || milestone.status;
  const color = status === 'COMPLETED' ? 'green' : status === 'OVERDUE' ? 'red' : status === 'IN_PROGRESS' ? 'blue' : 'amber';
  return (
    <article className="rounded-xl border border-outline-variant bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-on-surface">{milestone.title}</h3>
          <p className="mt-1 text-sm text-on-surface-variant">{milestone.description}</p>
        </div>
        <Badge color={color}>{status.replaceAll('_', ' ')}</Badge>
      </div>
      <p className="mt-3 text-sm font-medium text-on-surface-variant">Due {formatDate(milestone.dueDate)}</p>
    </article>
  );
}
