import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data yet', body = 'Create records or adjust filters to see results.' }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-outline-variant bg-white px-6 py-12 text-center">
      <Inbox className="mb-3 h-8 w-8 text-outline" />
      <h3 className="font-semibold text-on-surface">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-on-surface-variant">{body}</p>
    </div>
  );
}
