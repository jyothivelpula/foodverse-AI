import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CategoryCard({ category }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/ai-lounge/${category.id}`}
        className="group flex h-full flex-col rounded-[22px] border border-border bg-white p-5 shadow-[0_10px_30px_rgba(22,20,17,0.06)] transition hover:border-orange/30 hover:shadow-[0_16px_40px_rgba(255,90,31,0.12)]"
      >
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cream-deep text-2xl transition group-hover:bg-orange/10">
          {category.icon}
        </div>
        <h3 className="font-serif text-xl font-semibold text-ink">{category.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{category.description}</p>
        <span className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-orange opacity-0 transition group-hover:opacity-100">
          Explore →
        </span>
      </Link>
    </motion.div>
  )
}
