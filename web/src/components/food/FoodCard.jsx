import { motion } from 'framer-motion'
import { Clock, Flame, Plus, Star } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function FoodCard({ item, compact = false }) {
  const addToCart = useStore((s) => s.addToCart)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[26px] border border-white/10 bg-black/35 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`${compact ? 'h-44' : 'h-52'} w-full object-cover object-center transition duration-700 group-hover:scale-105`}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {item.badge && (
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-orange shadow-sm backdrop-blur">
              {item.badge}
            </span>
          )}
          {item.featured && (
            <span className="rounded-full bg-[#1d1d1d]/78 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              Chef pick
            </span>
          )}
        </div>

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {item.rating}
        </span>
      </div>

      <div className={compact ? 'space-y-2 p-4' : 'space-y-3 p-4 md:p-5'}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{item.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/70">{item.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[1.1rem] font-extrabold text-white">₹{item.price}</span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-orange">
              Signature
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white/70">
            <Clock size={13} /> {item.prepMin} min
          </span>
        </div>

        <button
          type="button"
          onClick={() => addToCart(item)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange to-[#c9a86d] py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(184,149,91,0.25)] transition hover:scale-[1.01] hover:brightness-105"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add to cart
        </button>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/70">
          <span className="flex items-center gap-1">
            <Flame size={12} className="text-orange" />
            Freshly prepared
          </span>
          <span>{item.featured ? 'Most loved' : 'Popular'}</span>
        </div>
      </div>
    </motion.article>
  )
}
