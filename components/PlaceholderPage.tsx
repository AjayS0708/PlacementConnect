interface PlaceholderPageProps {
  title: string
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-16">
        <h1 className="font-serif text-heading-xl text-primary">
          {title}
        </h1>
        <p className="font-sans text-body-lg text-[#666666]">
          This section will be built in the next step.
        </p>
      </div>
    </div>
  )
}
