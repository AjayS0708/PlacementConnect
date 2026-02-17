import RbStepPage from '@/features/resume-builder/pages/rb/RbStepPage'
import { RB_STEPS } from '@/features/resume-builder/config/rbSteps'

const step = RB_STEPS.find((item) => item.route.endsWith('/01-problem'))

if (!step) {
  throw new Error('RB step not found: 01-problem')
}

export default function ResumeBuilderStep() {
  return <RbStepPage step={step} />
}
