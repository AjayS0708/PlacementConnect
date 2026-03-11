# Placement Connect — Carbon Ascent Design System

## Overview
This document defines the complete design system for **Placement Connect**. Every designer and developer must follow these specifications exactly to maintain visual consistency across all three product modules: Job Notifications, Placement Readiness, and Resume Builder.

---

## 1. Design Philosophy

### Core Principles
- **Ambitious**: Forward-leaning UI that mirrors the urgency of placement season.
- **Trustworthy**: Consistent visual language, clear hierarchy, honest data presentation.
- **Sharp**: Information density that respects the user — no fluff, no filler.
- **Coherent**: One system, one mind. No visual drift between product modules.

### Anti-Patterns (Never Do This)
- ❌ Purple gradients (overused SaaS cliché)
- ❌ Neon colors or oversaturated palettes
- ❌ Bounce animations or parallax scrolling
- ❌ Pie charts (use donuts with center stat instead)
- ❌ Icon-only navigation on first use
- ❌ Random spacing values (stick to the 8px scale)
- ❌ Gradient buttons or gradient card backgrounds
- ❌ More than 5% visual weight of accent orange per screen

---

## 2. Color System

### Palette Name: Carbon Ascent

### Primary Palette
```css
/* Light Mode */
--color-background:   #F4F5F7;  /* Cloud White — page background */
--color-surface-0:    #FFFFFF;  /* Card & elevated surface */
--color-primary:      #1A1F2E;  /* Deep Space Navy — brand primary */
--color-accent:       #F5820A;  /* Launch Orange — CTAs, progress, highlights */
--color-success:      #12B76A;  /* Signal Green — readiness scores, completions */
--color-border:       #E2E4EA;  /* Subtle borders */
--color-text-primary: #1A1F2E;  /* Primary body text */
--color-text-muted:   #6B7280;  /* Secondary / caption text */

/* Dark Mode (Carbon Focus) */
--color-background:   #0D1117;  /* Obsidian */
--color-surface-0:    #1A1F2E;  /* Deep Space Navy as surface */
--color-border:       #2A2F3E;
--color-text-primary: #E8EAF0;
--color-text-muted:   #8B929E;
```

### Usage Rules
- **Background**: Page canvas — `#F4F5F7` (light) / `#0D1117` (dark)
- **Primary**: Text, nav, sidebar backgrounds
- **Accent**: CTA buttons, active nav, progress fills, percentage rings. Max 15% visual weight per screen. Never as a large background fill.
- **Success**: Score fills, placement readiness %, completion checkmarks
- Never introduce colours outside this palette without design approval

---

## 3. Typography

### Font Families
```css
--font-display: 'Syne', sans-serif;       /* Headings, brand wordmark */
--font-sans:    'DM Sans', sans-serif;    /* UI, body, forms, data */
--font-mono:    'JetBrains Mono', monospace; /* Code snippets only */
```

