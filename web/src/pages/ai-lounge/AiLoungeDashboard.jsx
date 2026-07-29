import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { AI_LOUNGE_CATEGORIES } from '../../data/aiLounge'
import CategoryGrid from '../../components/ai-lounge/CategoryGrid'

export default function AiLoungeDashboard() {
  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-border bg-gradient-to-br from-white via-cream to-[#fff0e8] p-6 shadow-sm md:p-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
          <Sparkles size={12} />
          AI Lounge
        </div>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-4xl">
          What do you want to explore?
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Pick a category to meet specialist AI companions — movies, food, tech, and more.
        </p>
      </motion.header>

      <CategoryGrid categories={AI_LOUNGE_CATEGORIES} />
    </div>
  )
}
