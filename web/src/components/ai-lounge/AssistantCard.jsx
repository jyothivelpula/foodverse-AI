import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AssistantCard({ categoryId, assistant }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/ai-lounge/${categoryId}/${assistant.id}`}
        className="group flex h-full flex-col rounded-[22px] border border-border bg-white p-5 shadow-[0_10px_30px_rgba(22,20,17,0.06)] transition hover:border-[#5CA47B]/35 hover:shadow-[0_16px_40px_rgba(92,164,123,0.14)]"
      >
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#5CA47B]/10 text-2xl transition group-hover:bg-[#5CA47B]/18">
          {assistant.icon}
        </div>
        <h3 className="font-serif text-lg font-semibold text-ink">{assistant.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{assistant.description}</p>
        <span className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#5CA47B] opacity-0 transition group-hover:opacity-100">
          Chat →
        </span>
      </Link>
    </motion.div>
  )
}
