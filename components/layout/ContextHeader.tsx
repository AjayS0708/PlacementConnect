interface ContextHeaderProps {
  headline: string
  subtext: string
}

export default function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="max-w-[1440px] mx-auto px-40 py-64">
        <h1 className="font-serif text-heading-lg text-primary mb-16">
          {headline}
        </h1>
        <p className="font-sans text-body-lg text-primary max-w-text">
          {subtext}
        </p>
      </div>
    </div>
  )
}
