# Relaxify

A comprehensive spa & salon booking platform with mobile and web applications.

## Project Structure

```
relaxify/
├── apps/
│   ├── mobile/          # React Native + Expo mobile app
│   └── web/            # React + Vite web admin dashboard
├── packages/
│   └── shared/         # Shared types, utilities, and Supabase client
└── PlanDocumentation/  # Project planning and design docs
```

## Tech Stack

- **Mobile**: React Native + Expo + TypeScript
- **Web**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Auth**: Clerk
- **Payments**: MyFatoorah
- **Notifications**: Twilio (SMS) + Resend (Email)
- **Monorepo**: Turborepo + npm workspaces

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd relaxify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Copy `apps/web/.env.local` and fill in your Clerk and Supabase keys
   - Copy `apps/mobile/.env` and fill in your Clerk and Supabase keys

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `packages/shared/src/lib/supabase.sql`
   - Update environment variables with your project details

5. **Set up Clerk**
   - Create a Clerk application
   - Update environment variables with your publishable keys

6. **Run the applications**
   ```bash
   # Run both apps in development
   npm run dev
   
   # Or run individually
   npm run web    # Web dashboard
   npm run mobile # Mobile app
   ```

## Development Scripts

- `npm run dev` - Start both mobile and web apps
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run clean` - Clean build outputs

## Environment Variables

### Required for Web App (apps/web/.env.local)
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Required for Mobile App (apps/mobile/.env)
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Architecture

### Database Schema
- **users** - User profiles (extends Clerk data)
- **merchants** - Spa/salon business information
- **services** - Services offered by merchants
- **availability_slots** - Time slots for bookings
- **bookings** - Customer reservations
- **payments** - Payment records
- **reviews** - Customer reviews
- **notifications** - System notifications

### Key Features
- **Discovery**: Map/list view with filters
- **Booking Flow**: Real-time availability, multi-service bundling
- **Payments**: MyFatoorah integration
- **Notifications**: Automated SMS/Email via Twilio/Resend
- **Dashboard**: Merchant calendar and analytics
- **Auth**: Clerk-based authentication for all platforms

## Development Phases

1. ✅ **Infrastructure & Monorepo Setup**
2. **Auth & Onboarding** (Current)
3. **Service & Availability CRUD**
4. **Discovery UI**
5. **Booking Flow & Payments**
6. **Notifications & Dashboard**

## Contributing

1. Follow the established patterns in the codebase
2. Use TypeScript for all new code
3. Follow the mobile-first design principles
4. Test on both platforms before submitting PRs