import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, ArrowLeftRight, Users, LogOut, TrendingUp } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'analyst', 'viewer'] },
  { label: 'Transactions', icon: ArrowLeftRight, path: '/transactions', roles: ['admin', 'analyst'] },
  { label: 'Users', icon: Users, path: '/users', roles: ['admin'] },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filtered = navItems.filter(i => i.roles.includes(user?.role));

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', left: 0, top: 0,
        height: '100vh', width: '220px',
        background: 'rgba(8,12,20,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        zIndex: 30, fontFamily: "'DM Sans', sans-serif"
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'rgba(34,211,238,0.15)',
            border: '1px solid rgba(34,211,238,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <TrendingUp size={16} color="#22d3ee" />
          </div>
          <div>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '15px', fontWeight: '700',
              color: '#f1f5f9', margin: 0, lineHeight: 1.2
            }}>FinanceOS</p>
            <p style={{ fontSize: '11px', color: '#334155', margin: 0 }}>Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{
          fontSize: '10px', color: '#334155', fontWeight: '600',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0 8px', marginBottom: '8px'
        }}>Menu</p>

        {filtered.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <NavLink
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '10px',
                fontSize: '13px', fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(34,211,238,0.08)' : 'transparent',
                color: isActive ? '#22d3ee' : '#475569',
                border: isActive ? '1px solid rgba(34,211,238,0.15)' : '1px solid transparent',
              })}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', marginBottom: '4px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.03)'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(34,211,238,0.15)',
            border: '1px solid rgba(34,211,238,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', color: '#22d3ee', flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0, fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '11px', color: '#334155', margin: 0, textTransform: 'capitalize' }}>
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '10px',
            fontSize: '13px', color: '#475569',
            background: 'transparent', border: 'none',
            cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.background = 'rgba(244,63,94,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}