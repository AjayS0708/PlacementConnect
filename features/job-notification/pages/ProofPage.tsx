import Card from '@/components/Card'

export default function ProofPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-40">
      <div className="space-y-16">
        <h1 className="font-serif text-heading-lg text-primary">
          Proof of Work
        </h1>
        <p className="font-sans text-body-base text-[#666666]">
          Artifact collection and development evidence.
        </p>
      </div>

      <Card padding="lg">
        <div className="space-y-40">
          <div className="space-y-16">
            <h3 className="font-serif text-heading-sm text-primary">
              Development Artifacts
            </h3>
            <p className="font-sans text-body-base text-[#666666]">
              Screenshots, recordings, and evidence of implementation will be collected here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="border-2 border-dashed border-border p-40 text-center">
              <div className="space-y-8">
                <div className="w-40 h-40 mx-auto border-2 border-border flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#999999]"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <p className="font-sans text-sm text-[#666666]">
                  Screenshots placeholder
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-border p-40 text-center">
              <div className="space-y-8">
                <div className="w-40 h-40 mx-auto border-2 border-border flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#999999]"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="2" />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" />
                  </svg>
                </div>
                <p className="font-sans text-sm text-[#666666]">
                  Recordings placeholder
                </p>
              </div>
            </div>
          </div>

          <div className="pt-24 border-t border-border">
            <p className="font-sans text-sm text-[#666666] text-center">
              This section will be populated as development progresses.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
