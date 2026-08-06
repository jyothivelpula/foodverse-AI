import { motion } from 'framer-motion'
import { Compass, Sparkles } from 'lucide-react'
import { AI_LOUNGE_CATEGORIES } from '../../data/aiLounge'
import CategoryGrid from '../../components/ai-lounge/CategoryGrid'

export default function AiLoungeDashboard() {
  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#fff8f1] via-white to-[#f4f5ec] p-6 shadow-[0_20px_54px_rgba(37,33,29,0.08)] md:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
              <Sparkles size={12} />
              Your AI Lounge
            </div>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-4xl">
              Choose your table companion.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Pick a category to meet specialist AI companions — movies, food, tech, and more.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
              <Compass size={13} />
              Made for the moment
            </div>
            <div className="mt-2 text-2xl font-bold text-ink">{AI_LOUNGE_CATEGORIES.length} categories</div>
            <div className="mt-1 text-sm text-muted">Curated guides, ready when you are.</div>
          </div>
        </div>
      </motion.header>

      <CategoryGrid categories={AI_LOUNGE_CATEGORIES} />
    </div>
  )
}
