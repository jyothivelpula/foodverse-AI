import { motion } from 'framer-motion'
import AssistantCard from './AssistantCard'

export default function AssistantGrid({ categoryId, assistants }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04 } },
      }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {assistants.map((assistant) => (
        <motion.div
          key={assistant.id}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <AssistantCard categoryId={categoryId} assistant={assistant} />
        </motion.div>
      ))}
    </motion.div>
  )
}
