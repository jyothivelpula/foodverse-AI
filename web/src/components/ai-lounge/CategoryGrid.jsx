import { motion } from 'framer-motion'
import CategoryCard from './CategoryCard'

export default function CategoryGrid({ categories }) {
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
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <CategoryCard category={category} />
        </motion.div>
      ))}
    </motion.div>
  )
}
