import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/layout/AppShell'
import { ClientProviders } from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'Placement Connect',
  description: 'Unified placement readiness, job tracking, and resume builder dashboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  )
}
