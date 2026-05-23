import EmptyState from '../ui/EmptyState';
import MilestoneCard from './MilestoneCard';

export default function MilestoneList({ milestones = [] }) {
  if (!milestones.length) return <EmptyState title="No milestones" body="Milestones will appear once the project plan is created." />;
  return <div className="grid gap-3">{milestones.map((milestone) => <MilestoneCard key={milestone.id} milestone={milestone} />)}</div>;
}
