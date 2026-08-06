import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar'
import FoodCard from '../components/food/FoodCard'
import { useStore } from '../store/useStore'
import { PERSONAS, LOUNGE_PREVIEW } from '../data/personas'

/** High-quality restaurant interior / dining atmosphere — object-cover, never stretched */
const HERO_BG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80'

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
}

export default function Home() {
  const menuItems = useStore((s) => s.menuItems)
  const setPersona = useStore((s) => s.setPersona)
  const token = useStore((s) => s.token)
  const user = useStore((s) => s.user)
  const featured = menuItems.filter((i) => i.featured).slice(0, 3)
  const companions = LOUNGE_PREVIEW.map((k) => PERSONAS.find((p) => p.key === k)).filter(Boolean)
  const menuPath = token && user?.role === 'customer' ? '/menu' : '/login'
  const loungePath = token && user?.role === 'customer' ? '/ai-lounge' : '/login'
  const dashPath = user?.role === 'chef' ? '/chef' : token ? '/home' : '/login'

  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,122,66,0.14),transparent_28%),linear-gradient(180deg,#0f0d0a_0%,#15110d_42%,#0d0b09_100%)] text-white">
      <LandingNavbar />

      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 18, -12, 0], y: [0, -20, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-10 top-12 h-56 w-56 rounded-full bg-[#b8955b]/20 blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, -22, 16, 0], y: [0, 20, -14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-8 h-72 w-72 rounded-full bg-[#f3d4bb]/12 blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.25, 0.5, 0.35, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,149,91,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]"
        />
        <img
          src={HERO_BG}
          alt="Premium restaurant dining atmosphere"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/35" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-28 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12 md:px-8 md:pb-28 md:pt-32">
          <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <Sparkles size={12} className="text-[#c9a86d]" />
              Smart Restaurant • AI Companions
            </span>

            <h1 className="mt-6 max-w-2xl font-serif text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.02em] md:text-5xl lg:text-[3.75rem]">
              <span className="text-[#f8f0e7]">Great food.</span>
              <br />
              <span className="text-[#d8b77d]">Better moments.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-white/78 md:text-base">
              From chef-picked dishes to live order tracking and friendly AI chat, FoodVerse
              turns everyday dining into a premium, seamless experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={menuPath}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a7834d] to-[#c9a86d] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(184,149,91,0.28)] transition duration-200 hover:brightness-110"
              >
                Explore Menu
                <ArrowRight size={16} />
              </Link>
              <Link
                to={dashPath}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white px-7 py-3.5 text-sm font-semibold text-[#1A1A1A] transition duration-200 hover:scale-105"
              >
                {token ? 'Go to dashboard' : 'Sign in'}
              </Link>
              <button
                type="button"
                onClick={scrollToHow}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-white/20"
              >
                How it works
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 md:gap-8">
              {[
                { icon: UtensilsCrossed, value: '120+', label: 'Dishes' },
                { icon: Sparkles, value: '10', label: 'AI Companions' },
                { icon: Clock, value: '20 min', label: 'Delivery' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-[#c9a86d] backdrop-blur-md">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="text-lg font-bold text-white">{value}</div>
                    <div className="text-xs font-medium text-white/65">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="md:justify-self-end"
          >
            <div className="w-full max-w-sm rounded-[24px] border border-[#c9a86d]/35 bg-[#2a2622]/75 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d8c7ae]">
                    live kitchen status
                  </div>
                  <h3 className="mt-1 font-serif text-[21px] font-semibold leading-none text-[#f8f0e7] md:text-[22px]">Order #421</h3>
                </div>
                <span className="rounded-full bg-[#4a4237] px-2.5 py-1 text-[11px] font-bold text-[#f5eadc]">
                  18 min
                </span>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  { label: 'Confirmed', done: true },
                  { label: 'Preparing', done: true },
                  { label: 'Cooking', done: true },
                  { label: 'Out for Delivery', done: false },
                ].map((step) => (
                  <li key={step.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full ${
                        step.done
                          ? 'bg-[#030101] text-white'
                          : 'border-2 border-[#D6D6D6] bg-transparent text-transparent'
                      }`}
                    >
                      {step.done && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span
                      className={
                        step.done ? 'font-semibold text-[#f5eadc]' : 'font-medium text-[#9d9388]'
                      }
                    >
                      {step.label}
                      {step.done ? ' ✓' : ''}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-[20px] bg-[#f8f0e7] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-xl shadow-sm">
                    👨‍🍳
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#40362c]">
                      Chef AI is chatting
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-[#6a5e52]">
                      “What do you want to cook today?”
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#36312c] px-3 py-2 text-[11px] font-semibold text-[#cbbda9]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#5CA47B]" />
                  Verified kitchen flow
                </span>
                <span className="text-[#f0e4d6]">Premium service</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 -mt-8 px-5 pb-16 md:-mt-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Pick your food',
              desc: 'Browse a premium selection of chef-curated dishes with live ratings and prep cues.',
              icon: UtensilsCrossed,
            },
            {
              step: '02',
              title: 'Place your order',
              desc: 'Order in seconds and track every stage from confirmation to delivery.',
              icon: Zap,
            },
            {
              step: '03',
              title: 'Chat with AI',
              desc: 'Switch into the AI Lounge and keep your company entertained while your meal cooks.',
              icon: Sparkles,
            },
          ].map((card, i) => {
            const Icon = card.icon
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,24,18,0.9),rgba(19,15,11,0.95))] p-7 shadow-[0_14px_44px_rgba(0,0,0,0.35)] transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold tracking-[0.16em] text-[#c9a86d]">{card.step}</div>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#2b2017] text-[#c9a86d]">
                    <Icon size={18} />
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-[#f6eadc]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#bbaea0]">{card.desc}</p>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(29,23,18,0.88),rgba(17,14,11,0.98))] px-5 py-8 md:px-8 md:py-10">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#f6eadc] md:text-4xl">
              Featured Today
            </h2>
            <p className="mt-1 text-sm text-[#bbaea0]">Chef picks ready to order.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2b2017] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c9a86d]">
            <Star size={12} className="fill-current" />
            top-rated signatures
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to={menuPath}
            className="inline-flex items-center gap-2 rounded-full border border-[#c9a86d]/30 bg-[#c9a86d]/10 px-6 py-3 text-sm font-semibold text-[#c9a86d] transition hover:scale-105 hover:bg-[#b8955b] hover:text-white"
          >
            View full menu
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="mb-7">
          <h2 className="font-serif text-3xl font-semibold text-[#f6eadc] md:text-4xl">
            Meet Your AI Companions
          </h2>
          <p className="mt-1 text-sm text-[#bbaea0]">Company while your order cooks.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companions.map((p) => (
            <motion.div
              key={p.key}
              whileHover={{ y: -8 }}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,24,18,0.9),rgba(19,15,11,1))] p-6 text-center shadow-[0_14px_44px_rgba(0,0,0,0.35)]"
            >
              <div className="relative mx-auto mb-3 grid h-16 w-16 place-items-center rounded-[18px] border border-[#c9a86d]/20 bg-[#f8f1e5] text-3xl shadow-sm">
                {p.emoji}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="font-serif text-lg font-semibold text-[#f6eadc]">{p.characterName}</div>
              <div className="text-sm font-semibold text-[#c9a86d]">{p.displayName}</div>
              <p className="mt-2 min-h-[2.8em] text-sm text-[#bbaea0]">{p.tagline}</p>
              <Link
                to={loungePath}
                onClick={() => setPersona(p.key)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#a7834d] to-[#c9a86d] py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(184,149,91,0.22)] transition hover:brightness-110"
              >
                Chat
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
