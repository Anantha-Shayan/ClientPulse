import { Activity, BarChart3, FolderKanban, LayoutDashboard, Users } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AdminSidebar() {
  return <Sidebar items={[
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/logs', label: 'Activity', icon: Activity },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 }
  ]} />;
}
