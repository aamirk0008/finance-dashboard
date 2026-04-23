import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, ArrowLeftRight,
  Users, LogOut, TrendingUp
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { isAdmin, canRead } from '../../utils/roleGuard';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'analyst', 'viewer'] },
  { label: 'Transactions', icon: ArrowLeftRight, path: '/transactions', roles: ['admin', 'analyst'] },
  { label: 'Users', icon: Users, path: '/users', roles: ['admin'] },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 flex flex-col z-30"
      style={{ borderRadius: 0, background: 'rgba(8, 12, 20, 0.9)' }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <TrendingUp size={16} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white" style={{ fontFamily: 'Syne' }}>FinanceOS</h1>
            <p className="text-xs text-slate-600">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {filteredNav.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all duration-200
                ${isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}