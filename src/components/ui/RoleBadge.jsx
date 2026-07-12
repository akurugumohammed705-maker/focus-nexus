import { ROLE_LABELS } from '../../utils/constants'

const ROLE_COLORS = {
  super_admin: { bg: 'rgba(217,85,58,0.14)', text: '#D9553A' },
  staff: { bg: 'rgba(217,85,58,0.14)', text: '#D9553A' },
  agent: { bg: 'rgba(232,163,61,0.18)', text: '#161B3D' },
  sub_agent: { bg: 'rgba(232,163,61,0.18)', text: '#161B3D' },
  vendor: { bg: 'rgba(232,163,61,0.18)', text: '#161B3D' },
  business: { bg: 'rgba(22,27,61,0.10)', text: '#161B3D' },
  customer: { bg: 'rgba(30,158,108,0.14)', text: '#1E9E6C' },
}

export default function RoleBadge({ role }) {
  const colors = ROLE_COLORS[role] || ROLE_COLORS.customer
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold font-mono"
      style={{ background: colors.bg, color: colors.text }}
    >
      {ROLE_LABELS[role] || 'Customer'}
    </span>
  )
}
