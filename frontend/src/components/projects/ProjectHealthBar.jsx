import { getHealthLabel } from '../../utils/getHealthColor';

export default function ProjectHealthBar({ score = 0 }) {
  const color = score >= 80 ? 'bg-leaf' : score >= 50 ? 'bg-amber' : 'bg-coral';
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold text-on-surface-variant">
        <span>{getHealthLabel(score)}</span>
        <span>{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
