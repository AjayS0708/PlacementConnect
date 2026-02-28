'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  getProfileCompletion,
  loadPlacementProfile,
  savePlacementProfile,
  type PlacementProfile,
} from '@/features/placement-readiness/lib/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/placement-readiness/components/ui/card';

export function ProfilePage() {
  const [profile, setProfile] = useState<PlacementProfile>(() => loadPlacementProfile());
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => getProfileCompletion(profile), [profile]);

  const handleChange = (key: keyof PlacementProfile, value: string | number) => {
    setSaved(false);
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    savePlacementProfile(profile);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Set your target role, constraints, and prep bandwidth for more focused readiness planning.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="font-semibold text-slate-700">Profile completion: {completion.completed} / {completion.total}</p>
            <p className="text-slate-600">{completion.percentage}% complete</p>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${completion.percentage}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Details</CardTitle>
          <CardDescription>Saved in localStorage and reused across the readiness workflow.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Full Name
                <input
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="Your name"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Graduation Year
                <input
                  value={profile.graduationYear}
                  onChange={(e) => handleChange('graduationYear', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="2027"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="name@example.com"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Phone
                <input
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="+91..."
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Target Company
                <input
                  value={profile.targetCompany}
                  onChange={(e) => handleChange('targetCompany', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="Infosys, Amazon, etc."
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Target Role
                <input
                  value={profile.targetRole}
                  onChange={(e) => handleChange('targetRole', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="Software Engineer Intern"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Preferred Locations
              <input
                value={profile.preferredLocations}
                onChange={(e) => handleChange('preferredLocations', e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                placeholder="Bangalore, Hyderabad, Remote"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Weekly Prep Hours ({profile.weeklyHours})
              <input
                type="range"
                min={1}
                max={40}
                value={profile.weeklyHours}
                onChange={(e) => handleChange('weeklyHours', Number(e.target.value))}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Current Strengths
                <textarea
                  value={profile.strengths}
                  onChange={(e) => handleChange('strengths', e.target.value)}
                  className="min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="What are you already confident in?"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Weak Areas
                <textarea
                  value={profile.weakAreas}
                  onChange={(e) => handleChange('weakAreas', e.target.value)}
                  className="min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring"
                  placeholder="What needs focused practice?"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Save Profile
              </button>
              {saved && <p className="text-sm text-emerald-700">Profile saved.</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
