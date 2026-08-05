import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AssistantCard({ categoryId, assistant }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/ai-lounge/${categoryId}/${assistant.id}`}
        className="group flex h-full flex-col rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(37,33,29,0.08)] transition duration-300 hover:border-brand/35 hover:shadow-[0_20px_54px_rgba(37,33,29,0.12)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-[#edf5ec] to-[#f8f7f2] text-3xl shadow-sm">
            {assistant.icon}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f6ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
            Chat
            <ArrowUpRight size={12} />
          </span>
        </div>

        <div className="mt-4">
          <h3 className="font-serif text-lg font-semibold text-ink">{assistant.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{assistant.description}</p>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f7fbf5] px-3 py-2 text-[11px] font-semibold text-muted">
          <span>Specialist mode</span>
          <span className="text-brand">AI ready</span>
        </div>
      </Link>
    </motion.div>
  )
}
