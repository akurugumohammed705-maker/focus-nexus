import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Users, Copy, TrendingUp } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import Button from '../../components/ui/Button'
import ComingSoon from '../common/ComingSoon'
import { ROLES } from '../../utils/constants'
import {
  getMyAgent,
  activateAgent,
  getSubAgentsForAgent,
  getMySubAgentRecord,
  joinAgentByCode,
  getCommissions,
} from '../../services/agentService'

export default function AgentPortal() {
  const { user, role } = useAuth()

  if (role === ROLES.AGENT) return <AgentView userId={user.id} />
  if (role === ROLES.SUB_AGENT) return <SubAgentView userId={user.id} />

  return (
    <ComingSoon
      title="Agent Portal"
      description="This area is for Agents and Sub-Agents. If you believe you should have access, reach out to an admin about your role."
      sprint="Sprint 4"
    />
  )
}

// ---------- AGENT ----------

function AgentView({ userId }) {
  const [agent, setAgent] = useState(null)
  const [subAgents, setSubAgents] = useState([])
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const a = await getMyAgent(userId)
      setAgent(a)
      if (a) {
        const [subs, comms] = await Promise.all([
          getSubAgentsForAgent(a.id),
          getCommissions(userId),
        ])
        setSubAgents(subs)
        setCommissions(comms)
      }
    } catch (err) {
      toast.error('Could not load agent data')
      console.warn(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const handleActivate = async () => {
    setActivating(true)
    try {
      await activateAgent(userId)
      toast.success('Agent account activated!')
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActivating(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(agent.agent_code)
    toast.success('Code copied — share it with your sub-agents')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted text-sm">Loading…</p>
      </DashboardLayout>
    )
  }

  if (!agent) {
    return (
      <DashboardLayout>
        <div className="max-w-md">
          <h1 className="font-display text-2xl font-bold text-indigo mb-2">Agent Portal</h1>
          <p className="text-muted text-sm mb-6">
            Activate your agent account to get your unique code, manage sub-agents, and
            track commissions.
          </p>
          <Button variant="gold" onClick={handleActivate} disabled={activating}>
            {activating ? 'Activating…' : 'Activate my Agent account'}
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const totalEarned = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0)
  const pending = commissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-indigo mb-1">Agent Portal</h1>
      <p className="text-muted text-sm mb-7">Manage your sub-agents and track commissions.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-line rounded-brand p-5">
          <p className="text-[13px] text-muted mb-1.5">Your agent code</p>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-indigo">{agent.agent_code}</span>
            <button onClick={copyCode} className="text-muted hover:text-indigo">
              <Copy size={15} />
            </button>
          </div>
          <p className="text-[12px] text-muted mt-1">Share this so sub-agents can join you</p>
        </div>
        <StatCard label="Commission rate" value={`${agent.commission_rate}%`} accent="#E8A33D" />
        <StatCard label="Commissions earned" value={`GHS ${totalEarned.toFixed(2)}`} hint={pending > 0 ? `GHS ${pending.toFixed(2)} pending` : null} accent="#1E9E6C" />
      </div>

      <h2 className="font-display text-lg font-semibold text-indigo mb-3 flex items-center gap-2">
        <Users size={18} /> Sub-agents ({subAgents.length})
      </h2>
      <div className="bg-white border border-line rounded-brand overflow-hidden mb-8">
        {subAgents.length === 0 ? (
          <p className="p-5 text-sm text-muted">
            No sub-agents yet — share your code above with people you want in your downline.
          </p>
        ) : (
          <ul>
            {subAgents.map((sa) => (
              <li
                key={sa.id}
                className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-0"
              >
                <div>
                  <p className="text-[14px] font-medium text-indigo">
                    {sa.profiles?.full_name || 'Unnamed'}
                  </p>
                  <p className="text-[12px] text-muted">{sa.profiles?.phone || '—'}</p>
                </div>
                <span className="font-mono text-[13px] text-muted">
                  {sa.commission_rate}% rate
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CommissionHistory commissions={commissions} />
    </DashboardLayout>
  )
}

// ---------- SUB-AGENT ----------

function SubAgentView({ userId }) {
  const [record, setRecord] = useState(null)
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await getMySubAgentRecord(userId)
      setRecord(r)
      if (r) {
        const comms = await getCommissions(userId)
        setCommissions(comms)
      }
    } catch (err) {
      toast.error('Could not load your account')
      console.warn(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setJoining(true)
    try {
      await joinAgentByCode(userId, code)
      toast.success('Joined successfully!')
      setCode('')
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted text-sm">Loading…</p>
      </DashboardLayout>
    )
  }

  if (!record) {
    return (
      <DashboardLayout>
        <div className="max-w-md">
          <h1 className="font-display text-2xl font-bold text-indigo mb-2">Join an Agent</h1>
          <p className="text-muted text-sm mb-6">
            Enter the agent code you were given to join their network and start earning
            commissions.
          </p>
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="AGT-XXXXXX"
              className="flex-1 border border-line rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <Button type="submit" variant="solid" disabled={joining}>
              {joining ? 'Joining…' : 'Join'}
            </Button>
          </form>
        </div>
      </DashboardLayout>
    )
  }

  const totalEarned = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-indigo mb-1">My Agent Network</h1>
      <p className="text-muted text-sm mb-7">
        You're part of {record.agents?.profiles?.full_name || 'your agent'}'s network.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard label="Your commission rate" value={`${record.commission_rate}%`} accent="#E8A33D" />
        <StatCard label="Commissions earned" value={`GHS ${totalEarned.toFixed(2)}`} accent="#1E9E6C" />
      </div>

      <CommissionHistory commissions={commissions} />
    </DashboardLayout>
  )
}

// ---------- shared ----------

function CommissionHistory({ commissions }) {
  return (
    <>
      <h2 className="font-display text-lg font-semibold text-indigo mb-3 flex items-center gap-2">
        <TrendingUp size={18} /> Commission history
      </h2>
      <div className="bg-white border border-line rounded-brand overflow-hidden">
        {commissions.length === 0 ? (
          <p className="p-5 text-sm text-muted">
            No commissions yet — these appear automatically once orders start flowing
            through the Services module (Sprint 5).
          </p>
        ) : (
          <ul>
            {commissions.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-0"
              >
                <div>
                  <p className="text-[14px] font-medium text-indigo capitalize">{c.status}</p>
                  <p className="text-[12px] text-muted">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="font-mono text-[14px] font-semibold text-green">
                  +GHS {Number(c.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
