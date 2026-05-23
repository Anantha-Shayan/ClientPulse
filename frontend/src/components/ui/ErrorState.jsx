import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message = 'The request could not be completed.', onRetry }) {
  return (
    <div className="rounded-xl border border-error-container bg-white p-6 text-center shadow-sm">
      <AlertCircle className="mx-auto h-8 w-8 text-error" />
      <h3 className="mt-3 font-semibold text-on-surface">{title}</h3>
      <p className="mt-1 text-sm text-on-surface-variant">{message}</p>
      {onRetry ? <Button icon={RefreshCw} variant="secondary" className="mt-4" onClick={onRetry}>Retry</Button> : null}
    </div>
  );
}
