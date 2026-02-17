# KodNest Premium Build System

A professional, calm, and intentional design system for serious B2C SaaS products.

## Design Philosophy

- **Calm**: No flashy animations, gradients, or visual noise
- **Intentional**: Every design decision has a purpose
- **Coherent**: Consistent patterns across all components
- **Confident**: Clear hierarchy and generous spacing

## Tech Stack

### Core Technologies

**Next.js 14 (App Router)**
- Server components for optimal performance
- Built-in routing and API routes
- Excellent SEO capabilities
- Industry-standard React framework for production apps

**TypeScript**
- Type safety prevents runtime errors
- Better developer experience with autocomplete
- Self-documenting code
- Essential for enterprise-grade applications

**Tailwind CSS**
- Utility-first approach enables consistent design tokens
- Minimal CSS bundle size
- Rapid development without context switching
- Perfect for design systems with strict spacing/color rules

**CSS Variables**
- Runtime theming capability
- Better browser DevTools integration
- Fallback support for older browsers
- Clean separation of design tokens

### Why This Stack?

1. **Production-Ready**: Next.js is battle-tested by Vercel, Notion, TikTok, and others
2. **Performance**: Server components reduce JavaScript sent to client
3. **Type Safety**: TypeScript catches errors at compile time, not in production
4. **Maintainability**: Tailwind's utility classes prevent CSS bloat and naming conflicts
5. **Developer Experience**: Hot reload, TypeScript autocomplete, clear error messages
6. **Scalability**: Component-based architecture scales from MVP to enterprise

This is not a trendy or experimental stack—it's what serious B2C companies use.

## Color System

```
Background: #F7F6F3 (off-white)
Primary: #111111 (near-black)
Accent: #8B0000 (deep red)
Success: #4A5F4A (muted green)
Warning: #8B7355 (muted amber)
```

Maximum 4 colors across the entire system. No gradients, no glassmorphism.

## Typography

- **Headings**: Libre Baskerville (serif), large, generous spacing
- **Body**: Inter (sans-serif), 16–18px, line-height 1.6–1.8
- **Text Block Max Width**: 720px for optimal readability

## Spacing System

Consistent scale: `8px | 16px | 24px | 40px | 64px`

Never use random values like 13px or 27px. Whitespace is part of the design.

## Global Layout Structure

Every page follows this structure:

```
[Top Bar]
   ↓
[Context Header]
   ↓
[Primary Workspace (70%) + Secondary Panel (30%)]
   ↓
[Proof Footer]
```

### Top Bar
- Left: Project name
- Center: Progress indicator (Step X / Y)
- Right: Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline
- 1-line subtext
- Clear purpose, no hype language

### Primary Workspace (70% width)
- Main product interaction area
- Clean cards, predictable components
- No crowding

### Secondary Panel (30% width)
- Step explanation (short)
- Copyable prompt box
- Action buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer (persistent bottom)
- Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed
- Each checkbox requires user proof input

## Components

### Button
- **Primary**: Solid deep red background
- **Secondary**: Black outline
- Consistent hover states (150ms ease-in-out)
- Same border radius everywhere

### Card
- Subtle border, no drop shadows
- Balanced padding (sm: 16px, md: 24px, lg: 40px)
- Clean, minimal aesthetic

### Input
- Clean borders, no heavy shadows
- Clear focus state (border changes to primary color)
- Error state with helpful message

### Checkbox
- Simple square design
- Clear checked/unchecked states
- Consistent with overall aesthetic

## Interaction Rules

- **Transitions**: 150–200ms, ease-in-out
- **No bounce, parallax, or noise**
- Predictable, calm hover states

## Error & Empty States

- **Errors**: Explain what went wrong + how to fix
- **Never blame the user**
- **Empty states**: Provide next action, never feel dead

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the design system demo.

## File Structure

```
app/
  layout.tsx          # Root layout
  page.tsx            # Demo page
  globals.css         # Design tokens + base styles
components/
  Button.tsx          # Primary/Secondary buttons
  Card.tsx            # Container component
  Input.tsx           # Form input
  Textarea.tsx        # Form textarea
  Badge.tsx           # Status badges
  Checkbox.tsx        # Checkbox component
  ProgressIndicator.tsx
  layout/
    TopBar.tsx        # Top navigation bar
    ContextHeader.tsx # Page header
    PrimaryWorkspace.tsx
    SecondaryPanel.tsx
    ProofFooter.tsx   # Bottom checklist
    PageLayout.tsx    # Complete page wrapper
```

## Design System Rules

1. **Consistency First**: One design system, one mind
2. **No Visual Drift**: All components follow the same rules
3. **Calm Over Flashy**: Professional, not playful
4. **Whitespace Matters**: Generous spacing is intentional
5. **Limited Palette**: Maximum 4 colors
6. **Clear Hierarchy**: Typography creates natural flow

---

**KodNest Premium Build System** — Serious design for serious products.
