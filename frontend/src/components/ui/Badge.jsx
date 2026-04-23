const variants = {
  admin: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  analyst: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  viewer: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  income: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  expense: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  inactive: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

export default function Badge({ label, variant }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.viewer}`}>
      {label}
    </span>
  );
}