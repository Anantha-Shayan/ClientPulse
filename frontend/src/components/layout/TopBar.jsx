import { LogOut, Search } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur">
      <div className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-500 md:flex">
        <Search className="h-4 w-4" />
        <span>Search projects, milestones, tasks</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Avatar name={user?.name} />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
        <Button variant="ghost" icon={LogOut} onClick={logout} className="px-2" aria-label="Logout" />
      </div>
    </header>
  );
}
