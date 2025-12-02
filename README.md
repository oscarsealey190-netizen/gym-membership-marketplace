# Gym Membership Marketplace

A web application where users can buy and sell unused gym memberships.

## Features

- User authentication (signup/login)
- Create and manage gym membership listings
- Search and browse available memberships
- Secure payments via Stripe
- User dashboard for tracking listings and purchases

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account

### Installation

1. Clone the repository
```bash
cd gym-membership-marketplace
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your:
- PostgreSQL database URL
- NextAuth secret (generate with `openssl rand -base64 32`)
- Stripe API keys
- Stripe webhook secret

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Railway

### Database Setup

1. Create a new Railway project
2. Add a PostgreSQL database service
3. Copy the `DATABASE_URL` from Railway

### App Deployment

1. Connect your GitHub repository to Railway
2. Add environment variables:
   - `DATABASE_URL` (from your Railway PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Railway app URL)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`

3. Railway will automatically:
   - Install dependencies
   - Build the Next.js app
   - Run Prisma migrations
   - Start the server

### Stripe Webhook Setup

1. After deployment, copy your Railway app URL
2. In Stripe Dashboard, go to Developers > Webhooks
3. Add endpoint: `https://your-app.railway.app/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `checkout.session.expired`
5. Copy the webhook signing secret and add to Railway environment variables

## Database Schema

### User
- Authentication and profile information

### Listing
- Gym membership details (gym name, type, price, location)
- Status tracking (active, pending, sold)

### Transaction
- Payment records
- Links buyers, sellers, and listings
- Stripe payment intent tracking

## Project Structure

```
gym-membership-marketplace/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── listings/        # Listing pages (browse, view, create)
│   ├── dashboard/       # User dashboard
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
├── lib/                 # Utility libraries (db, stripe, auth)
├── prisma/              # Database schema
└── types/               # TypeScript types
```

## API Routes

- `POST /api/auth/signup` - Create new user
- `GET /api/listings` - Get all listings (with search)
- `POST /api/listings` - Create new listing
- `GET /api/listings/[id]` - Get single listing
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/dashboard` - Get user's listings and purchases

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 or production URL) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## License

MIT
