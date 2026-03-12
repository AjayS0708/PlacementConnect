'use client'

import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    name: 'Priya Subramaniam',
    college: 'BITS Pilani',
    role: 'Placed at Google — SWE',
    avatar: 'PS',
    avatarBg: 'bg-blue-500',
    quote: 'Before PlacementConnect, I was tracking 12 companies in a spreadsheet, missing half the deadlines. After two weeks on the platform I had my readiness score from 54% to 82%. The JD matching feature alone probably saved me 6 hours of prep every week.',
    size: 'large',
    stat: { value: '54→82%', label: 'Readiness in 2 weeks' },
  },
  {
    name: 'Rohan Krishnamurthy',
    college: 'NIT Trichy',
    role: 'Placed at Zepto — Product',
    avatar: 'RK',
    avatarBg: 'bg-emerald-500',
    quote: 'The resume builder is genuinely the best I\'ve used for freshers. It tells you exactly which keywords you\'re missing for a specific JD. I went from no callbacks to 4 interview calls in one week.',
    size: 'small',
    stat: null,
  },
  {
    name: 'Lakshmi Tamilarasan',
    college: 'VIT Vellore',
    role: 'Placed at Razorpay — Backend',
    avatar: 'LT',
    avatarBg: 'bg-[#F5820A]',
    quote: 'The combined dashboard is everything. I can see my placement health score alongside my job pipeline and resume completion — all in one place. My placement officer recommended it to our entire final year batch.',
    size: 'medium',
    stat: { value: '4 offers', label: 'In first placement season' },
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#F4F5F7] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-3 text-[12px] uppercase tracking-[0.1em] text-[#F5820A] font-sans font-semibold">Student stories</p>
            <h2 className="font-display font-bold text-[#1A1F2E] leading-tight tracking-tight"
              style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
              From campus to career.<br />They made it.
            </h2>
          </div>
          <p className="max-w-xs text-[14px] text-[#6B7280] font-sans sm:text-right">
            Real students. Real results. No sponsored testimonials.
          </p>
        </motion.div>

        {/* Asymmetric card grid */}
        {/* Desktop: large card left (col-span-2), small + medium stacked right */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">

          {/* Large card — spans 2 rows on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between rounded-2xl border border-[#E2E4EA] bg-white p-7 lg:row-span-2"
          >
            {/* Quote mark */}
            <div>
              <svg className="mb-5 h-8 w-8 text-[#F5820A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-[16px] leading-relaxed text-[#1A1F2E] font-sans mb-6">
                "{TESTIMONIALS[0].quote}"
              </p>
            </div>

            {/* Stat chip */}
            {TESTIMONIALS[0].stat && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-[#F5820A]/8 border border-[#F5820A]/20 px-4 py-3">
                <span className="font-display text-[20px] font-bold text-[#F5820A]">{TESTIMONIALS[0].stat.value}</span>
                <span className="text-[12px] text-[#6B7280] font-sans">{TESTIMONIALS[0].stat.label}</span>
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 border-t border-[#E2E4EA] pt-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TESTIMONIALS[0].avatarBg} font-display text-[13px] font-bold text-white`}>
                {TESTIMONIALS[0].avatar}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1A1F2E] font-sans">{TESTIMONIALS[0].name}</p>
                <p className="text-[12px] text-[#6B7280] font-sans">{TESTIMONIALS[0].college} · <span className="text-[#12B76A] font-medium">{TESTIMONIALS[0].role}</span></p>
              </div>
            </div>
          </motion.div>

          {/* Small card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-[#E2E4EA] bg-[#1A1F2E] p-6 lg:col-start-2"
          >
            <p className="text-[14px] leading-relaxed text-[#B0B8CC] font-sans mb-5">
              "{TESTIMONIALS[1].quote}"
            </p>
            <div className="flex items-center gap-3 border-t border-[#2A2F3E] pt-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TESTIMONIALS[1].avatarBg} font-display text-[12px] font-bold text-white`}>
                {TESTIMONIALS[1].avatar}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#E8EAF0] font-sans">{TESTIMONIALS[1].name}</p>
                <p className="text-[11px] text-[#8B929E] font-sans">{TESTIMONIALS[1].college} · <span className="text-[#12B76A] font-medium">{TESTIMONIALS[1].role}</span></p>
              </div>
            </div>
          </motion.div>

          {/* Medium card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between rounded-2xl border border-[#E2E4EA] bg-white p-6 lg:col-start-3 lg:row-span-2"
          >
            <div>
              <svg className="mb-4 h-7 w-7 text-[#12B76A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-[15px] leading-relaxed text-[#1A1F2E] font-sans mb-5">
                "{TESTIMONIALS[2].quote}"
              </p>
            </div>

            {TESTIMONIALS[2].stat && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-xl bg-[#12B76A]/8 border border-[#12B76A]/20 px-4 py-3">
                <span className="font-display text-[18px] font-bold text-[#12B76A]">{TESTIMONIALS[2].stat.value}</span>
                <span className="text-[12px] text-[#6B7280] font-sans">{TESTIMONIALS[2].stat.label}</span>
              </div>
            )}

            <div className="flex items-center gap-3 border-t border-[#E2E4EA] pt-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TESTIMONIALS[2].avatarBg} font-display text-[12px] font-bold text-white`}>
                {TESTIMONIALS[2].avatar}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1A1F2E] font-sans">{TESTIMONIALS[2].name}</p>
                <p className="text-[11px] text-[#6B7280] font-sans">{TESTIMONIALS[2].college} · <span className="text-[#12B76A] font-medium">{TESTIMONIALS[2].role}</span></p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
