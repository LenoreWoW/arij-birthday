30-Second Elevator Pitch

A unified mobile+web platform powered by Supabase and Clerk that lets customers instantly discover, compare, book, and pay for spa & salon services—and gives merchants an intuitive dashboard to manage offerings, availability, and promotions without juggling calls or DMs.

Problem & Mission

Problem: Customers waste time calling multiple salons to check availability and pricing; merchants lose revenue managing bookings through Instagram DMs or phone.

Mission: Unify discovery, scheduling, payments, and marketing in one app that’s as effortless as scrolling a feed.

Target Audience

Customers: Urban professionals (25–40) in Doha who value convenience and self-care.

Merchants: Independent therapists & small chains lacking online booking; tech-curious but time-pressed.

Core Features

Merchant Onboarding: Clerk-powered signup, claim store, define services, prices & calendar slots

Customer Discovery: Map/list toggle, filters (service, price, rating, distance), search bar

Booking Flow: Multi-service bundling, real-time availability from Supabase, in-app payments via MyFatoorah

Notifications & Marketing: Automated reminders, follow-ups, review prompts; bulk campaigns via Twilio SMS and emails via Resend

Analytics & Reporting: Real-time dashboards, CSV exports, key KPIs

High-Level Tech Stack

Auth: Clerk (SSO + secure session management)

Mobile: React Native + Expo (fast iteration)

Web Admin: React + Vite + Tailwind + shadcn/ui (scalable)

Backend: Supabase (PostgreSQL, Realtime, Storage)

Payments: MyFatoorah (with pre-authorizations & region-specific support)

Notifications: Twilio (SMS), Resend (email), Expo Push

Conceptual Data Model

Entities: User, Merchant, Service, AvailabilitySlot, Booking, Payment, Notification, Review

Key Relations:

Merchant 1—* Services

Service 1—* AvailabilitySlots

User 1—* Bookings

Booking 1—1 Payment; Booking 1—* Notifications; Booking 1—1 Review

UI Design Principles

Mobile-first, card-based components

Clean white canvas + pastel accents

Iconography with clear affordances

Generous whitespace for scannability

Security & Compliance

TLS + DB encryption, Clerk-managed sessions

PCI compliance via MyFatoorah

Data retention & consent screens (GDPR style)

Phased Roadmap

MVP: Clerk auth, merchant signup, service setup, discovery, booking & MyFatoorah payments

V1:  Notifications engine, reviews, merchant calendar UI

V2 : Analytics dashboards, bulk marketing, AI slot suggestions

Risks & Mitigations

Low merchant adoption: Pilot program with waived fees & concierge support

Slot conflicts: Real-time locking and buffer times

Future Expansion

Loyalty & gift cards

In-app chat/video consults

Third-party integrations (Yelp, Google Maps)