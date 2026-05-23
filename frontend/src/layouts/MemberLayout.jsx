import AppShell from './AppShell';

export default function MemberLayout() {
  return (
    <AppShell
      label="Member Workspace"
      items={[
        { to: '/member/projects', label: 'My Projects', icon: 'projects' },
        { to: '/member/profile', label: 'Profile', icon: 'profile' }
      ]}
    />
  );
}
