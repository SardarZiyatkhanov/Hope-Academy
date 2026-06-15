# Hero Animations & Homepage Motion Design

## Goal

Make the homepage feel more alive and "premium" by:
1. Replacing the hero's static background with an animated particle network (a code-generated stand-in for a "video background").
2. Animating the hero's stat numbers as count-up counters.
3. Adding scroll-reveal entrance animations to the main homepage sections.
4. Animating the "How it works" step connectors and icons as they scroll into view.

All four pieces are additive visual enhancements — no existing layout, copy, or behavior changes.

## 1. Hero Particle Network Background

**New file:** `components/features/ParticleBackground.tsx` (`"use client"`)

A canvas-based animated background, absolutely positioned (`absolute inset-0`) inside the hero `<section className="bg-navy relative">`, rendered before the content div so it sits behind it in stacking order.

- ~40–70 small circular particles (radius 1–2.5px), colors drawn from white/blue/gold at low opacity (e.g. `rgba(255,255,255,0.4)`, `rgba(43,109,232,0.5)`, `rgba(232,160,32,0.4)`).
- Each particle has a slow random velocity (e.g. 0.05–0.2 px/frame); particles wrap around when they leave the canvas bounds.
- For every pair of particles within a distance threshold (e.g. 120px), draw a faint line between them (`rgba(255,255,255, alpha)` where alpha scales with `1 - distance/threshold`, capped around 0.12).
- Rendering uses the same `ResizeObserver` + `requestAnimationFrame` pattern as `WorldMap.tsx` (canvas sized to container via `devicePixelRatio`, cleanup on unmount).
- **Reduced motion:** if `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, draw a single static frame (particles at their initial positions, with connecting lines) and skip the animation loop.

**Layout change in `app/page.tsx`:**
- The hero `<section className="bg-navy relative">` gains `<ParticleBackground />` as its first child, with `className="absolute inset-0"`.
- The existing content `<div className="mx-auto grid ... relative z-10">` (add `relative z-10`) so it renders above the canvas.
- `bg-navy` stays on the section as a fallback/base color so there's no flash of unstyled content before the canvas paints.

## 2. Animated Stat Counters

**New file:** `components/ui/AnimatedCounter.tsx` (`"use client"`)

```ts
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number; // seconds, default 1.5
}
```

- Uses framer-motion's `useInView(ref, { once: true })` on a wrapping `<span ref={ref}>`.
- When in view, uses framer-motion's `animate(0, value, { duration, ease: "easeOut", onUpdate })` to update local state with `Math.round(latest)`.
- Renders `<span ref={ref}>{display}{suffix}</span>` — no styling of its own; the caller wraps it in the existing `<p>` with the existing classes.

**Change in `components/features/HeroContent.tsx`:**
- `STATS` becomes:
```ts
const STATS = [
  { value: 1000, suffix: "+", label: "Tələbə" },
  { value: 35, suffix: "+", label: "Universitet" },
  { value: 100, suffix: "%", label: "Şəffaflıq" },
];
```
- Replace `<p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>` with `<p className="text-2xl font-bold text-white sm:text-3xl"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>`.

## 3. Scroll-Reveal Sections

**New file:** `components/ui/Reveal.tsx` (`"use client"`)

```ts
interface RevealProps {
  children: React.ReactNode;
  delay?: number; // seconds, default 0
  className?: string;
}
```

- A `motion.div` that IS the container (not an extra wrapper), with:
  - `initial={{ opacity: 0, y: 24 }}`
  - `whileInView={{ opacity: 1, y: 0 }}`
  - `viewport={{ once: true, amount: 0.2 }}`
  - `transition={{ duration: 0.6, ease: "easeOut", delay }}`
  - `className` applied to this same `motion.div`.

**Changes in `app/page.tsx`:**
- The inner content `<div className="mx-auto max-w-7xl ...">` of the "How it works" section, the CTA tiles `<div className="mx-auto grid ...">`, and the Lead form section's inner `<div className="mx-auto max-w-3xl ...">` each become `<Reveal className="mx-auto ...">` (same classes, just swapping the element/component), preserving layout exactly.
- The Hero and USP strip sections are NOT wrapped (visible on initial load, no reveal needed).

## 4. Animated "How it Works" Step Connectors

**Change in `app/page.tsx`** (How it works section, `STEPS.map`):

- The connector line:
```tsx
{index < STEPS.length - 1 && (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
    style={{ transformOrigin: "left" }}
    className="absolute top-7 left-1/2 hidden h-px w-full bg-gray-200 sm:block"
  />
)}
```
- The icon circle:
```tsx
<motion.div
  initial={{ scale: 0.6, opacity: 0 }}
  whileInView={{ scale: 1, opacity: 1 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue shadow-sm"
>
  <Icon size={22} />
</motion.div>
```
- This file already needs `"use client"` semantics for motion — `app/page.tsx` is currently a server component. Since `motion.div` requires a client component, either:
  - (a) the whole "How it works" step item becomes its own small client component (`components/features/HowItWorksStep.tsx`), or
  - (b) extract the entire "How it works" section into a client component.
  - **Decision:** create `components/features/HowItWorksSteps.tsx` (`"use client"`) that takes `steps: typeof STEPS` and renders the animated grid of steps. `app/page.tsx` stays a server component and imports this client component, same pattern as `WorldMap`/`HeroContent`/`LeadForm` already being client components used from the server `page.tsx`.

## Out of Scope

- No actual video file / external assets.
- No changes to admin/student dashboard pages, contact/about/services pages (homepage only).
- No changes to the WorldMap component itself.
- No new dependencies — `framer-motion` is already installed and used by `HeroContent`.
