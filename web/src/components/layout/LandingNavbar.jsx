import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const cart = useStore((s) => s.cart)
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/5 bg-white/85 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF5A1F] text-lg text-white shadow-lg shadow-[#FF5A1F]/35">
            🍽
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold text-[#00a600]">
              FoodVerse
            </span>
            <span
              className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${
                scrolled ? 'text-[#5A5A5A]' : 'text-white/70'
              }`}
            >
              AI Kitchen
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/login"
            className={`text-sm font-semibold transition hover:text-[#FF5A1F] ${
              scrolled ? 'text-[#1A1A1A]' : 'text-white/90'
            }`}
          >
            Sign in
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/register"
            className={`hidden rounded-full px-4 py-2.5 text-sm font-semibold transition sm:inline-flex ${
              scrolled
                ? 'border border-border text-[#1A1A1A] hover:border-[#FF5A1F]/40'
                : 'border border-white/25 bg-white/10 text-white backdrop-blur-md'
            }`}
          >
            Join
          </Link>
          <Link
            to="/login"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:scale-105 ${
              scrolled
                ? 'bg-[#FF5A1F] text-white'
                : 'bg-white text-[#1A1A1A]'
            }`}
          >
            <ShoppingBag size={16} />
            Order
            {cartCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#1A1A1A] px-1.5 text-[11px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
