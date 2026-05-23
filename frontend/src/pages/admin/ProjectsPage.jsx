import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, SlidersHorizontal } from 'lucide-react';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import PageWrapper from '../../components/layout/PageWrapper';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import SearchInput from '../../components/ui/SearchInput';
import { createProject, listProjects } from '../../services/project.api';

export default function ProjectsPage() {
  const [state, setState] = useState({ data: [], loading: true, pagination: null });
  const [filters, setFilters] = useState({ search: '', status: '', tag: '' });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);
  const loadProjects = () => {
    setState((current) => ({ ...current, loading: true }));
    listProjects(params)
      .then((res) => setState({ data: res.data, pagination: res.pagination, loading: false }))
      .catch(() => {
        toast.error('Projects could not be loaded');
        setState({ data: [], pagination: null, loading: false });
      });
  };

  useEffect(() => {
    const timer = setTimeout(loadProjects, 250);
    return () => clearTimeout(timer);
  }, [params.search, params.status, params.tag]);

  const submit = async (payload) => {
    setLoading(true);
    try {
      await createProject({ ...payload, startDate: new Date(payload.startDate).toISOString(), endDate: payload.endDate ? new Date(payload.endDate).toISOString() : undefined });
      toast.success('Project created');
      setOpen(false);
      loadProjects();
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageWrapper title="All Projects" eyebrow="Portfolio" actions={<Button icon={Plus} onClick={() => setOpen(true)}>New Project</Button>}>
      <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
        <SearchInput value={filters.search} onChange={(search) => setFilters((current) => ({ ...current, search }))} placeholder="Search projects..." className="min-w-64 flex-1" />
        <select className="h-10 rounded-lg border border-outline-variant bg-white px-3 text-sm" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="">All statuses</option>
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="ON_HOLD">On hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <SearchInput value={filters.tag} onChange={(tag) => setFilters((current) => ({ ...current, tag }))} placeholder="Tag filter" className="w-48" />
        <Button variant="secondary" icon={SlidersHorizontal} onClick={loadProjects}>Apply</Button>
      </section>
      {state.loading ? <Spinner label="Loading projects" /> : state.data.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{state.data.map((project) => <ProjectCard key={project.id} project={project} detailPath={`/admin/projects/${project.id}`} />)}</div> : <EmptyState title="No projects match these filters" body="Try changing the search, status, or tag filters." />}
      <Drawer title="Create project" description="Create a real project record, tags, and optional member assignments." open={open} onClose={() => setOpen(false)}><ProjectForm onSubmit={submit} loading={loading} /></Drawer>
    </PageWrapper>
  );
}
