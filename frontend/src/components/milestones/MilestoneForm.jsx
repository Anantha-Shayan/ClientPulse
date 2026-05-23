import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function MilestoneForm({ onSubmit, loading }) {
  const { register, handleSubmit } = useForm({ defaultValues: { status: 'PENDING' } });
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Title" {...register('title', { required: true })} />
      <Input label="Due date" type="date" {...register('dueDate', { required: true })} />
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Description
        <textarea className="min-h-20 rounded-md border border-slate-200 px-3 py-2" {...register('description')} />
      </label>
      <Button loading={loading}>Create milestone</Button>
    </form>
  );
}
