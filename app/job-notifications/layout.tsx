import JobSectionNav from '@/features/job-notification/components/JobSectionNav'

export default function JobNotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <JobSectionNav />
      {children}
    </div>
  )
}
