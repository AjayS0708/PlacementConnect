import Link from 'next/link'

const stats = [
  { label: 'Target Roles', value: '18', meta: 'Active filters' },
  { label: 'Readiness Score', value: '82%', meta: 'Up 6% this month' },
  { label: 'Resume Iterations', value: '5', meta: 'Newest saved today' },
]

const quickLinks = [
  {
    title: 'Job Notifications',
    description: 'Daily matched roles, organized by priority and fit.',
    href: '/job-notifications',
  },
  {
    title: 'Placement Readiness',
    description: 'Track progress across prep tracks and resources.',
    href: '/placement-readiness',
  },
  {
    title: 'Resume Builder',
    description: 'Polish profiles with instant preview + export.',
    href: '/resume-builder',
  },
]

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-border/60 bg-white/80 p-8 shadow-[0_18px_40px_-28px_rgba(10,20,50,0.6)]">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/60">Dashboard overview</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
            Build momentum across every placement milestone.
          </h2>
          <p className="mt-4 text-sm text-primary/70 md:text-base">
            Placement Connect brings job discovery, readiness tracking, and resume crafting into one
            fluid workspace. Everything you need is now orchestrated in a single, focused view.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/job-notifications"
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_26px_-18px_rgba(16,24,40,0.6)] transition hover:-translate-y-0.5"
            >
              Review Jobs
            </Link>
            <Link
              href="/placement-readiness"
              className="rounded-full border border-border/70 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              Check Readiness
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-white/80 p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-primary">Weekly focus</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Week 3
            </span>
          </div>
          <ul className="mt-6 space-y-4 text-sm text-primary/70">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Complete two mock interviews and log feedback.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              Update resume with the latest project impact metrics.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
              Review 5 high-signal job alerts and shortlist top picks.
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-white/80 p-6 shadow-[0_10px_30px_-24px_rgba(10,20,50,0.6)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary/60">{stat.label}</p>
            <div className="mt-3 font-display text-3xl font-semibold text-primary">{stat.value}</div>
            <p className="mt-2 text-xs text-primary/60">{stat.meta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group rounded-2xl border border-border/60 bg-white/80 p-6 transition hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-primary">{link.title}</h3>
              <span className="text-lg text-primary/40 transition group-hover:text-primary">↗</span>
            </div>
            <p className="mt-3 text-sm text-primary/70">{link.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
