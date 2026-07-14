import { motion } from 'framer-motion'

/**
 * Premium glass card wrapper — keeps children/functionality intact.
 */
export default function GlassCard({
  children,
  className = '',
  strong = false,
  hover = true,
  delay = 0,
  ...rest
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`${strong ? 'glass-strong' : 'glass'} rounded-[24px] ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
