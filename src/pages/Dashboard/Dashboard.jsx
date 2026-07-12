import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wifi, ShoppingBag, GraduationCap, Users, ShieldCheck, Building2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import { getWallet } from '../../services/walletService'
import { ROLES } from '../../utils/constants'

export default function Dashboard() {
  const { user, profile, role } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [walletLoading, setWalletLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    getWallet(user.id)
      .then(setWallet)
      .catch((err) => console.warn('[Focus Nexus] Could not load wallet:', err.message))
      .finally(() => setWalletLoading(false))
  }, [user?.id])

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-indigo mb-1">
        Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
      </h1>
      <p className="text-muted text-sm mb-7">Here's what's happening on your account.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Wallet balance"
          value={
            walletLoading
              ? '…'
              : wallet
              ? `${wallet.currency} ${Number(wallet.balance).toFixed(2)}`
              : '—'
          }
          hint="Updates instantly after every transaction"
          accent="#1E9E6C"
        />
        <StatCard label="Open orders" value="0" hint="Services module lands in Sprint 5" />
        <StatCard label="Notifications" value="0" hint="Unread" />
      </div>

      <h2 className="font-display text-lg font-semibold text-indigo mb-3">Quick actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <QuickAction to="/services" icon={Wifi} label="Buy data or airtime" />
        <QuickAction to="/marketplace" icon={ShoppingBag} label="Browse marketplace" />
        <QuickAction to="/academy" icon={GraduationCap} label="Continue learning" />
      </div>

      {/* Role-specific section */}
      {(role === ROLES.AGENT || role === ROLES.SUB_AGENT) && (
        <RolePanel
          icon={Users}
          title="Agent tools"
          description="Manage your sub-agents and track commissions."
          to="/agent"
          cta="Open Agent Portal"
        />
      )}
      {role === ROLES.BUSINESS && (
        <RolePanel
          icon={Building2}
          title="Business tools"
          description="Manage your team and make bulk purchases."
          to="/business"
          cta="Open Business Portal"
        />
      )}
      {(role === ROLES.SUPER_ADMIN || role === ROLES.STAFF) && (
        <RolePanel
          icon={ShieldCheck}
          title="Admin tools"
          description="Revenue, active agents, system alerts — your control room."
          to="/admin"
          cta="Open Command Center"
        />
      )}
    </DashboardLayout>
  )
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 bg-white border border-line rounded-brand p-4 hover:shadow-card transition-shadow"
    >
      <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-indigo">
        <Icon size={18} />
      </div>
      <span className="text-[14.5px] font-medium text-indigo">{label}</span>
    </Link>
  )
}

function RolePanel({ icon: Icon, title, description, to, cta }) {
  return (
    <div className="bg-indigo rounded-brand p-6 text-white flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-base">{title}</h3>
          <p className="text-white/70 text-[13.5px]">{description}</p>
        </div>
      </div>
      <Link
        to={to}
        className="bg-gold text-indigo font-semibold text-[14px] px-4 py-2 rounded-xl whitespace-nowrap"
      >
        {cta}
      </Link>
    </div>
  )
}
