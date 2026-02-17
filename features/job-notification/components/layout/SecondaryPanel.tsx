'use client'

import { useState } from 'react'
import Card from '../Card'
import Button from '../Button'
import Textarea from '../Textarea'

interface SecondaryPanelProps {
  stepTitle: string
  stepExplanation: string
  promptText: string
}

export default function SecondaryPanel({ 
  stepTitle, 
  stepExplanation, 
  promptText 
}: SecondaryPanelProps) {
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-[400px] flex-shrink-0">
      <div className="sticky top-24">
        <Card padding="lg" className="space-y-24">
          <div>
            <h3 className="font-serif text-heading-sm text-primary mb-8">
              {stepTitle}
            </h3>
            <p className="font-sans text-body-base text-primary">
              {stepExplanation}
            </p>
          </div>

          <div className="space-y-16">
            <label className="font-sans font-medium text-primary block">
              Prompt
            </label>
            <div className="relative">
              <Textarea
                value={promptText}
                readOnly
                className="font-mono text-sm"
                rows={6}
                fullWidth
              />
            </div>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Prompt'}
            </Button>
          </div>

          <div className="space-y-8">
            <Button variant="primary" fullWidth>
              Build in Lovable
            </Button>
            <Button variant="secondary" fullWidth>
              It Worked ✓
            </Button>
            <Button variant="secondary" fullWidth>
              Error
            </Button>
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => setShowScreenshot(!showScreenshot)}
            >
              Add Screenshot
            </Button>
          </div>

          {showScreenshot && (
            <div className="pt-16 border-t border-border">
              <Textarea
                placeholder="Paste screenshot URL or description..."
                fullWidth
                rows={3}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
