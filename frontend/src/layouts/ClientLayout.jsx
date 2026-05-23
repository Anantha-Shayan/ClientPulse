import { Outlet } from 'react-router-dom';
import { Bell, HelpCircle, LogOut } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <nav className="sticky top-0 z-40 border-b border-outline-variant bg-surface shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-container text-white font-black">CP</div>
            <span className="text-headline-2 font-bold text-primary">ClientPulse</span>
          </div>
          <div className="hidden text-headline-2 text-on-surface md:block">Client Portal</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={HelpCircle} className="hidden px-2 md:inline-flex">Support</Button>
            <Button variant="ghost" icon={Bell} className="px-2" aria-label="Notifications" />
            <Avatar name={user?.name} />
            <Button variant="ghost" icon={LogOut} className="px-2" onClick={logout} aria-label="Sign out" />
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
