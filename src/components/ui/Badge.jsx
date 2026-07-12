export default function Badge({ children, dot = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-indigo bg-gold/15 border border-gold/40 rounded-full px-3 py-1.5 ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
      {children}
    </span>
  )
}
