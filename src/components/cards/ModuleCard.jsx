import { motion } from 'framer-motion'

export default function ModuleCard({ icon, iconBg, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="bg-white border border-line rounded-brand p-6 shadow-none hover:shadow-card"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <h3 className="font-display text-lg text-indigo mb-2">{title}</h3>
      <p className="text-[14.5px] text-muted m-0">{description}</p>
    </motion.div>
  )
}
