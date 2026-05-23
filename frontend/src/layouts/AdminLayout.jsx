import AppShell from './AppShell';

export default function AdminLayout() {
  return (
    <AppShell
      label="Admin Console"
      items={[
        { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
        { to: '/admin/projects', label: 'Projects', icon: 'projects' },
        { to: '/admin/users', label: 'Users', icon: 'users' },
        { to: '/admin/logs', label: 'Activity Logs', icon: 'logs' },
        { to: '/admin/analytics', label: 'Analytics', icon: 'analytics' }
      ]}
    />
  );
}
