import { motion } from 'framer-motion'

export default function ComingSoon({ title, description, sprint }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md text-center"
      >
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-indigo bg-gold/15 border border-gold/40 rounded-full px-3 py-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          {sprint}
        </span>
        <h1 className="font-display text-3xl font-bold text-indigo mb-3">{title}</h1>
        <p className="text-muted text-[15px]">{description}</p>
      </motion.div>
    </div>
  )
}
