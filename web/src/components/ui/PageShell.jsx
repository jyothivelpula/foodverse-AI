import { motion } from 'framer-motion'

export default function PageShell({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`page-shell ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
