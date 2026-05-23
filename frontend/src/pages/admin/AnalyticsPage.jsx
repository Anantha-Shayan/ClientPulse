import PageWrapper from '../../components/layout/PageWrapper';
import ProjectStatusPie from '../../components/analytics/ProjectStatusPie';
import TeamUtilizationBar from '../../components/analytics/TeamUtilizationBar';
import { useAnalytics } from '../../hooks/useAnalytics';
import Spinner from '../../components/ui/Spinner';

export default function AnalyticsPage() {
  const { projects, team, loading } = useAnalytics();
  if (loading) return <PageWrapper title="BI analytics" eyebrow="Admin"><Spinner label="Loading analytics" /></PageWrapper>;
  return (
    <PageWrapper title="BI analytics" eyebrow="Admin">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm"><h2 className="mb-3 text-headline-3">Health distribution</h2><ProjectStatusPie distribution={projects?.healthDistribution} /></section>
        <section className="rounded-xl border border-outline-variant bg-white p-5 shadow-sm"><h2 className="mb-3 text-headline-3">Team utilization</h2><TeamUtilizationBar data={team} /></section>
      </div>
    </PageWrapper>
  );
}
