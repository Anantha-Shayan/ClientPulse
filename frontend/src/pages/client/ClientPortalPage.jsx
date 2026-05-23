import PageWrapper from '../../components/layout/PageWrapper';
import HealthBadge from '../../components/ui/HealthBadge';
import MilestoneList from '../../components/milestones/MilestoneList';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import MemberChips from '../../components/projects/MemberChips';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { useProjects } from '../../hooks/useProjects';
import { useMilestones } from '../../hooks/useMilestones';
import { useTasks } from '../../hooks/useTasks';
import { summarizeProject } from '../../lib/metrics';
import ProjectHealthBar from '../../components/projects/ProjectHealthBar';

export default function ClientPortalPage() {
  const { data, loading } = useProjects('client');
  const project = data[0];
  const milestones = useMilestones(project?.id);
  const tasks = useTasks(milestones.data);
  const summary = summarizeProject({ ...project, milestones: milestones.data });
  if (loading) return <main className="mx-auto max-w-7xl p-6"><Spinner label="Loading client portal" /></main>;
  if (!project) return <main className="mx-auto max-w-7xl p-6"><EmptyState title="No linked project" body="Your client account is not linked to a project yet." /></main>;
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6 xl:px-8">
      <section className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-sm md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <p className="text-label uppercase tracking-wide text-primary">Read-only delivery view</p>
            <h1 className="mt-2 text-display text-on-surface">{project.name}</h1>
            <p className="mt-3 max-w-3xl text-body-lg text-on-surface-variant">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <HealthBadge score={project.healthScore} />
              <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-surface-variant">{project.status?.replaceAll('_', ' ')}</span>
            </div>
          </div>
          <div className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm">
            <ProjectHealthBar score={project.healthScore} />
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm"><p className="text-label uppercase text-on-surface-variant">Milestones</p><p className="mt-2 text-headline-1">{summary.completedMilestones}/{summary.milestones.length}</p></div>
        <div className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm"><p className="text-label uppercase text-on-surface-variant">Tasks</p><p className="mt-2 text-headline-1">{summary.completedTasks}/{summary.tasks.length}</p></div>
        <div className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm"><p className="text-label uppercase text-on-surface-variant">Project team</p><div className="mt-3"><MemberChips members={project.members || []} /></div></div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <section className="grid gap-5"><MilestoneList milestones={milestones.data} /></section>
        <KanbanBoard tasks={tasks.data} readOnly />
      </div>
    </main>
  );
}
