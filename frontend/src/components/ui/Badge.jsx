const palette = {
  green: 'bg-tertiary-fixed text-tertiary ring-tertiary-fixed-dim',
  amber: 'bg-amber-50 text-amber ring-amber-200',
  red: 'bg-error-container text-error ring-red-200',
  blue: 'bg-primary-fixed text-primary ring-primary-fixed-dim',
  slate: 'bg-surface-container text-on-surface-variant ring-outline-variant'
};

export default function Badge({ children, color = 'slate' }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${palette[color]}`}>{children}</span>;
}
