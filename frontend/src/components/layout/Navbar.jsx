import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Badge from '../ui/Badge';

const pageTitles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/users': 'Users',
};

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Finance OS';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 flex items-center justify-between px-8 border-b border-white/5"
      style={{ background: 'rgba(8, 12, 20, 0.8)', backdropFilter: 'blur(20px)' }}
    >
      <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Syne' }}>
        {title}
      </h2>
      <div className="flex items-center gap-3">
        <Badge label={user?.role} variant={user?.role} />
        <span className="text-sm text-slate-400">{user?.email}</span>
      </div>
    </motion.header>
  );
}