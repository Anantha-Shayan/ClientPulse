import { FolderKanban, UserCircle } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MemberSidebar() {
  return <Sidebar items={[{ to: '/member/projects', label: 'My Projects', icon: FolderKanban }, { to: '/member/profile', label: 'Profile', icon: UserCircle }]} />;
}
