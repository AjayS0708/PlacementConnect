'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Features',    href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Results',     href: '#stats' },
  { label: 'Students',    href: '#testimonials' },
]

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#1A1F2E]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(42,47,62,0.8)]'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5820A] text-white font-bold font-display text-sm leading-none select-none transition-transform group-hover:scale-105">
              PC
            </div>
            <span className="font-display font-bold text-white text-[15px] tracking-tight">
              Placement<span className="text-[#F5820A]">Connect</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────────── */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm font-medium text-[#8B929E] transition-colors hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTAs ──────────────────────────────────────────────── */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-[#8B929E] transition-colors hover:text-white px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#F5820A] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#dc6c08] hover:shadow-[0_0_16px_rgba(245,130,10,0.4)] active:scale-95"
            >
              Get Started Free
            </Link>
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8B929E] hover:text-white transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu Drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-[64px] z-40 bg-[#1A1F2E]/98 backdrop-blur-xl border-b border-[#2A2F3E] px-6 pb-6 pt-4 md:hidden"
          >
            <ul className="flex flex-col gap-1 mb-5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-[#B0B8CC] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 border-t border-[#2A2F3E] pt-4">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg border border-[#2A2F3E] px-5 py-3 text-center text-sm font-semibold text-[#B0B8CC] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-[#F5820A] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#dc6c08] transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
