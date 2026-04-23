import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/users': 'User Management',
};

const roleColors = {
  admin: { bg: 'rgba(34,211,238,0.10)', color: '#22d3ee', border: 'rgba(34,211,238,0.20)' },
  analyst: { bg: 'rgba(16,185,129,0.10)', color: '#10b981', border: 'rgba(16,185,129,0.20)' },
  viewer: { bg: 'rgba(100,116,139,0.10)', color: '#64748b', border: 'rgba(100,116,139,0.20)' },
};

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'FinanceOS';
  const rc = roleColors[user?.role] || roleColors.viewer;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        height: '60px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8,12,20,0.85)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0
      }}
    >
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '16px', fontWeight: '600',
        color: '#f1f5f9', margin: 0
      }}>{title}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: '#334155', fontFamily: "'DM Sans', sans-serif" }}>
          {user?.email}
        </span>
        <span style={{
          fontSize: '11px', fontWeight: '600',
          padding: '4px 10px', borderRadius: '20px',
          background: rc.bg, color: rc.color,
          border: `1px solid ${rc.border}`,
          textTransform: 'capitalize',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          {user?.role}
        </span>
      </div>
    </motion.header>
  );
}