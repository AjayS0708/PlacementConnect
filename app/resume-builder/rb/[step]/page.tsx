import { notFound } from 'next/navigation'
import RbStepPage from '@/features/resume-builder/pages/rb/RbStepPage'
import { RB_STEPS } from '@/features/resume-builder/config/rbSteps'

type ResumeBuilderStepRouteProps = {
  params: {
    step: string
  }
}

export function generateStaticParams() {
  return RB_STEPS.map((item) => ({
    step: item.route.split('/').pop()!,
  }))
}

export default function ResumeBuilderStepRoute({ params }: ResumeBuilderStepRouteProps) {
  const step = RB_STEPS.find((item) => item.route.endsWith(`/${params.step}`))

  if (!step) {
    notFound()
  }

  return <RbStepPage step={step} />
}
