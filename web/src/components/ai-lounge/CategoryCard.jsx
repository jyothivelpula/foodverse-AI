import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  Clapperboard,
  Code2,
  Gamepad2,
  HeartHandshake,
  Laugh,
  Leaf,
  Music2,
  Plane,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  const iconMap = {
    movies: Clapperboard,
    food: UtensilsCrossed,
    singers: Music2,
    comedy: Laugh,
    technology: Code2,
    books: BookOpen,
    sports: Trophy,
    gaming: Gamepad2,
    travel: Plane,
    relationship: HeartHandshake,
    health: Leaf,
  }
  const Icon = iconMap[category.id] || Sparkles

  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/ai-lounge/${category.id}`}
        className="group flex min-h-[248px] h-full flex-col rounded-[24px] border border-[#e9e0d4] bg-[#fffdf9] p-5 shadow-[0_14px_36px_rgba(37,33,29,0.07)] transition duration-300 hover:border-[#c9a86d]/60 hover:shadow-[0_20px_48px_rgba(80,61,36,0.13)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e6d6bd] bg-[#f7efe3] text-[#94733f] shadow-sm">
            <Icon size={21} strokeWidth={1.8} />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f4efe6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#766f55]">
            Discover
            <ArrowUpRight size={12} />
          </span>
        </div>

        <div className="mt-5">
          <h3 className="font-serif text-[1.55rem] font-semibold leading-none text-[#2d2822]">{category.title}</h3>
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#7a7268]">{category.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between rounded-2xl border border-[#eee5d9] bg-[#faf7f1] px-3 py-2.5 text-[11px] font-semibold text-[#746d64]">
          <span>{category.assistants.length} AI guides</span>
          <span className="text-[#a27e45]">Available now</span>
        </div>
      </Link>
    </motion.div>
  )
}
