import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getCategory } from '../../data/aiLounge'
import AssistantGrid from '../../components/ai-lounge/AssistantGrid'

export default function CategoryAssistants() {
  const { category: categoryId } = useParams()
  const category = getCategory(categoryId)

  if (!category) {
    return <Navigate to="/ai-lounge" replace />
  }

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8"
      >
        <Link
          to="/ai-lounge"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-orange"
        >
          <ArrowLeft size={14} />
          Back to AI Lounge
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-deep text-3xl">
            {category.icon}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink">{category.title}</h1>
            <p className="mt-1 text-sm text-muted">{category.description}</p>
          </div>
        </div>
      </motion.header>

      <AssistantGrid categoryId={category.id} assistants={category.assistants} />
    </div>
  )
}