**Google Fonts import** (in `globals.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Type Scale
```css
--text-h1:     52px / 1.15  /* Syne 700, -0.02em tracking */
--text-h2:     36px / 1.20  /* Syne 600, -0.02em tracking */
--text-h3:     24px / 1.30  /* Syne 600, -0.01em tracking */
--text-h4:     18px / 1.40  /* DM Sans 600 */
--text-body:   15px / 1.60  /* DM Sans 400 */
--text-small:  13px / 1.50  /* DM Sans 400 */
--text-caption:11px / 1.40  /* DM Sans 400 */
--text-cta:    15px / 1.00  /* DM Sans 600, +0.02em tracking */
```

### Typography Rules
1. **Headings = Syne**, **Body/UI = DM Sans**
2. H1–H2 letter-spacing: `-0.02em`; H3–H4: `-0.01em`
3. CTA buttons: `+0.02em` (slightly open for legibility)
4. ALL CAPS labels: `+0.08em`
5. All text blocks max-width: `720px` for readability
6. Never use font sizes outside the type scale
7. Never use Inter, Roboto, Arial, or system fonts for brand elements

---

## 4. Spacing System

### Scale
Only use these values for margins, padding, gaps:
```
8px   — Tight spacing within components
16px  — Default spacing between related elements
24px  — Spacing between component groups
40px  — Section spacing
64px  — Large section breaks
```

### Application Examples
- Button padding: 24px horizontal, 16px vertical
- Card padding: 24px (medium), 40px (large)
- Page margins: 40px
- Section gaps: 64px

**Never** use values like 13px, 27px, 35px, etc. Consistency is critical.

---

## 5. Layout System

### Global Page Structure
Every page must follow this exact structure:

```
┌─────────────────────────────────────────┐
│ Top Bar (Project | Progress | Status)  │
├─────────────────────────────────────────┤
│ Context Header (Headline + Subtext)    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────┬─────────────────┐ │
│  │ Primary         │ Secondary       │ │
│  │ Workspace       │ Panel           │ │
│  │ (70% width)     │ (30% width)     │ │
│  │                 │                 │ │
│  └─────────────────┴─────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ Proof Footer (Checklist)                │
└─────────────────────────────────────────┘
```

### Component Specifications

#### Top Bar
- Height: Auto (min 64px)
- Background: #FEFEFE (surface-light)
- Border-bottom: 1px solid #D4D2CC
- Content: 
  - Left: Project name (sans-serif, 18px, font-weight 600)
  - Center: Progress indicator (Step X / Y + visual dots)
  - Right: Status badge

#### Context Header
- Background: #F7F6F3 (background)
- Padding: 64px vertical, 40px horizontal
- Border-bottom: 1px solid #D4D2CC
- Headline: Serif, 48px, line-height 1.2
- Subtext: Sans-serif, 18px, line-height 1.7, max-width 720px

#### Primary Workspace
- Width: 70% of container (minus gap)
- Background: Transparent
- Contains main interaction cards

#### Secondary Panel
- Width: 30% of container (max 400px)
- Sticky positioning (top: 24px)
- Contains step info, prompt, action buttons

#### Proof Footer
- Background: #FEFEFE (surface-light)
- Border-top: 1px solid #D4D2CC
- Padding: 24px vertical, 40px horizontal
- Persistent at bottom of page
- Contains 4-column checkbox grid

---

## 6. Components

### Button

#### Primary Button
```css
background: #F5820A  /* Launch Orange */
color: #FFFFFF
padding: 12px 20px
border-radius: 8px
border: none
font: DM Sans, 15px, font-weight 600, letter-spacing 0.02em
transition: 150ms ease-in-out
hover: background: #dc6c08
focus: outline 2px solid #F5820A, offset 2px
```

#### Secondary Button
```css
background: transparent
color: #1A1F2E
padding: 12px 20px
border-radius: 8px
border: 1.5px solid #E2E4EA
font: DM Sans, 15px, font-weight 600
transition: 150ms ease-in-out
hover: border-color: #1A1F2E, background: #f6f7f9
```

#### States
- Disabled: opacity 50%, cursor: not-allowed
- Focus: same as hover (no separate outline)
- Active: same as hover

### Card
```css
background: #FFFFFF
border: 1px solid #E2E4EA
padding: 24px (medium) or 40px (large)
border-radius: 12px
box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
hover (interactive cards): box-shadow: 0 4px 16px rgba(0,0,0,0.12)
```

### Input
```css
background: #FFFFFF
border: 1.5px solid #E2E4EA
padding: 12px 16px
border-radius: 8px
font: DM Sans, 15px
color: #1A1F2E
transition: 150ms ease-in-out
focus: border-color: #F5820A
error: border-color: #ef4444
```

### Badge / Tag
```css
border-radius: 6px
padding: 2px 8px
font: DM Sans, 11px, font-weight 500, letter-spacing 0.02em
accent-orange variant: background #fff8ee, color #dc6c08
success variant: background #edfdf5, color #099556
```

### Shape & Elevation
```css
/* Border Radius */
--radius-sm:  6px   /* Badges, tags */
--radius-md:  8px   /* Buttons, inputs */
--radius-lg:  12px  /* Cards */
--radius-xl:  16px  /* Modals, sheets */

/* Elevation (box-shadow) */
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md:  0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)
--shadow-lg:  0 20px 48px rgba(0,0,0,0.18)

