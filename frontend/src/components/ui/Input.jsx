import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-on-surface">
      {label}
      <input
        ref={ref}
        className={`min-h-10 rounded-lg border border-outline-variant bg-white px-3 text-on-surface outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-fixed ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-error">{error}</span> : null}
    </label>
  );
});

export default Input;
