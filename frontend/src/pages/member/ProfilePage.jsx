import PageWrapper from '../../components/layout/PageWrapper';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <PageWrapper title="Profile" eyebrow="Account">
      <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4"><Avatar name={user?.name} /><div><h2 className="font-bold text-on-surface">{user?.name}</h2><p className="text-sm text-on-surface-variant">{user?.email}</p></div></div>
      </section>
    </PageWrapper>
  );
}
