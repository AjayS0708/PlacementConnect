'use client'

import { useState } from 'react'
import Checkbox from '../Checkbox'
import Input from '../Input'
import Card from '../Card'

interface ProofItem {
  id: string
  label: string
  checked: boolean
  proofInput: string
}

export default function ProofFooter() {
  const [proofItems, setProofItems] = useState<ProofItem[]>([
    { id: 'ui', label: 'UI Built', checked: false, proofInput: '' },
    { id: 'logic', label: 'Logic Working', checked: false, proofInput: '' },
    { id: 'test', label: 'Test Passed', checked: false, proofInput: '' },
    { id: 'deploy', label: 'Deployed', checked: false, proofInput: '' },
  ])

  const handleCheck = (id: string, checked: boolean) => {
    setProofItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked } : item
      )
    )
  }

  const handleInputChange = (id: string, value: string) => {
    setProofItems(items =>
      items.map(item =>
        item.id === id ? { ...item, proofInput: value } : item
      )
    )
  }

  return (
    <div className="border-t border-border bg-surface-light">
      <div className="max-w-[1440px] mx-auto px-40 py-24">
        <h3 className="font-serif text-heading-sm text-primary mb-24">
          Proof of Completion
        </h3>
        <div className="grid grid-cols-4 gap-24">
          {proofItems.map((item) => (
            <Card key={item.id} padding="md">
              <div className="space-y-16">
                <Checkbox
                  checked={item.checked}
                  onChange={(checked) => handleCheck(item.id, checked)}
                  label={item.label}
                />
                {item.checked && (
                  <Input
                    placeholder="Add proof (URL, screenshot, etc.)"
                    value={item.proofInput}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    fullWidth
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
