import { NavLink } from 'react-router-dom';

export default function Sidebar({ items }) {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-ink text-white lg:block">
      <div className="px-5 py-6">
        <p className="text-xl font-black">ClientPulse</p>
        <p className="mt-1 text-xs text-slate-300">Agency delivery command center</p>
      </div>
      <nav className="grid gap-1 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-white text-ink' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
