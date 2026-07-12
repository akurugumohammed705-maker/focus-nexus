import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import NexusDiagram from '../../../components/common/NexusDiagram'

export default function Hero() {
  return (
    <section className="pt-16 pb-10">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div>
          <Badge dot>Now building in public — Sprint 1.1</Badge>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-[clamp(34px,5vw,54px)] leading-[1.06] text-indigo mt-4 mb-5"
          >
            One wallet.
            <br />
            Six worlds,
            <br />
            <span className="text-gold">one Nexus.</span>
          </motion.h1>

          <p className="text-[17.5px] text-muted max-w-[480px] mb-7">
            Data, airtime, results checkers, a marketplace, a learning academy, and a
            community that rewards you — all running on one Ghanaian wallet, built for
            how you actually hustle.
          </p>

          <div className="flex gap-3.5 flex-wrap mb-8">
            <Button as={Link} to="/register" variant="gold">
              Create your wallet
            </Button>
            <Button as="a" href="#modules" variant="ghost">
              See what's inside ↓
            </Button>
          </div>

          <div className="flex items-center gap-2.5 text-[13.5px] text-muted">
            <span className="flex">
              <span className="w-6 h-6 rounded-full border-2 border-bg bg-indigo -ml-0" />
              <span className="w-6 h-6 rounded-full border-2 border-bg bg-indigo -ml-2" />
              <span className="w-6 h-6 rounded-full border-2 border-bg bg-indigo -ml-2" />
            </span>
            Built for agents, students, vendors and everyday customers alike
          </div>
        </div>

        <NexusDiagram />
      </div>
    </section>
  )
}
