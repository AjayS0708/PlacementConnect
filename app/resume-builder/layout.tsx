import ResumeBuilderShell from '@/features/resume-builder/components/ResumeBuilderShell'
import '@/features/resume-builder/styles/resume-builder.css'

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Feature layout keeps resume-builder styling scoped and reusable.
  return <ResumeBuilderShell>{children}</ResumeBuilderShell>
}
