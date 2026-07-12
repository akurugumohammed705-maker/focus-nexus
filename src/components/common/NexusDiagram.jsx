import { useState } from 'react'
import { motion } from 'framer-motion'

const NODES = [
  { key: 'wallet', x: 150, y: 42, label: 'Wallet', caption: 'Wallet — fund, spend, refund in one place' },
  { key: 'services', x: 243, y: 96, label: 'Services', caption: 'Services — data, airtime, electricity, results' },
  { key: 'marketplace', x: 243, y: 204, label: 'Market', caption: 'Marketplace — vendors selling real products' },
  { key: 'academy', x: 150, y: 258, label: 'Academy', caption: 'Academy — courses, quizzes, certificates' },
  { key: 'community', x: 57, y: 204, label: 'Community', caption: 'Community — discussions, groups, announcements' },
  { key: 'challenges', x: 57, y: 96, label: 'Challenges', caption: 'Challenges — weekly, monthly, annual rewards' },
]

export default function NexusDiagram() {
  const [active, setActive] = useState(null)
  const activeNode = NODES.find((n) => n.key === active)

  return (
    <div className="relative aspect-square max-w-[460px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
        <g strokeWidth="2" fill="none">
          {NODES.map((n, i) => (
            <motion.line
              key={n.key}
              x1="150"
              y1="150"
              x2={n.x}
              y2={n.y}
              stroke={active === n.key ? '#E8A33D' : 'rgba(18,22,42,0.12)'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            />
          ))}
        </g>

        {NODES.map((n, i) => (
          <motion.g
            key={n.key}
            className="cursor-pointer"
            onMouseEnter={() => setActive(n.key)}
            onMouseLeave={() => setActive(null)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r="30"
              fill={active === n.key ? '#F4C065' : '#fff'}
              stroke={active === n.key ? '#E8A33D' : 'rgba(18,22,42,0.12)'}
              strokeWidth="2"
            />
            <text
              x={n.x}
              y={n.y + 5}
              fontFamily="'JetBrains Mono'"
              fontSize="11"
              fill="#161B3D"
              textAnchor="middle"
            >
              {n.label}
            </text>
          </motion.g>
        ))}

        <circle cx="150" cy="150" r="34" fill="#161B3D" />
        <text
          x="150"
          y="156"
          fontFamily="'Space Grotesk'"
          fontWeight="700"
          fontSize="15"
          fill="#fff"
          textAnchor="middle"
        >
          NEXUS
        </text>
      </svg>

      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-white border border-line rounded-xl px-4 py-2 text-[13px] font-semibold text-indigo shadow-card whitespace-nowrap">
        {activeNode ? activeNode.caption : 'Hover a node — everything connects back to one wallet'}
      </div>
    </div>
  )
}
