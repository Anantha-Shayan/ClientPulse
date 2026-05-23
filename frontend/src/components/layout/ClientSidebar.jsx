import { ClipboardList, FolderCheck, UserCircle } from 'lucide-react';
import Sidebar from './Sidebar';

export default function ClientSidebar() {
  return <Sidebar items={[
    { to: '/client', label: 'Project', icon: FolderCheck },
    { to: '/client/milestones', label: 'Milestones', icon: ClipboardList },
    { to: '/client/profile', label: 'Profile', icon: UserCircle }
  ]} />;
}
