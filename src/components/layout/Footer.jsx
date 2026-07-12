import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line pt-12 pb-8">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(3,1fr)] gap-8 mb-10">
          <div>
            <span className="font-display font-bold text-lg text-indigo">
              Focus<span className="text-gold">Nexus</span>
            </span>
            <p className="text-muted text-sm max-w-[280px] mt-3">
              Ghana's all-in-one digital hub — data, marketplace, academy, community and
              more, on one wallet.
            </p>
          </div>

          <FooterCol
            title="Platform"
            links={[
              { label: 'Services', href: '/services' },
              { label: 'Marketplace', href: '/marketplace' },
              { label: 'Academy', href: '/academy' },
              { label: 'Community', href: '/community' },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Focus Nexus Labs', href: '/labs' },
            ]}
          />
          <FooterCol
            title="Account"
            links={[
              { label: 'Log in', href: '/login' },
              { label: 'Register', href: '/register' },
              { label: 'Security', href: '/security' },
            ]}
          />
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 pt-6 border-t border-line text-[13px] text-muted">
          <span>© 2026 Focus Nexus. Built in Ghana.</span>
          <span className="font-mono">v1.1 — Sprint 1.1</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-[13.5px] uppercase tracking-wide text-muted mb-3.5">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="text-[14.5px] text-ink/85 hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
