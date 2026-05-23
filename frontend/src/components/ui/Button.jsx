import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const styles = {
  primary: 'bg-primary-container text-white shadow-sm hover:bg-primary',
  secondary: 'bg-white text-on-surface border border-outline-variant hover:bg-surface-container-low',
  danger: 'bg-error text-white hover:bg-red-800',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container'
};

export default function Button({ children, icon: Icon, variant = 'primary', loading = false, className = '', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
