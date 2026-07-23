# Aura of Nature

Luxury skincare & wellness ecommerce platform.

Original layouts, motion, and components — inspired by premium editorial hospitality UX, with product content oriented around natural, Ayurvedic wellness.

## Monorepo

| Package  | Path      | Stack                                      |
|----------|-----------|--------------------------------------------|
| Storefront | `client/` | React 19, Vite, Tailwind, GSAP, Lenis    |
| Admin    | `admin/`  | React 19, Vite, Tailwind, Charts           |
| API      | `server/` | Node, Express, MongoDB, JWT, Razorpay      |

## Quick start

```bash
npm install
npm run dev:server   # API  → http://localhost:5000
npm run dev:client   # Shop → http://localhost:5173
npm run dev:admin    # Admin → http://localhost:5174
```

## Build phases

1. **Folder structure** ✓
2. **Design system** ✓
3. **Authentication** ✓
4. **Homepage** ✓
5. **Shop** ✓
6. **Product** ✓
7. **Cart** ✓
8. **Checkout** ✓
9. **Account dashboard** ✓
10. **Backend APIs** ✓
11. **Admin panel** ✓
12. **Animations polish** ✓
13. **Optimization & SEO** ✓
14. **Content pages** ✓
15. **Admin completion** ✓

## Admin access

Dev credentials (auto-created when MongoDB is offline):

- **Email:** `admin@auraofnature.com`
- **Password:** `Admin1234!`

With MongoDB: run `npm run seed --workspace=@aura/server` to create the same admin user.

## Scripts

- `npm run dev:client` — storefront
- `npm run dev:admin` — admin panel
- `npm run dev:server` — API
- `npm run build` — production builds
