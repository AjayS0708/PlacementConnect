'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import { JobPreferences, parseCommaSeparated, getPreferencesFromStorage, savePreferencesToStorage } from '@/utils/matchScore'
import { jobs } from '@/data/jobs'

export default function SettingsPage() {
  const [roleKeywords, setRoleKeywords] = useState('')
  const [preferredLocations, setPreferredLocations] = useState<string[]>([])
  const [preferredMode, setPreferredMode] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState('')
  const [skills, setSkills] = useState('')
  const [minMatchScore, setMinMatchScore] = useState(40)
  const [saved, setSaved] = useState(false)

  // Get unique locations from jobs data
  const availableLocations = Array.from(new Set(jobs.map(j => j.location))).sort()

  // Load preferences on mount
  useEffect(() => {
    const prefs = getPreferencesFromStorage()
    if (prefs) {
      setRoleKeywords(prefs.roleKeywords.join(', '))
      setPreferredLocations(prefs.preferredLocations)
      setPreferredMode(prefs.preferredMode)
      setExperienceLevel(prefs.experienceLevel)
      setSkills(prefs.skills.join(', '))
      setMinMatchScore(prefs.minMatchScore)
    }
  }, [])

  const handleLocationToggle = (location: string) => {
    setPreferredLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
  }

  const handleModeToggle = (mode: string) => {
    setPreferredMode(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    )
  }

  const handleSave = () => {
    const preferences: JobPreferences = {
      roleKeywords: parseCommaSeparated(roleKeywords),
      preferredLocations,
      preferredMode,
      experienceLevel,
      skills: parseCommaSeparated(skills),
      minMatchScore
    }

    savePreferencesToStorage(preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-40">
      <div className="space-y-16">
        <h1 className="font-serif text-heading-lg text-primary">
          Job Preferences
        </h1>
        <p className="font-sans text-body-base text-[#666666]">
          Configure your job search criteria to activate intelligent matching.
        </p>
      </div>

      <Card padding="lg">
        <div className="space-y-40">
          <div className="space-y-24">
            <Input
              label="Role Keywords"
              placeholder="e.g., Frontend, React, Engineer, Developer"
              value={roleKeywords}
              onChange={(e) => setRoleKeywords(e.target.value)}
              fullWidth
            />
            <p className="font-sans text-sm text-[#666666] -mt-16">
              Comma-separated keywords to match in job titles and descriptions
            </p>

            <div className="space-y-8">
              <label className="font-sans font-medium text-primary block">
                Preferred Locations
              </label>
              <div className="grid grid-cols-2 gap-8">
                {availableLocations.map(location => (
                  <Checkbox
                    key={location}
                    checked={preferredLocations.includes(location)}
                    onChange={() => handleLocationToggle(location)}
                    label={location}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <label className="font-sans font-medium text-primary block">
                Preferred Work Mode
              </label>
              <div className="flex gap-16">
                <Checkbox
                  checked={preferredMode.includes('Remote')}
                  onChange={() => handleModeToggle('Remote')}
                  label="Remote"
                />
                <Checkbox
                  checked={preferredMode.includes('Hybrid')}
                  onChange={() => handleModeToggle('Hybrid')}
                  label="Hybrid"
                />
                <Checkbox
                  checked={preferredMode.includes('Onsite')}
                  onChange={() => handleModeToggle('Onsite')}
                  label="Onsite"
                />
              </div>
            </div>

            <div className="space-y-8">
              <label className="font-sans font-medium text-primary block">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-16 py-16 border-2 border-border bg-surface-light font-sans text-body-base text-primary transition-standard focus:border-primary focus:outline-none"
              >
                <option value="">Any Experience Level</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
              </select>
            </div>

            <Input
              label="Skills"
              placeholder="e.g., React, TypeScript, Node.js, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              fullWidth
            />
            <p className="font-sans text-sm text-[#666666] -mt-16">
              Comma-separated skills to match against job requirements
            </p>

            <div className="space-y-8">
              <label className="font-sans font-medium text-primary block">
                Minimum Match Score
              </label>
              <div className="space-y-8">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full h-8 bg-border appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${minMatchScore}%, #E5E7EB ${minMatchScore}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-[#666666]">0</span>
                  <span className="font-sans text-lg font-semibold text-primary">{minMatchScore}</span>
                  <span className="font-sans text-sm text-[#666666]">100</span>
                </div>
              </div>
              <p className="font-sans text-sm text-[#666666]">
                Jobs below this score will be filtered when "Show only matches" is enabled
              </p>
            </div>
          </div>

          <div className="pt-24 border-t border-border">
            <Button variant="primary" fullWidth onClick={handleSave}>
              {saved ? '✓ Preferences Saved!' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </Card>

      {saved && (
        <Card padding="md" className="bg-[#ECFDF5] border-[#22C55E]">
          <p className="font-sans text-sm text-primary">
            <strong className="font-semibold">Success:</strong> Your preferences have been saved and will be used for intelligent job matching.
          </p>
        </Card>
      )}
    </div>
  )
}
