# Focus Nexus — Sprint 1.1 (Project Initialization)

React 19 + Vite + Tailwind CSS + Supabase. This sprint ships the rebrand,
the public homepage, and a real project skeleton — auth wiring, routing,
and a stub page for every module — so every future sprint has somewhere
to land.

## Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Framer Motion
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **Charts:** Recharts (wired in for Sprint 9 / Command Center)
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Notifications:** react-hot-toast

## Getting started
```bash
npm install
cp .env.example .env      # then fill in your Supabase URL + anon key
npm run dev
```
Visit `http://localhost:5173`.

## Project structure
```
src/
├── assets/            # logo.svg and other static assets
├── components/
│   ├── common/         # Logomark, NexusDiagram — shared, non-page-specific
│   ├── layout/          # Navbar, Footer
│   ├── ui/              # Button, Badge — the base design system
│   └── cards/           # ModuleCard and future card variants
├── pages/
│   ├── Home/             # Homepage + its sections/
│   ├── Auth/              # Login, Register
│   ├── Dashboard/         # Role-aware dashboard (stub — Sprint 2)
│   ├── Wallet/            # (stub — Sprint 3)
│   ├── Services/          # (stub — Sprint 5)
│   ├── Academy/           # (stub — Sprint 6)
│   ├── Community/         # (stub — Sprint 7)
│   ├── Marketplace/       # (stub — Sprint 8)
│   ├── Agent/             # Agent/Sub-Agent portal (stub — Sprint 4)
│   ├── Admin/             # Command Center (stub — Sprint 9)
│   ├── Business/          # Business portal (stub — Sprint 9)
│   └── common/            # ComingSoon — shared placeholder for stub pages
├── hooks/               # useAuth
├── contexts/            # AuthContext (Supabase session + profile/role)
├── services/            # (empty — Sprint 2+: authService, walletService, etc.)
├── lib/                 # supabaseClient.js
├── routes/              # AppRoutes.jsx, ProtectedRoute.jsx (RBAC gate)
├── utils/               # constants.js (roles)
├── styles/              # index.css (Tailwind entry)
└── App.jsx
```

## What's real vs. stubbed in this sprint
**Real:** homepage (all 5 sections), navbar, footer, logomark, the animated
nexus diagram, Supabase client wiring, Login/Register forms (call real
Supabase auth methods), route protection scaffold, role constants.

**Stubbed (each still its own module/folder per the roadmap):** Dashboard,
Wallet, Services, Academy, Community, Marketplace, Agent, Admin, Business —
each renders a `ComingSoon` placeholder naming the sprint it belongs to.

## Security notes
- The Supabase **anon key** is meant for the browser and is safe to ship —
  Row-Level Security policies are what actually enforce access, not secrecy
  of this key.
- Paystack keys and any supplier API keys must **never** be added to `.env`
  in this frontend project. They belong inside Supabase Edge Functions,
  called from the client without the client ever seeing them.
- `ProtectedRoute` currently checks for a session and (optionally) a role
  on `profile.role`. Sprint 2 wires up the `profiles` table fetch that
  populates `profile` in `AuthContext`.

## Deploy (GitHub → Netlify)
1. Push to GitHub.
2. Netlify → New site from Git → select repo.
3. Build command: `npm run build` — Publish directory: `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Netlify environment
   variables (Site settings → Environment variables).

## Environments
Recommended: separate Supabase **projects** for Development, Staging, and
Production, each with its own `.env` / Netlify environment-variable set,
so schema and auth changes can be tested before touching real user data.

## Next: Sprint 1.2
Database schema — tables, relationships, RLS policies, and the workflows
each module needs (wallet ledger, orders, commissions, academy progress,
etc.).
