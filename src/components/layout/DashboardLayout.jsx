import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet as WalletIcon,
  Wifi,
  ShoppingBag,
  GraduationCap,
  MessageCircle,
  Trophy,
  Users,
  Building2,
  ShieldCheck,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Logomark from '../common/Logomark'
import RoleBadge from '../ui/RoleBadge'
import { ROLES } from '../../utils/constants'

const BASE_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/wallet', label: 'Wallet', icon: WalletIcon },
  { to: '/services', label: 'Services', icon: Wifi },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/academy', label: 'Academy', icon: GraduationCap },
  { to: '/community', label: 'Community', icon: MessageCircle },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
]

const ROLE_LINKS = {
  [ROLES.AGENT]: [{ to: '/agent', label: 'Agent Portal', icon: Users }],
  [ROLES.SUB_AGENT]: [{ to: '/agent', label: 'Agent Portal', icon: Users }],
  [ROLES.BUSINESS]: [{ to: '/business', label: 'Business Portal', icon: Building2 }],
  [ROLES.SUPER_ADMIN]: [{ to: '/admin', label: 'Command Center', icon: ShieldCheck }],
  [ROLES.STAFF]: [{ to: '/admin', label: 'Command Center', icon: ShieldCheck }],
}

export default function DashboardLayout({ children }) {
  const { profile, role, signOut } = useAuth()
  const navigate = useNavigate()

  const extraLinks = ROLE_LINKS[role] || []

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-line px-5 py-6">
        <Link to="/" className="flex items-center gap-2.5 mb-8 px-1">
          <Logomark size={30} />
          <span className="font-display font-bold text-[17px] text-indigo">
            Focus<span className="text-gold">Nexus</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {BASE_LINKS.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
          {extraLinks.length > 0 && (
            <>
              <div className="h-px bg-line my-3" />
              {extraLinks.map((link) => (
                <SidebarLink key={link.to} {...link} />
              ))}
            </>
          )}
          <div className="h-px bg-line my-3" />
          <SidebarLink to="/dashboard/profile" label="Profile" icon={User} />
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium text-muted hover:bg-black/5 hover:text-rust transition-colors"
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-line bg-white/60">
          <div className="md:hidden flex items-center gap-2">
            <Logomark size={26} />
            <span className="font-display font-bold text-indigo">FocusNexus</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            {role && <RoleBadge role={role} />}
            <span className="text-sm font-medium text-indigo">
              {profile?.full_name || 'Loading…'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
          isActive
            ? 'bg-indigo text-white'
            : 'text-ink/75 hover:bg-black/5 hover:text-ink'
        }`
      }
    >
      <Icon size={17} />
      {label}
    </NavLink>
  )
}
