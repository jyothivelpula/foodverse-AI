import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Clock, Sparkles, UtensilsCrossed } from 'lucide-react'
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
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          src={HERO_BG}
          alt="Premium restaurant dining atmosphere"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Soft blur + warm orange glow + dark gradient */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#FF5A1F]/25 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-[#FF5A1F]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-28 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12 md:px-8 md:pb-28 md:pt-32">
          <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <Sparkles size={12} className="text-[#FF5A1F]" />
              Smart Restaurant • AI Companions
            </span>

            <h1 className="mt-6 font-serif text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.02em] md:text-5xl lg:text-[3.75rem]">
              <span className="text-[#F3E6D8]">Great food.</span>
              <br />
              <span className="text-[#FF5A1F]">Better wait.</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] font-medium leading-relaxed text-white/75 md:text-base">
              Order in seconds, track your food live, and chat with AI companions while it&apos;s
              being cooked.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={menuPath}
                className="inline-flex items-center justify-center rounded-full bg-[#FF5A1F] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,90,31,0.35)] transition duration-200 hover:scale-105 hover:bg-[#e84e16]"
              >
                Explore Menu
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

            {/* Stats under CTAs */}
            <div className="mt-10 flex flex-wrap gap-6 md:gap-10">
              {[
                { icon: UtensilsCrossed, value: '120+', label: 'Dishes' },
                { icon: Sparkles, value: '10', label: 'AI Companions' },
                { icon: Clock, value: '20 min', label: 'Delivery' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-[#FF5A1F] backdrop-blur-md">
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

          {/* Glass live order card */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="md:justify-self-end"
          >
            <div className="w-full max-w-sm rounded-[24px] border border-white/40 bg-white/75 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-[#3B2314]">Live Order #421</h3>
                <span className="rounded-full bg-[#FF5A1F]/12 px-2.5 py-1 text-[11px] font-bold text-[#FF5A1F]">
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
                          ? 'bg-[#FF5A1F] text-white'
                          : 'border-2 border-[#D6D6D6] bg-transparent text-transparent'
                      }`}
                    >
                      {step.done && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span
                      className={
                        step.done ? 'font-semibold text-[#1A1A1A]' : 'font-medium text-[#5A5A5A]'
                      }
                    >
                      {step.label}
                      {step.done ? ' ✓' : ''}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-3 border-t border-[#E8E0D6] pt-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FFF1EA] text-xl">
                  👨‍🍳
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-[#FF5A1F]">
                    Chef AI is chatting
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-[#5A5A5A]">
                    “What do you want to cook today?”
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 -mt-8 px-5 pb-16 md:-mt-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Pick your food',
              desc: 'Browse chef-curated dishes with ratings, prep time, and dietary badges.',
            },
            {
              step: '02',
              title: 'Place your order',
              desc: 'Checkout in seconds and watch live preparation stages update in real time.',
            },
            {
              step: '03',
              title: 'Chat with AI',
              desc: 'Enter the AI Lounge and talk with companions while your meal cooks.',
            },
          ].map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="rounded-[24px] border border-[#EAEAEA] bg-white p-7 shadow-[0_12px_36px_rgba(26,26,26,0.06)] transition"
            >
              <div className="text-xs font-bold tracking-[0.16em] text-[#FF5A1F]">{card.step}</div>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-[#3B2314]">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5A5A5A]">{card.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <div className="mb-7">
          <h2 className="font-serif text-3xl font-semibold text-[#3B2314] md:text-4xl">
            Featured Today
          </h2>
          <p className="mt-1 text-sm text-[#5A5A5A]">Chef picks ready to order.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to={menuPath}
            className="inline-flex rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-6 py-3 text-sm font-semibold text-[#FF5A1F] transition hover:scale-105 hover:bg-[#FF5A1F] hover:text-white"
          >
            View full menu
          </Link>
        </div>
      </section>

      {/* ── Companions ── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="mb-7">
          <h2 className="font-serif text-3xl font-semibold text-[#3B2314] md:text-4xl">
            Meet Your AI Companions
          </h2>
          <p className="mt-1 text-sm text-[#5A5A5A]">Company while your order cooks.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companions.map((p) => (
            <motion.div
              key={p.key}
              whileHover={{ y: -8 }}
              className="rounded-[24px] border border-[#EAEAEA] bg-white p-6 text-center shadow-[0_12px_36px_rgba(26,26,26,0.06)]"
            >
              <div className="relative mx-auto mb-3 grid h-16 w-16 place-items-center rounded-[18px] border border-[#FF5A1F]/20 bg-[#FFF1EA] text-3xl">
                {p.emoji}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="font-serif text-lg font-semibold text-[#3B2314]">{p.characterName}</div>
              <div className="text-sm font-semibold text-[#FF5A1F]">{p.displayName}</div>
              <p className="mt-2 min-h-[2.8em] text-sm text-[#5A5A5A]">{p.tagline}</p>
              <Link
                to={loungePath}
                onClick={() => setPersona(p.key)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#FF5A1F]/25 bg-[#FF5A1F]/10 py-2.5 text-sm font-semibold text-[#FF5A1F] transition hover:scale-[1.02] hover:bg-[#FF5A1F] hover:text-white"
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
