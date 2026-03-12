'use client'

import Link from 'next/link'

const PRODUCT_LINKS = [
  { label: 'Job Notifications', href: '/job-notifications' },
  { label: 'Placement Readiness', href: '/placement-readiness' },
  { label: 'Resume Builder', href: '/resume-builder' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Dashboard', href: '/dashboard' },
]

const RESOURCE_LINKS = [
  { label: 'Getting Started', href: '#' },
  { label: 'Campus Partnerships', href: '#' },
  { label: 'Student Guide', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

export default function LandingFooter() {
  return (
    <footer className="bg-[#0D1117] border-t border-[#1E2330]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">

        {/* 4-column grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              {/* PC monogram */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5820A]">
                <span className="font-display text-[13px] font-bold text-white leading-none">PC</span>
              </div>
              <span className="font-display text-[16px] font-bold text-white tracking-tight">PlacementConnect</span>
            </div>
            <p className="mb-6 text-[13px] text-[#4A5060] font-sans leading-relaxed max-w-[220px]">
              The unified placement platform built for Indian campus students.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2F3E] text-[#4A5060] transition-colors hover:border-[#F5820A] hover:text-[#F5820A]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.25 8.5h4.5V22H.25V8.5zm7.25 0h4.33v1.85h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22H16.8V15.8c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.27V22H7.5V8.5z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2F3E] text-[#4A5060] transition-colors hover:border-[#F5820A] hover:text-[#F5820A]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2F3E] text-[#4A5060] transition-colors hover:border-[#F5820A] hover:text-[#F5820A]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-[#4A5060] font-sans font-semibold">Product</p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-[#6B7280] font-sans transition-colors hover:text-[#E8EAF0]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-[#4A5060] font-sans font-semibold">Resources</p>
            <ul className="flex flex-col gap-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[14px] text-[#6B7280] font-sans transition-colors hover:text-[#E8EAF0]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / College CTA */}
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-[#4A5060] font-sans font-semibold">For Colleges</p>
            <p className="mb-4 text-[13px] text-[#4A5060] font-sans leading-relaxed">
              Bring PlacementConnect to your campus. Partner with us to give your students a real edge.
            </p>
            <a
              href="mailto:campus@placementconnect.in"
              className="inline-block rounded-lg border border-[#2A2F3E] px-4 py-2.5 text-[13px] font-medium text-[#8B929E] font-sans transition-colors hover:border-[#F5820A] hover:text-[#F5820A]"
            >
              Request a demo →
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-[#1E2330] pt-7 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-[12px] text-[#3A4050] font-sans">
            © 2026 Placement Connect · Built for students. Backed by results.
          </p>
          <p className="text-[12px] text-[#3A4050] font-sans">
            Made with ♥ in India
          </p>
        </div>
      </div>
    </footer>
  )
}
