# CLAUDE.md - Relaxify Codebase Guide

This document provides essential information for Claude Code instances to work effectively with the Relaxify codebase.

## Project Overview

**Relaxify** is a spa & salon booking platform with mobile and web applications. It's a unified platform that lets customers discover, book, and pay for services while giving merchants tools to manage offerings and availability.

### Mission
Unify discovery, scheduling, payments, and marketing in one app that's as effortless as scrolling a feed.

### Target Market
- **Customers**: Urban professionals (25-40) in Doha who value convenience and self-care
- **Merchants**: Independent therapists & small chains lacking online booking

## Architecture & Tech Stack

### Monorepo Structure
```
relaxify/
├── apps/
│   ├── mobile/          # React Native + Expo mobile app
│   └── web/            # React + Vite web admin dashboard
├── packages/
│   └── shared/         # Shared types, utilities, and Supabase client
└── PlanDocumentation/  # Project planning and design docs
```

### Tech Stack
- **Mobile**: React Native + Expo + TypeScript
- **Web**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Auth**: Clerk
- **Payments**: MyFatoorah
- **Notifications**: Twilio (SMS) + Resend (Email)
- **Monorepo**: Turborepo + npm workspaces
- **Type Safety**: Zod schemas for validation

### Current State (Phase 1)
Both apps are in early development with basic Clerk authentication setup:
- Mobile app: Basic React Native + Expo setup with Clerk provider
- Web app: Basic Vite + React template (needs Clerk integration)

## Build Commands & Scripts

### Root Level (package.json)
```bash
# Development
npm run dev          # Start both mobile and web apps
npm run mobile       # Start mobile app only (cd apps/mobile && npm start)
npm run web         # Start web app only (cd apps/web && npm run dev)

# Build & Quality
npm run build       # Build all apps with Turbo
npm run lint        # Lint all apps with Turbo
npm run clean       # Clean build outputs
```

### Mobile App (apps/mobile/package.json)
```bash
npm start           # Start Expo development server
npm run android     # Start for Android
npm run ios         # Start for iOS
npm run web         # Start for web via Expo
```

