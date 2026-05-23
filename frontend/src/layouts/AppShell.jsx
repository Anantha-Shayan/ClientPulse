import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart3, Bell, FolderKanban, HelpCircle, LayoutDashboard, LogOut, Menu, Search, Settings, UserCircle, Users, X } from 'lucide-react';
import { useState } from 'react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const iconMap = { dashboard: LayoutDashboard, projects: FolderKanban, users: Users, logs: Activity, analytics: BarChart3, profile: UserCircle };

const titles = {
  '/admin': 'Dashboard',
  '/admin/projects': 'All Projects',
  '/admin/users': 'Team & Access',
  '/admin/logs': 'Activity Logs',
  '/admin/analytics': 'Analytics',
  '/member/projects': 'My Projects',
  '/member/profile': 'Profile Settings'
};

function SidebarContent({ items, label, onNavigate }) {
  const { user, logout } = useAuth();
  return (
    <aside className="flex h-full w-64 flex-col bg-inverse-surface py-6 text-inverse-on-surface">
      <div className="mb-10 px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-container text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-headline-2 font-bold text-white">ClientPulse</h1>
            <p className="text-caption text-surface-variant/80">{label}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-r-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-l-4 border-primary-container bg-primary-container/15 text-primary-fixed-dim'
                    : 'border-l-4 border-transparent text-surface-variant hover:bg-surface-variant/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-surface-variant/15 px-4 pt-5">
        <div className="mb-4 flex items-center gap-3 rounded-lg px-2 py-2 text-surface-variant">
          <Avatar name={user?.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-surface-variant transition hover:bg-surface-variant/10 hover:text-white">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function AppShell({ items, label }) {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = titles[location.pathname] || (location.pathname.includes('/projects/') ? 'Project Workspace' : 'ClientPulse');

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <SidebarContent items={items} label={label} />
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-ink/40" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} className="relative h-full">
              <SidebarContent items={items} label={label} onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/95 px-4 shadow-sm backdrop-blur lg:ml-64 lg:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Button variant="ghost" icon={mobileOpen ? X : Menu} className="px-2 lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation" />
          <h2 className="hidden text-headline-2 text-on-surface sm:block">{title}</h2>
          <div className="relative hidden w-80 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <input className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-10 pr-3 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-fixed" placeholder="Search workspace..." />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={Bell} className="px-2" aria-label="Notifications" />
          <Button variant="ghost" icon={HelpCircle} className="hidden px-2 sm:inline-flex" aria-label="Help" />
          <Button variant="ghost" icon={Settings} className="hidden px-2 sm:inline-flex" aria-label="Settings" />
          <div className="mx-2 h-8 w-px bg-outline-variant" />
          <Avatar name={user?.name} />
        </div>
      </header>

      <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="lg:ml-64">
        <Outlet />
      </motion.div>
    </div>
  );
}
