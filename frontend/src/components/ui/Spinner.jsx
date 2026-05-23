import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-2 text-sm font-medium text-on-surface-variant">
      <Loader2 className="h-4 w-4 animate-spin text-primary-container" />
      {label}
    </div>
  );
}
