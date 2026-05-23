export default function StatCard({ label, value, hint, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-primary-container/10 text-primary-container',
    green: 'bg-tertiary-fixed text-tertiary',
    amber: 'bg-amber-50 text-amber',
    red: 'bg-error-container text-error'
  };
  return (
    <article className="rounded-xl border border-outline-variant/60 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-container hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-label uppercase tracking-wide text-on-surface-variant">{label}</p>
        {Icon ? <span className={`grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></span> : null}
      </div>
      <p className="text-headline-1 text-on-surface">{value}</p>
      {hint ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </article>
  );
}
