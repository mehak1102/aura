# Project structure

```
aura-of-nature/
├── client/                     # Storefront (React 19 + Vite + Tailwind)
│   └── src/
│       ├── animations/         # GSAP + Framer Motion utilities
│       ├── assets/             # images, fonts, icons, videos
│       ├── components/         # ui, layout, home, shop, product, cart…
│       ├── contexts/           # Auth, Cart, Wishlist (later phases)
│       ├── hooks/
│       ├── layouts/
│       ├── lib/
│       ├── pages/              # All storefront routes (lazy-loaded)
│       ├── routes/             # path constants
│       ├── services/api/       # Axios client + endpoints
│       ├── styles/             # Tailwind entry + tokens
│       ├── types/
│       └── utils/
├── admin/                      # Protected dashboard
│   └── src/
│       ├── components/
│       ├── pages/              # Dashboard, Orders, Products, Analytics…
│       ├── routes/
│       └── …
└── server/                     # Express + MongoDB API
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── services/
        ├── templates/emails/
        ├── utils/
        └── validators/
```

## Route map (storefront)

Registered in `client/src/App.tsx` via `ROUTES` in `client/src/routes/paths.ts`.

## Phase ownership

| Area | Phase |
|------|-------|
| Design system / tokens / UI kit | 2 |
| Auth UI + JWT | 3 |
| Homepage + motion foundation | 4 |
| Shop / filters / collections | 5 |
| Product details | 6 |
| Cart | 7 |
| Checkout / Razorpay | 8 |
| Account dashboard | 9 |
| Full backend APIs | 10 |
| Admin panel | 11 |
| Animation polish | 12 |
| Perf / SEO | 13 |
