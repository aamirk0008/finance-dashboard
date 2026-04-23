import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color = 'cyan', trend, index = 0 }) {
  const colors = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'glow-cyan', border: 'border-cyan-500/20' },
    green: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'glow-green', border: 'border-emerald-500/20' },
    red: { text: 'text-rose-400', bg: 'bg-rose-500/10', glow: 'glow-red', border: 'border-rose-500/20' },
    yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', glow: '', border: 'border-yellow-500/20' },
  };

  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass p-6 ${c.glow} cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon size={20} className={c.text} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className={`font-mono text-2xl font-semibold ${c.text}`}>{value}</p>
    </motion.div>
  );
}