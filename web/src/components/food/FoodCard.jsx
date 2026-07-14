import { motion } from 'framer-motion'
import { Clock, Star, Plus } from 'lucide-react'
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
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong group overflow-hidden rounded-[24px]"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-orange shadow-sm backdrop-blur">
            {item.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {item.rating}
        </span>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="font-serif text-lg font-semibold text-ink">{item.name}</h3>
        <p className="mt-1 min-h-[2.6em] text-sm leading-relaxed text-muted">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold text-ink">₹{item.price}</span>
          <span className="flex items-center gap-1 rounded-full bg-cream-deep px-2.5 py-1 text-xs font-semibold text-muted">
            <Clock size={13} /> {item.prepMin} min
          </span>
        </div>
        <button
          type="button"
          onClick={() => addToCart(item)}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange to-[#ff7a45] py-2.5 text-sm font-bold text-white shadow-lg shadow-orange/25 transition hover:scale-[1.02] hover:brightness-105"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add to cart
        </button>
      </div>
    </motion.article>
  )
}
