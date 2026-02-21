import { notFound } from 'next/navigation'
import RbStepPage from '@/features/resume-builder/pages/rb/RbStepPage'
import { RB_STEPS } from '@/features/resume-builder/config/rbSteps'

export default function ResumeBuilderStep() {
  const step = RB_STEPS.find((item) => item.route.endsWith('/04-hld'))

  if (!step) {
    notFound()
  }

  return <RbStepPage step={step} />
}
