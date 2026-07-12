import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'

export default function CTA() {
  return (
    <section className="pb-24">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="bg-gradient-to-br from-indigo to-[#232a5c] rounded-[28px] px-8 py-14 text-center text-white">
          <h2 className="font-display text-[clamp(26px,3.6vw,38px)] mb-3.5">
            Focus Nexus Labs is coming
          </h2>
          <p className="text-white/75 max-w-[480px] mx-auto mb-7 text-base">
            Try upcoming features early, vote on ideas in the Ideas Hub, and help shape
            what gets built next.
          </p>
          <div className="flex justify-center gap-3.5 flex-wrap">
            <Button as={Link} to="/labs" variant="gold">
              Join the waitlist
            </Button>
            <Button as={Link} to="/labs/ideas" variant="ghostLight">
              Submit an idea
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
