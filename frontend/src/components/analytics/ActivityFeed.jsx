import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';

export default function ActivityFeed({ items = [], compact = false }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article key={item._id || `${item.action}-${item.createdAt}`} className="relative rounded-xl border border-outline-variant/60 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-on-surface">{item.action?.replaceAll('_', ' ')}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{item.performedBy?.name} · {formatDate(item.createdAt)}</p>
            </div>
            <Badge color="blue">{item.performedBy?.role}</Badge>
          </div>
          {!compact && item.metadata ? <pre className="mt-3 overflow-auto rounded-lg bg-surface-container-low p-3 text-xs text-on-surface-variant">{JSON.stringify(item.metadata, null, 2)}</pre> : null}
        </article>
      ))}
    </div>
  );
}
