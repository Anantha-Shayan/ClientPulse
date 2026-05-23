import { getHealthColor, getHealthLabel } from '../../utils/getHealthColor';

export default function HealthBadge({ score }) {
  const color = score >= 80 ? 'bg-tertiary-fixed text-tertiary' : score >= 50 ? 'bg-amber-50 text-amber' : 'bg-error-container text-error';
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${color}`}>{getHealthLabel(score)} · {score}</span>;
}
