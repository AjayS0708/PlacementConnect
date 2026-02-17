import PlacementReadinessShell from '@/features/placement-readiness/components/PlacementReadinessShell'

export default function PlacementReadinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Feature-scoped shell keeps internal navigation consistent without duplicating global layout.
  return <PlacementReadinessShell>{children}</PlacementReadinessShell>
}