### Web App (apps/web/package.json)
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production (tsc -b && vite build)
npm run lint        # ESLint check
npm run preview     # Preview production build
```

### Shared Package (packages/shared)
No specific scripts - contains shared types, Supabase client, and SQL schema.

## Environment Configuration

### Required Environment Variables

**Web App (apps/web/.env.local)**:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Mobile App (apps/mobile/.env)**:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Additional services (see .env.example)**:
- MyFatoorah API keys
- Twilio credentials
- Resend API key

### Environment File Locations
- Root: `.env.example` (template)
- Web: `apps/web/.env.local`
- Mobile: `apps/mobile/.env`

## Database Schema

### Core Tables (Supabase PostgreSQL)
Located in: `packages/shared/src/lib/supabase.sql`

**Primary Entities**:
- `users` - User profiles (extends Clerk data)
- `merchants` - Spa/salon business information
- `services` - Services offered by merchants
- `availability_slots` - Time slots for bookings
- `bookings` - Customer reservations
- `payments` - Payment records via MyFatoorah
- `reviews` - Customer reviews
- `notifications` - System notifications

**Key Relationships**:
- Merchant 1→* Services
- Service 1→* AvailabilitySlots
- User 1→* Bookings
- Booking 1→1 Payment
- Booking 1→* Notifications
- Booking 1→1 Review

### TypeScript Types
Located in: `packages/shared/src/types/index.ts`

All database entities have corresponding Zod schemas for runtime validation:
- `UserSchema` / `User`
- `MerchantSchema` / `Merchant`
- `ServiceSchema` / `Service`
- `BookingSchema` / `Booking`
- etc.

## Authentication Setup

### Clerk Integration
- **Mobile**: Uses `@clerk/clerk-expo` with ClerkProvider wrapper
- **Web**: Uses `@clerk/clerk-react` (setup in progress)
- **Shared**: Clerk user IDs link to Supabase users table

### Current Implementation
- Mobile app has Clerk provider configured in `App.tsx`
- Web app needs Clerk integration (ClerkWrapper exists in `src/lib/clerk.tsx`)
- Supabase RLS policies reference `auth.uid()` for Clerk integration

## Testing Configuration

### Current State
- **No testing framework configured yet**
- No Jest, Vitest, or other testing setup found
- No test files exist in the codebase

### Recommendations for Testing Setup
- Consider Vitest for web app (Vite-native)
- Jest for mobile app (Expo default)
- Shared package could use Vitest or Jest

## Development Workflow

### Turborepo Pipeline
Configured in `turbo.json`:
- `build`: Depends on `^build`, outputs to `dist/**`, `.next/**`
- `lint`: No dependencies, no outputs
- `dev`: No cache, persistent (for dev servers)

### Package Manager
- Uses npm with workspaces
- Package manager locked to `npm@9.0.0`

### TypeScript Configuration
- **Mobile**: Extends `expo/tsconfig.base` with strict mode
- **Web**: Project references setup (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`)
- **Shared**: Basic TypeScript setup

## Key Dependencies

### Mobile App
- `expo`: ~53.0.17
- `react-native`: 0.79.5
- `@clerk/clerk-expo`: ^2.14.3
- `react`: 19.0.0

### Web App
- `react`: ^19.1.0
- `@clerk/clerk-react`: ^5.33.0
- `vite`: ^7.0.4
- `typescript-eslint`: ^8.35.1

### Shared Package
- `@supabase/supabase-js`: ^2.45.0
- `zod`: ^3.22.0

## Common Development Tasks

### Adding New Features
1. Define types in `packages/shared/src/types/index.ts`
2. Add database schema changes to `supabase.sql`
3. Update Supabase client if needed
4. Implement UI in respective apps (mobile/web)

### Database Changes
1. Update `packages/shared/src/lib/supabase.sql`
2. Run SQL in Supabase dashboard
3. Update TypeScript types and Zod schemas
4. Update RLS policies if needed

### Environment Setup for New Developers
1. Copy `.env.example` to appropriate locations
2. Set up Supabase project and run SQL schema
3. Set up Clerk application
4. Configure MyFatoorah, Twilio, Resend (for full features)

## Current Development Phase

**Phase 1**: Infrastructure & Auth ✅ COMPLETED
- ✅ Monorepo setup
- ✅ Database schema design
- ✅ Mobile Clerk integration
- ✅ Web Clerk integration
- ✅ Shared type definitions

**Phase 2**: Authentication & Onboarding ✅ COMPLETED
- ✅ Complete authentication flows (mobile + web)
- ✅ Merchant onboarding flow
- ✅ User profile management
- ✅ Error handling and loading states

**Next Phases**:
- Phase 3: Service & Availability CRUD (Ready to start)
- Phase 4: Discovery UI (map/list views)
- Phase 5: Booking Flow & MyFatoorah payments
- Phase 6: Notifications & Dashboard

## Important Notes for Claude Code

### Code Quality
- Use TypeScript for all new code
- Follow mobile-first design principles
- Maintain consistency between mobile and web apps
- Use Zod schemas for validation

### File Paths
- Always use absolute paths when referencing files
- Mobile entry: `/Users/hassanalsahli/Desktop/Relax/apps/mobile/App.tsx`
- Web entry: `/Users/hassanalsahli/Desktop/Relax/apps/web/src/App.tsx`
- Shared package: `/Users/hassanalsahli/Desktop/Relax/packages/shared/`

### Development Best Practices
- Test changes on both mobile and web platforms
- Update shared types when adding new features
- Consider cross-platform compatibility
- Follow the established patterns in the codebase

### Git Workflow
- Project is in git repository
- Current branch: master
- No specific branching strategy documented

## Documentation Patterns

The project includes comprehensive planning documentation in `PlanDocumentation/`:
- `MasterPlan.md` - Overall project vision and roadmap
- `Implementation.md` - Step-by-step build sequence
- `Design.md` and `FlowandRoles.md` - Design specifications
- Main `README.md` - Getting started guide

When creating new documentation, follow the established markdown format and include practical setup instructions.