import { motion } from 'framer-motion';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold',
  secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20',
  ghost: 'hover:bg-white/5 text-slate-400 hover:text-white',
};

export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', loading = false,
  disabled = false, className = '', icon: Icon
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {loading ? <Spinner size="sm" /> : Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
}