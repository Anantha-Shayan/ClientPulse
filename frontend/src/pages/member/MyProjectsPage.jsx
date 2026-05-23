import PageWrapper from '../../components/layout/PageWrapper';
import ProjectCard from '../../components/projects/ProjectCard';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { useProjects } from '../../hooks/useProjects';

export default function MyProjectsPage() {
  const { data, loading } = useProjects('member');
  return (
    <PageWrapper title="My projects" eyebrow="Member workspace">
      {loading ? <Spinner label="Loading assigned projects" /> : data.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.map((project) => <ProjectCard key={project.id} project={project} detailPath={`/member/projects/${project.id}`} />)}</div> : <EmptyState title="No assigned projects" body="Ask an admin to add you to a project team." />}
    </PageWrapper>
  );
}
