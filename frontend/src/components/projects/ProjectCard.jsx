import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import Badge from '../ui/Badge';
import HealthBadge from '../ui/HealthBadge';
import ProjectHealthBar from './ProjectHealthBar';
import MemberChips from './MemberChips';
import { formatDate } from '../../utils/formatDate';

export default function ProjectCard({ project, detailPath }) {
  return (
    <Link to={detailPath} className="group block overflow-hidden rounded-xl border border-outline-variant/60 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary-container hover:shadow-md">
      <div className={`h-1 ${project.healthScore >= 80 ? 'bg-tertiary' : project.healthScore >= 50 ? 'bg-amber' : 'bg-error'}`} />
      <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-headline-2 text-on-surface">{project.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{project.description}</p>
        </div>
        <HealthBadge score={project.healthScore} />
      </div>
      <div className="mt-4">
        <ProjectHealthBar score={project.healthScore} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge color="blue">{project.status?.replaceAll('_', ' ')}</Badge>
        {project.tags?.map((tag) => <Badge key={tag.id || tag.label}>{tag.label}</Badge>)}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
        <CalendarDays className="h-4 w-4" />
        {formatDate(project.startDate)} to {formatDate(project.endDate)}
      </div>
      <div className="mt-4">
        <MemberChips members={project.members?.slice(0, 3)} />
      </div>
      </div>
    </Link>
  );
}
