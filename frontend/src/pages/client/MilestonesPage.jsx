import PageWrapper from '../../components/layout/PageWrapper';
import MilestoneList from '../../components/milestones/MilestoneList';
import Spinner from '../../components/ui/Spinner';
import { useProjects } from '../../hooks/useProjects';
import { useMilestones } from '../../hooks/useMilestones';

export default function MilestonesPage() {
  const { data, loading } = useProjects('client');
  const milestones = useMilestones(data[0]?.id);
  return <PageWrapper title="Milestones" eyebrow="Client portal">{loading || milestones.loading ? <Spinner label="Loading milestones" /> : <MilestoneList milestones={milestones.data} />}</PageWrapper>;
}
