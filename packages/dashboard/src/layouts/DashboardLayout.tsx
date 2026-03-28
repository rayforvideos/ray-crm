import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/segments', label: 'Segments' },
  { to: '/users', label: 'Users' },
  { to: '/events', label: 'Events' },
  { to: '/settings', label: 'Settings' },
];

export function DashboardLayout() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: 240,
        padding: 16,
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Ray CRM</h1>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'block',
              padding: '8px 12px',
              borderRadius: 6,
              marginBottom: 4,
              textDecoration: 'none',
              color: isActive ? '#3b82f6' : '#374151',
              background: isActive ? '#eff6ff' : 'transparent',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={logout}
          style={{
            marginTop: 'auto',
            padding: '8px 12px',
            background: 'none',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </nav>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
