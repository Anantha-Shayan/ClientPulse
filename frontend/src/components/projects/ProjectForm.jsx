import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function ProjectForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { status: 'PLANNING', startDate: new Date().toISOString().slice(0, 10) }
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit((values) => onSubmit({ ...values, budget: values.budget ? Number(values.budget) : undefined, tags: values.tags ? values.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [] }))}>
      <Input label="Project name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
      <label className="grid gap-1.5 text-sm font-medium text-on-surface">
        Description
        <textarea className="min-h-24 rounded-lg border border-outline-variant px-3 py-2 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-fixed" {...register('description')} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Start date" type="date" {...register('startDate', { required: 'Required' })} error={errors.startDate?.message} />
        <Input label="End date" type="date" {...register('endDate')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Budget" type="number" min="0" {...register('budget')} />
        <Input label="Tags" placeholder="commerce, ux" {...register('tags')} />
      </div>
      <Button loading={loading}>Create project</Button>
    </form>
  );
}