/* Launch Orange glow (active/focused states) */
--glow-sm: 0 0 8px rgba(245, 130, 10, 0.3)
--glow-md: 0 0 16px rgba(245, 130, 10, 0.4)
```

---

## 7. Interaction & Animation

### Transitions
- Standard: `200ms cubic-bezier(0.4, 0, 0.2, 1)` — most state changes
- Fast: `100ms` — hover microinteractions
- Spring: `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` — modals, drawers

### Hover States
- Buttons: Background color change (150ms)
- Links: No underline, subtle color change
- Cards: No hover effect (cards are not clickable unless explicitly interactive)

### Loading States
- Spinner: Simple rotating border, accent color
- Skeleton: Subtle pulse, no shimmer effect
- Text: "Loading..." in muted color

### Focus States
- Keyboard focus: `outline: 2px solid #F5820A; outline-offset: 2px`
- Always clearly visible — critical for accessibility
- Border radius matches the focused component’s --radius-*

---

## 8. Error & Empty States

### Error Messages
```
Format: [What went wrong] + [How to fix it]
Example: "Connection failed. Check your internet and try again."
Never: "Error 404" or "Oops!" or blame language
Color: #ef4444 (error red)
Font: DM Sans, 15px, font-weight 500
```

### Empty States
```
Format: Clear illustration of what's missing + Next action
Example: "No projects yet. Create your first project to get started."
Never: Leave space feeling dead
Include: Clear CTA button
```

---

## 9. Accessibility

### Contrast Ratios
- Primary text on background: 16.5:1 (WCAG AAA)
- Accent on white: 6.3:1 (WCAG AA)
- Border on background: 3:1 minimum

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical (top to bottom, left to right)
- Focus states must be clearly visible

### Screen Readers
- All images must have alt text
- Form inputs must have associated labels
- Buttons must have descriptive text (not just icons)

---

## 10. Responsive Behavior

### Breakpoints
```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### Mobile Layout Changes
- Top Bar: Stack items vertically if needed
- Primary Workspace + Secondary Panel: Stack vertically (100% width each)
- Proof Footer: 2×2 grid instead of 4 columns

### Touch Targets
- Minimum size: 44px × 44px
- Spacing between targets: 8px minimum

---

## 11. Content Guidelines

### Voice & Tone — Carbon Ascent
- **Ambitious**: Forward-motion language. Active verbs. Progress framing.
- **Direct**: Short punchy headlines. No adjective-stuffed marketing copy.
- **Trustworthy**: Data-forward. Never exaggerate. Show numbers.
- **Sharp**: Verb + Object CTAs ("View Jobs", "Update Profile", "Download Resume")

### Writing Rules
- Headlines: 1 line maximum, no periods
- CTA buttons: Verb + Object (“View Jobs” not “Jobs”)
- Error messages: Problem + Solution
- Empty states: Status + Next action
- Avoid: "Unlock", "Journey", "Empower", "Bestie", "Oops!"

---

## 12. Code Standards

### CSS Class Naming
Use Tailwind utilities. For custom classes:
```
.component-name-modifier
Example: .card-compact, .button-primary
```

### Component Props
- Always provide TypeScript types
- Use semantic prop names (variant, size, disabled)
- Provide sensible defaults

### File Organization
```
components/
  ComponentName.tsx       # One component per file
  layout/
    LayoutComponents.tsx  # Layout-specific components
app/
  page.tsx               # Pages in app directory
  layout.tsx             # Layouts
  globals.css            # Global styles + design tokens
```

---

## 13. Quality Checklist

Before shipping any interface, verify:

- [ ] Uses only Carbon Ascent approved colours
- [ ] All spacing follows the 8/16/24/40/64px scale
- [ ] Typography: headings in Syne, body/UI in DM Sans
- [ ] Text blocks max-width 720px
- [ ] Buttons follow primary (orange) / secondary (outlined) pattern
- [ ] Accent orange ≤ 15% visual weight per screen
- [ ] Elevation shadows applied correctly (not decorative)
- [ ] Gradients used only in hero BG or progress fills
- [ ] Error messages explain problem + solution
- [ ] Empty states include a clear CTA
- [ ] Keyboard navigation works
- [ ] Contrast ratios meet WCAG AA
- [ ] Mobile layout stacks correctly
- [ ] No visual drift from other pages or modules

---

**Placement Connect** — Carbon Ascent Design System. One platform. One brand. One standard.
