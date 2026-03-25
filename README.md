# Sayzora Hospitality – Web App

Full-stack vacation rental website for Sayzora Hospitality, Tenerife.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite via `better-sqlite3` (file-based, zero infra)
- **Auth**: JWT via `jose`, stored as httpOnly cookie
- **Images**: Local file upload to `/public/uploads/`

---

## Quick Start

### 1. Install dependencies

```bash
cd sayzora-web
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and edit:

```bash
cp .env.example .env.local
```

Key variables:

| Variable | Default | Description |
|---|---|---|
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `sayzora2024` | Admin login password — **change this!** |
| `JWT_SECRET` | — | Long random string for JWT signing — **change this!** |
| `NEXT_PUBLIC_BOOKING_URL` | `https://126222_1.holidayfuture.com/` | Booking engine URL |
| `DB_PATH` | `./data/sayzora.db` | SQLite database file path |

### 3. Run in development

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin

The database is created and seeded automatically on first run with all 16 apartment listings.

### 4. Build for production

```bash
npm run build
npm start
```

---

## File Structure

```
sayzora-web/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public-facing pages (with Navbar + Footer)
│   │   │   ├── page.tsx           # Landing page (Hero, About, Apartments, CTA, Contact)
│   │   │   ├── apartments/        # Full apartments gallery
│   │   │   ├── collaborate/       # Partner with Sayzora page
│   │   │   └── invest/            # Invest with us page
│   │   ├── admin/                 # Admin panel (protected)
│   │   │   ├── login/             # Login page
│   │   │   ├── apartments/        # CRUD apartments
│   │   │   ├── content/           # Edit page content
│   │   │   └── settings/          # Site settings
│   │   ├── api/
│   │   │   ├── apartments/        # GET all active apartments
│   │   │   ├── contact/           # POST contact form submissions
│   │   │   └── admin/
│   │   │       ├── auth/          # POST login, DELETE logout
│   │   │       ├── apartments/    # CRUD (GET, POST, PUT, DELETE)
│   │   │       ├── content/       # GET/POST page content
│   │   │       ├── settings/      # GET/POST site settings
│   │   │       └── upload/        # POST file upload
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ApartmentCard.tsx
│   │   ├── ApartmentForm.tsx      # Create/edit apartment form
│   │   ├── AdminShell.tsx         # Admin sidebar layout
│   │   └── ContactForm.tsx
│   ├── lib/
│   │   ├── db.ts                  # SQLite connection + schema + seed
│   │   ├── auth.ts                # JWT sign/verify + session helpers
│   │   └── utils.ts               # Helpers
│   ├── middleware.ts              # Protect /admin routes
│   └── types/index.ts
├── data/                          # SQLite DB (auto-created)
├── public/
│   └── uploads/                   # Uploaded images
├── .env.local                     # Local environment (not committed)
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Admin Panel

Navigate to `/admin` (redirects to `/admin/login` if not authenticated).

**Default credentials** (change in `.env.local`):
- Username: `admin`
- Password: `sayzora2024`

### Features

- **Apartments CRUD**: Create, edit, delete all 16 listings. Fields include name, location, description, bedrooms/bathrooms, amenities (chip selector), Airbnb/Booking.com/HolidayFuture URLs, photo management with cover photo selection.
- **Photo Management**: Upload images or paste URLs. Set cover photo. Reorder by changing sort_order.
- **Page Content Editor**: Edit About Us, Collaborate, and Invest With Us page text (HTML supported).
- **Settings**: Update contact email, WhatsApp number, Instagram/Facebook links.

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add all env variables from `.env.example`
4. Deploy — SQLite writes to `/tmp` in serverless (use a persistent volume or switch to Turso/PlanetScale for production)

> **Note**: For production with persistent data, consider switching `DB_PATH` to a persistent disk (e.g. on Railway, Render, or a VPS) rather than serverless Vercel where the filesystem resets.

### VPS / Railway / Render

Standard `npm run build && npm start` — SQLite persists on the server filesystem.

---

## Customization

- **Booking engine URL**: Update `NEXT_PUBLIC_BOOKING_URL` in `.env.local`
- **Colors**: Edit `tailwind.config.ts` → `theme.extend.colors`
- **Hero background**: Replace the Unsplash URL in `src/app/(public)/page.tsx`
- **Apartment photos**: Add via Admin → Apartments → Edit → Photos
