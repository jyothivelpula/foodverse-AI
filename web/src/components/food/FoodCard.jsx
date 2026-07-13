import { motion } from 'framer-motion'
import { Clock, Star } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function FoodCard({ item }) {
  const addToCart = useStore((s) => s.addToCart)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28 }}
      className="overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_10px_30px_rgba(30,30,30,0.06)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-48 w-full object-cover transition duration-500 hover:scale-105"
          loading="lazy"
        />
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-orange">
            {item.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-bold text-white">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {item.rating}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-ink">{item.name}</h3>
        <p className="mt-1 min-h-[2.6em] text-sm text-muted">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold">₹{item.price}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted">
            <Clock size={13} /> {item.prepMin} min
          </span>
        </div>
        <button
          type="button"
          onClick={() => addToCart(item)}
          className="mt-4 w-full rounded-full bg-orange py-2.5 text-sm font-bold text-white shadow-lg shadow-orange/25 transition hover:scale-[1.02] hover:bg-orange-hover"
        >
          Add +
        </button>
      </div>
    </motion.article>
  )
}
