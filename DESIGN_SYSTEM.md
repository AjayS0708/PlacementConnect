# KodNest Premium Build System — Design Specifications

## Overview
This document defines the complete design system for KodNest Premium Build System. Every designer and developer must follow these specifications exactly to maintain visual consistency.

---

## 1. Design Philosophy

### Core Principles
- **Calm**: No animations for the sake of animation. No visual noise.
- **Intentional**: Every pixel has a purpose. No decoration.
- **Coherent**: One system, one mind. No visual drift between pages.
- **Confident**: Clear hierarchy. Generous whitespace. No apologies.

### Anti-Patterns (Never Do This)
- ❌ Gradients
- ❌ Glassmorphism / frosted glass effects
- ❌ Neon colors
- ❌ Bounce animations
- ❌ Parallax scrolling
- ❌ Decorative fonts
- ❌ Random spacing values
- ❌ Drop shadows (subtle borders only)
- ❌ More than 4 colors

---

## 2. Color System

### Primary Palette
```css
--color-background: #F7F6F3;  /* Off-white, not pure white */
--color-primary: #111111;      /* Near-black for text */
--color-accent: #8B0000;       /* Deep red for actions */
--color-success: #4A5F4A;      /* Muted green */
--color-warning: #8B7355;      /* Muted amber */
--color-border: #D4D2CC;       /* Subtle borders */
--color-surface-light: #FEFEFE; /* Cards/elevated surfaces */
```

### Usage Rules
- Background: Use for page backgrounds (#F7F6F3)
- Primary: All text unless otherwise specified (#111111)
- Accent: Primary buttons, important actions (#8B0000)
- Success/Warning: System feedback only
- Never introduce new colors without design system approval

---

## 3. Typography

### Font Families
```css
--font-serif: 'Libre Baskerville', Georgia, serif;
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'SF Mono', 'Consolas', monospace; /* Code only */
```

### Type Scale
```css
--heading-xl: 64px / 1.1    /* Hero headlines only */
--heading-lg: 48px / 1.2    /* Page headlines */
--heading-md: 32px / 1.25   /* Section titles */
--heading-sm: 24px / 1.3    /* Card titles */
--body-lg: 18px / 1.7       /* Introductory text */
--body-base: 16px / 1.6     /* Default body text */
--body-sm: 14px / 1.5       /* Labels, metadata */
```

### Typography Rules
1. **Headings = Serif** (Libre Baskerville), **Body = Sans-Serif** (Inter)
2. All text blocks max-width: 720px for readability
3. Never use font sizes outside the type scale
4. Generous letter-spacing for headings (tracking: 0.01em)
5. No decorative fonts, no script fonts, no novelty fonts

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
background: #8B0000 (accent)
color: #FFFFFF
padding: 16px 24px
border: none
font: Inter, 16px, font-weight 500
transition: 150ms ease-in-out
hover: background: #6B0000 (darker)
```

#### Secondary Button
```css
background: transparent
color: #111111
padding: 16px 24px
border: 2px solid #111111
font: Inter, 16px, font-weight 500
transition: 150ms ease-in-out
hover: background: #111111, color: #FFFFFF
```

#### States
- Disabled: opacity 50%, cursor: not-allowed
- Focus: same as hover (no separate outline)
- Active: same as hover

### Card
```css
background: #FEFEFE (surface-light)
border: 1px solid #D4D2CC
padding: 24px (medium) or 40px (large)
border-radius: 0 (sharp corners)
box-shadow: none (borders only, no shadows)
```

### Input
```css
background: #FEFEFE
border: 2px solid #D4D2CC
padding: 16px
font: Inter, 16px
color: #111111
transition: 150ms ease-in-out
focus: border-color: #111111
error: border-color: #8B0000
```

### Checkbox
```css
size: 24px × 24px
border: 2px solid #D4D2CC
background: #FEFEFE (unchecked) or #8B0000 (checked)
checkmark: white, 2px stroke
```

---

## 7. Interaction & Animation

### Transitions
- Duration: 150ms (standard for all interactions)
- Timing: ease-in-out (no bounce, no spring)
- Properties: background-color, color, border-color, opacity

### Hover States
- Buttons: Background color change (150ms)
- Links: No underline, subtle color change
- Cards: No hover effect (cards are not clickable unless explicitly interactive)

### Loading States
- Spinner: Simple rotating border, accent color
- Skeleton: Subtle pulse, no shimmer effect
- Text: "Loading..." in muted color

### Focus States
- Keyboard focus: Same as hover state
- No separate focus ring (goes against calm aesthetic)
- Ensure accessibility via visible state change

---

## 8. Error & Empty States

### Error Messages
```
Format: [What went wrong] + [How to fix it]
Example: "Connection failed. Check your internet and try again."
Never: "Error 404" or "Oops!" or blame language
Color: #8B0000 (accent)
Font: Inter, 16px, font-weight 500
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

### Voice & Tone
- **Professional**: Avoid casual language, slang, emojis (unless intentional)
- **Direct**: Say what needs to be said, nothing more
- **Helpful**: Explain how to fix problems, not just that they exist
- **Confident**: No "maybe", "try", "hopefully"

### Writing Rules
- Headlines: 1 line maximum, no periods
- Subtext: 1-2 sentences, provide context
- Button text: Verb + Object ("Create Project", not "Create")
- Error messages: Problem + Solution
- Empty states: Status + Action

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

- [ ] Uses only approved colors from the palette
- [ ] All spacing follows the 8/16/24/40/64 scale
- [ ] Typography uses defined type scale and font families
- [ ] Text blocks are max 720px wide
- [ ] Buttons follow primary/secondary patterns
- [ ] Transitions are 150ms ease-in-out
- [ ] No gradients, glassmorphism, or drop shadows
- [ ] Error messages explain the problem and solution
- [ ] Empty states provide a clear next action
- [ ] Keyboard navigation works correctly
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Mobile layout stacks properly
- [ ] No visual drift from other pages

---

**This is the complete design specification. Deviations require explicit approval.**

**KodNest Premium Build System** — One system, one mind.
