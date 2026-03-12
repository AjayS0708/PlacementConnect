'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1F2E] to-[#0D1117] py-20 lg:py-28">

      {/* Orange radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(245,130,10,0.15) 0%, transparent 70%)',
        }}
      />
      {/* Green accent glow — bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20"
        style={{
          width: 360,
          height: 360,
          background: 'radial-gradient(circle, rgba(18,183,106,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          {/* Eyebrow */}
          <p className="mb-5 text-[12px] uppercase tracking-[0.12em] text-[#F5820A] font-sans font-semibold">
            Start today — it&apos;s free
          </p>

          {/* Headline */}
          <h2
            className="mb-5 font-display font-bold text-white leading-tight tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            Your placement season<br />
            <span className="text-[#F5820A]">starts now.</span>
          </h2>

          {/* Subhead */}
          <p className="mb-10 text-[16px] text-[#8B929E] font-sans leading-relaxed">
            Set up in 60 seconds. No credit card. No fluff.<br />
            Just a smarter way to get placed.
          </p>

          {/* CTA group */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5820A] px-8 py-4 text-[15px] font-semibold text-white font-sans transition-all duration-200 hover:bg-[#E07308] hover:shadow-[0_0_28px_rgba(245,130,10,0.45)] active:scale-95"
            >
              Get Started Free
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#8B929E] font-sans transition-colors hover:text-white"
            >
              See what&apos;s included
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Link>
          </div>

          {/* Trust footnote */}
          <p className="mt-8 text-[13px] text-[#4A5060] font-sans">
            Trusted by 200+ colleges · NASSCOM EdTech Award 2025 · SOC 2 compliant
          </p>
        </motion.div>
      </div>
    </section>
  )
}
