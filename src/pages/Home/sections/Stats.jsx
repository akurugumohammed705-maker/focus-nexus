const STATS = [
  { num: '1', label: 'Wallet powering every module' },
  { num: '7', label: 'User roles, from customer to super admin' },
  { num: '3', label: 'Mobile Money networks supported at launch' },
  { num: '24/7', label: 'Automated order processing' },
]

export default function Stats() {
  return (
    <section className="bg-indigo text-white py-14">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-mono font-bold text-[28px] text-gold">{s.num}</div>
            <p className="text-sm text-white/70 mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
