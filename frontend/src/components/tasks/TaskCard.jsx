import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

export default function TaskCard({ task, dragging = false, onDragStart, readOnly = false }) {
  const color = task.priority === 'CRITICAL' ? 'red' : task.priority === 'HIGH' ? 'amber' : 'slate';
  return (
    <article draggable={!readOnly} onDragStart={onDragStart} className={`${readOnly ? '' : 'cursor-grab active:cursor-grabbing'} rounded-xl border border-outline-variant bg-white p-3 shadow-sm transition ${dragging ? 'scale-[0.98] opacity-60 ring-2 ring-primary-fixed' : 'hover:-translate-y-0.5 hover:shadow-md'}`}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-on-surface">{task.title}</h4>
        <Badge color={color}>{task.priority}</Badge>
      </div>
      <p className="mt-2 text-xs text-on-surface-variant">{task.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-on-surface-variant">
        <span>{task.assignedTo?.name || 'Unassigned'}</span>
        <span>{formatDate(task.dueDate)}</span>
      </div>
    </article>
  );
}
