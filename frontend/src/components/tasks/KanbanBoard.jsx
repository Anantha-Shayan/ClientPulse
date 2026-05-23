import { TASK_STATUSES } from '../../utils/constants';
import TaskCard from './TaskCard';
import { updateTask } from '../../services/task.api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function KanbanBoard({ tasks = [], onMoved, readOnly = false }) {
  const [dragging, setDragging] = useState(null);
  const moveTask = async (status) => {
    if (readOnly) return;
    if (!dragging || dragging.status === status) return;
    onMoved?.(dragging.id, status, true);
    try {
      await updateTask(dragging.milestoneId, dragging.id, { status });
      toast.success('Task moved');
      onMoved?.(dragging.id, status, false);
    } catch (error) {
      toast.error(error.message || 'Task move failed');
      onMoved?.(dragging.id, dragging.status, false);
    } finally {
      setDragging(null);
    }
  };

  return (
    <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-3">
      {TASK_STATUSES.map((status) => (
        <section key={status} onDragOver={(event) => !readOnly && event.preventDefault()} onDrop={() => moveTask(status)} className="min-h-96 w-[280px] shrink-0 rounded-xl border border-outline-variant bg-surface-container-low p-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-label uppercase tracking-wide text-on-surface">{status.replaceAll('_', ' ')}</h3>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-on-surface-variant">{tasks.filter((task) => task.status === status).length}</span>
          </div>
          <div className="grid gap-3">
            {tasks.filter((task) => task.status === status).map((task) => <TaskCard key={task.id} task={task} readOnly={readOnly} dragging={dragging?.id === task.id} onDragStart={() => setDragging(task)} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
