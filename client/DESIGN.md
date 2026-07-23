# Design System — Aura of Nature

## Philosophy

Luxury hospitality UI (cinematic scale, floating chrome, micro-labels) × organic botanical brand language. Original components — not a clone.

## Foundations

| Token | Value |
|-------|--------|
| Display | Cormorant Garamond |
| Sans / UI | Outfit |
| Cream | `#f4efe6` |
| Warm White | `#faf8f4` |
| Beige | `#e6dccb` |
| Forest | `#243528` |
| Olive | `#5a6b48` |
| Soft Gold | `#b8975c` |
| Charcoal | `#1a1a18` |

## Components (`client/src/components/ui`)

- `Button` — primary, secondary, ghost, outline, gold, inverse
- `MagneticButton` — cursor pull micro-interaction
- `TextLink` — tracked uppercase + draw underline
- `Display` / `Eyebrow` / `Body` — typography scale
- `Container` / `Section` — editorial spacing
- `Glass` — light / dark glassmorphism
- `Input` / `Textarea` — underline fields
- `Badge` / `Divider` / `Logo` / `IconButton`

## Layout chrome

- Floating `Header` with inverse mode on home hero
- Full-panel `SiteMenu`
- Editorial `Footer` + newsletter
- `SmoothScroll` (Lenis)

## Usage

```tsx
import { Display, Eyebrow, MagneticButton, Glass } from '@components/ui'
```
