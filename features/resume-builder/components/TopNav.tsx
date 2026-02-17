'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { label: 'Builder', href: '/resume-builder/builder' },
  { label: 'Preview', href: '/resume-builder/preview' },
  { label: 'Proof', href: '/resume-builder/proof' },
];

export default function TopNav() {
  const pathname = usePathname()

  return (
    <header className="top-nav-wrap">
      <Link className="brand" href="/resume-builder">
        AI Resume Builder
      </Link>
      <nav className="top-nav" aria-label="Primary">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx('nav-link', pathname === item.href && 'active')}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
