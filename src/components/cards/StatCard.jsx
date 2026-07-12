export default function StatCard({ label, value, hint, accent = '#161B3D' }) {
  return (
    <div className="bg-white border border-line rounded-brand p-5">
      <p className="text-[13px] text-muted mb-1.5">{label}</p>
      <p className="font-display font-bold text-2xl" style={{ color: accent }}>
        {value}
      </p>
      {hint && <p className="text-[12.5px] text-muted mt-1">{hint}</p>}
    </div>
  )
}
