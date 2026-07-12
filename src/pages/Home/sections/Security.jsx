import Badge from '../../../components/ui/Badge'

const POINTS = [
  {
    title: 'Full audit logging',
    desc: 'Logins, payments, wallet changes, profile edits and admin actions are all recorded.',
  },
  {
    title: 'Server-side secrets',
    desc: 'Paystack and supplier API keys are never exposed in client-side code.',
  },
  {
    title: 'Role-based access',
    desc: 'Super Admin, Staff, Agent, Sub-Agent, Customer, Business and Vendor each see only what they need.',
  },
  {
    title: 'Row-level security',
    desc: 'Supabase Postgres policies enforce access rules at the database layer, not just the UI.',
  },
]

export default function Security() {
  return (
    <section id="security" className="py-20">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
        <div>
          <Badge className="mb-3.5">Built to be trusted</Badge>
          <h2 className="font-display text-[clamp(26px,3.2vw,34px)] text-indigo mt-1 mb-3">
            Every action leaves a trail
          </h2>
          <p className="text-muted text-base">
            Payment secrets and supplier keys never touch the browser. They live
            server-side, behind Supabase Edge Functions, where they belong.
          </p>
        </div>

        <ul className="grid gap-4">
          {POINTS.map((p) => (
            <li
              key={p.title}
              className="flex gap-3.5 items-start bg-white border border-line rounded-2xl px-4.5 py-4"
            >
              <span className="w-[22px] h-[22px] rounded-full bg-green/15 text-green flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <strong className="block text-[14.5px] text-indigo mb-0.5">{p.title}</strong>
                <span className="text-[13.5px] text-muted">{p.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
