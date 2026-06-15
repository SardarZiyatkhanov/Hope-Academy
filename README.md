# Hope Academy

Demo web application for an Azerbaijani education-abroad consulting agency. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Firebase (Auth, Firestore, Storage).

## Features

- Public landing page with an animated Canvas world map (Bakı → European cities)
- Unified login with role-based redirects (student / manager / superadmin)
- Student portal: route map, application tracking with status timelines, document upload, realtime chat
- Admin panel: dashboard with KPIs, student management, leads CRM, chat, world map, settings

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your Firebase project's web app config.

3. Deploy the Firestore and Storage security rules:

   ```bash
   npx firebase-tools deploy --only firestore:rules,storage --project <your-project-id>
   ```

4. Seed demo data (creates demo accounts, universities, applications, leads, documents, and chat messages):

   ```bash
   npm run seed
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

## Demo accounts

All passwords are `demo1234`.

| Email               | Role       |
| ------------------- | ---------- |
| student@demo.com    | student    |
| manager@demo.com    | manager    |
| admin@demo.com      | superadmin |

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run seed` — seed Firestore/Auth with demo data
