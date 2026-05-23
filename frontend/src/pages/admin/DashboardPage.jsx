import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/analytics/StatCard';
import ProjectStatusPie from '../../components/analytics/ProjectStatusPie';
import ActivityFeed from '../../components/analytics/ActivityFeed';
import { useAnalytics } from '../../hooks/useAnalytics';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { FolderKanban, Rocket, Users, CheckCircle2, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { overview, projects, loading } = useAnalytics();
  if (loading) return <PageWrapper title="Analytics overview" eyebrow="Admin"><Spinner label="Loading dashboard metrics" /></PageWrapper>;
  return (
    <PageWrapper title="Analytics overview" eyebrow="Admin">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total users" value={overview?.totalUsers || 0} icon={Users} />
        <StatCard label="Active users" value={overview?.activeUsers || 0} icon={Activity} tone="green" />
        <StatCard label="Projects" value={overview?.totalProjects || 0} icon={FolderKanban} />
        <StatCard label="Active projects" value={overview?.activeProjects || 0} icon={Rocket} tone="green" />
        <StatCard label="Completed" value={overview?.completedProjects || 0} icon={CheckCircle2} tone="blue" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[420px_1fr]">
        <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm"><h2 className="mb-3 text-headline-3">Project health</h2><ProjectStatusPie distribution={projects?.healthDistribution} /></section>
        <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-headline-3">Recent activity</h2>
          {(overview?.recentActivity || []).length ? <ActivityFeed items={overview?.recentActivity || []} compact /> : <EmptyState title="No activity yet" />}
        </section>
      </div>
    </PageWrapper>
  );
}
