import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logomark from '../common/Logomark'
import Button from '../ui/Button'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Academy', href: '/academy' },
  { label: 'Community', href: '/community' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-line">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logomark size={34} />
          <span className="font-display font-bold text-[19px] text-indigo">
            Focus<span className="text-gold">Nexus</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-7 text-[15px] font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-ink/80 hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3.5">
          <Button as={Link} to="/login" variant="ghost">
            Log in
          </Button>
          <Button as={Link} to="/register" variant="solid">
            Get started
          </Button>
        </div>

        <button
          className="md:hidden p-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-5 border-t border-line bg-bg">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Button as={Link} to="/login" variant="ghost" className="flex-1">
              Log in
            </Button>
            <Button as={Link} to="/register" variant="solid" className="flex-1">
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
