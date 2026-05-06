import { BarChart3, FileCheck2, Files, LogOut, Megaphone, Moon, Sun, UploadCloud } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';

const navItems = {
  teacher: [
    { label: 'Dashboard', href: '/teacher/dashboard', icon: BarChart3 },
    { label: 'Upload', href: '/teacher/upload', icon: UploadCloud },
    { label: 'My Content', href: '/teacher/content', icon: Files },
  ],
  principal: [
    { label: 'Dashboard', href: '/principal/dashboard', icon: BarChart3 },
    { label: 'Approvals', href: '/principal/approvals', icon: FileCheck2 },
    { label: 'All Content', href: '/principal/content', icon: Files },
  ],
};

export function AppLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600">
            <Megaphone size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-extrabold">EduCast</p>
            <p className="text-xs font-semibold text-slate-300">Content Broadcasts</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white/10 p-3">
          <p className="text-sm font-extrabold">{user?.name}</p>
          <p className="text-xs capitalize text-slate-300">{user?.role}</p>
        </div>

        <nav className="grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
                key={item.href}
                to={item.href}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 grid gap-2">
          <Button aria-label="Toggle light and dark theme" className="w-full justify-start" onClick={toggleTheme} variant="secondary">
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </Button>
          <Button className="w-full justify-start" onClick={handleLogout} variant="secondary">
            <LogOut size={17} aria-hidden="true" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="main-panel">
        <div className="page-surface">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
