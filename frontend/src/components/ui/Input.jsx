export default function Input({
  label, name, type = 'text',
  placeholder, register, error,
  className = ''
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-slate-400 font-medium">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...(register ? register(name) : {})}
        className={`
          w-full px-4 py-2.5 rounded-xl text-sm
          bg-white/5 border border-white/10
          text-white placeholder:text-slate-600
          focus:outline-none focus:border-cyan-500/50 focus:bg-white/8
          transition-all duration-200
          ${error ? 'border-rose-500/50' : ''}
          ${className}
        `}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}