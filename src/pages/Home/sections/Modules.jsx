import ModuleCard from '../../../components/cards/ModuleCard'
import Badge from '../../../components/ui/Badge'

const MODULES = [
  {
    icon: '💳',
    iconBg: 'rgba(30,158,108,0.14)',
    title: 'Wallet',
    description:
      'Fund by Mobile Money or card, track every transaction, and send transfers or refunds without leaving the app.',
  },
  {
    icon: '📶',
    iconBg: 'rgba(232,163,61,0.18)',
    title: 'Digital Services',
    description:
      'MTN, Vodafone and AirtelTigo data, airtime, electricity, TV, and WAEC/BECE results checker PINs — instantly.',
  },
  {
    icon: '🛍️',
    iconBg: 'rgba(217,85,58,0.14)',
    title: 'Marketplace',
    description:
      'Vendors list real products, buyers browse and order, and every purchase carries verified reviews.',
  },
  {
    icon: '🎓',
    iconBg: 'rgba(22,27,61,0.10)',
    title: 'Academy',
    description:
      'Video and PDF courses with quizzes and certificates — built for GES-aligned learning and beyond.',
  },
  {
    icon: '💬',
    iconBg: 'rgba(30,158,108,0.14)',
    title: 'Community',
    description:
      'Groups, discussions and announcements where agents, vendors and customers actually talk to each other.',
  },
  {
    icon: '🏆',
    iconBg: 'rgba(232,163,61,0.18)',
    title: 'Challenges & Hall of Fame',
    description:
      "Weekly, monthly and annual challenges with rankings, badges and awards for the platform's top performers.",
  },
]

export default function Modules() {
  return (
    <section id="modules" className="py-[70px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="max-w-[560px] mb-11">
          <Badge className="mb-3.5">The platform</Badge>
          <h2 className="font-display text-[clamp(26px,3.4vw,36px)] text-indigo mb-3">
            Six worlds. One login.
          </h2>
          <p className="text-muted text-base">
            Every module reads from the same wallet and the same profile — top up once,
            use it everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m) => (
            <ModuleCard key={m.title} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}
