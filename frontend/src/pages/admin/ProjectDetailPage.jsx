import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flag, Kanban, ListChecks, RefreshCw } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import HealthBadge from '../../components/ui/HealthBadge';
import MilestoneList from '../../components/milestones/MilestoneList';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { getProject } from '../../services/project.api';
import { useMilestones } from '../../hooks/useMilestones';
import { useTasks } from '../../hooks/useTasks';
import { summarizeProject } from '../../lib/metrics';
import ProjectHealthBar from '../../components/projects/ProjectHealthBar';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState('kanban');
  const [localTasks, setLocalTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const milestones = useMilestones(id);
  const tasks = useTasks(milestones.data);

  const loadProject = () => {
    setLoadingProject(true);
    getProject(id).then((res) => setProject(res.data)).finally(() => setLoadingProject(false));
  };

  useEffect(() => { loadProject(); }, [id]);
  useEffect(() => setLocalTasks(tasks.data), [tasks.data]);
  const summary = useMemo(() => summarizeProject({ ...project, milestones: milestones.data }), [project, milestones.data]);

  const handleMoved = (taskId, status) => {
    setLocalTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task));
  };

  if (loadingProject) return <PageWrapper title="Project Workspace" eyebrow="Delivery detail"><Spinner label="Loading project workspace" /></PageWrapper>;

  return (
    <PageWrapper title={project?.name || 'Project'} eyebrow="Delivery workspace" actions={<div className="flex gap-2">{project ? <HealthBadge score={project.healthScore} /> : null}<Button variant="secondary" icon={RefreshCw} onClick={loadProject}>Refresh</Button></div>}>
      <section className="mb-5 rounded-xl border border-outline-variant bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-body text-on-surface-variant">{project?.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-surface-container-low p-4"><p className="text-label uppercase text-on-surface-variant">Milestones</p><p className="mt-2 text-headline-2">{summary.completedMilestones}/{summary.milestones.length}</p></div>
              <div className="rounded-lg bg-surface-container-low p-4"><p className="text-label uppercase text-on-surface-variant">Tasks</p><p className="mt-2 text-headline-2">{summary.completedTasks}/{summary.tasks.length}</p></div>
              <div className="rounded-lg bg-surface-container-low p-4"><p className="text-label uppercase text-on-surface-variant">Status</p><p className="mt-2 text-headline-2">{project?.status?.replaceAll('_', ' ')}</p></div>
            </div>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <ProjectHealthBar score={project?.healthScore || 0} />
          </div>
        </div>
      </section>
      <div className="mb-5 flex overflow-x-auto border-b border-outline-variant">
        {[{ id: 'kanban', label: 'Kanban', icon: Kanban }, { id: 'milestones', label: 'Milestones', icon: Flag }, { id: 'tasks', label: 'Tasks', icon: ListChecks }].map(({ id: value, label, icon: Icon }) => (
          <button key={value} onClick={() => setTab(value)} className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${tab === value ? 'border-primary-container text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-5">
        {tab === 'kanban' ? localTasks.length ? <KanbanBoard tasks={localTasks} onMoved={handleMoved} /> : <EmptyState title="No tasks on this board" /> : null}
        {tab === 'milestones' ? <MilestoneList milestones={milestones.data} /> : null}
        {tab === 'tasks' ? <KanbanBoard tasks={localTasks} onMoved={handleMoved} /> : null}
      </div>
    </PageWrapper>
  );
}
