import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function TaskForm({ onSubmit, loading }) {
  const { register, handleSubmit } = useForm({ defaultValues: { priority: 'MEDIUM', status: 'TODO' } });
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Task title" {...register('title', { required: true })} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Due date" type="date" {...register('dueDate')} />
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Priority
          <select className="min-h-10 rounded-md border border-slate-200 px-3" {...register('priority')}>
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </label>
      </div>
      <Button loading={loading}>Create task</Button>
    </form>
  );
}
