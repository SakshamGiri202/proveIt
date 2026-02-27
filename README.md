# ProveIt - Multi-Person Challenge Platform

A modern smartphone-responsive web application where users can create and join time-based challenges, upload timestamped selfies, and compete with side-by-side progress comparison.

## Features

- **User Authentication** - Sign up and login with email/password
- **Challenge Creation** - Create custom challenges with duration (1-30 days)
- **Invite System** - Invite other users to compete in challenges
- **Photo Uploads** - Upload selfies throughout the challenge duration
- **Progress Tracking** - Visual progress bars showing completion percentage
- **Side-by-Side Comparison** - View all participants' progress side-by-side
- **Responsive Design** - Mobile-first with bottom navigation on phone, top navigation on desktop

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Appwrite Cloud (TablesDB API)
- **Authentication**: Appwrite Auth
- **Database**: Appwrite TablesDB
- **Storage**: Appwrite Storage

## Prerequisites

- Node.js 18+
- pnpm
- Appwrite Cloud account

## Quick Start

### 1. Configure Environment

The project already includes `.env` with Appwrite credentials:

```bash
# .env (already configured)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=69a1b4ac003d60b7c767
NEXT_PUBLIC_APPWRITE_DATABASE_ID=69a1b5ea000c0c86ebba
```

### 2. Install & Run

```bash
cd /home/shaggy/proveit
pnpm install
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
proveit/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing/redirect
│   ├── auth/page.tsx           # Auth (login/signup options)
│   ├── dashboard/page.tsx     # Home with all challenges
│   ├── challenge/[id]/page.tsx # Challenge detail + uploads
│   └── profile/page.tsx        # User profile
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── challenges/
│   │   └── CreateChallengeForm.tsx
│   └── common/
│       └── Navbar.tsx          # Responsive nav
│
├── lib/
│   ├── appwrite/
│   │   ├── client.ts           # Appwrite client setup
│   │   └── api.ts              # All API functions
│   └── types.ts                # TypeScript interfaces
│
└── scripts/
    └── setup-tablesdb.js       # Database setup script
```

## Database Schema (TablesDB)

### users
- userId (string)
- username (string)
- displayName (string)
- email (string)
- avatarUrl (string)
- bio (string)
- totalChallengesCompleted (integer)
- createdAt (datetime)
- updatedAt (datetime)

### challenges
- creatorId (string)
- title (string)
- description (string)
- duration (string)
- durationDays (integer)
- startDate (datetime)
- endDate (datetime)
- status (enum: planned, inProgress, completed, cancelled)
- imageUrl (string)
- maxParticipants (integer)
- createdAt (datetime)
- updatedAt (datetime)

### challenge_participants
- challengeId (string)
- userId (string)
- displayName (string)
- avatarUrl (string)
- joinedOn (datetime)
- status (string)
- progress (integer 0-100)
- submissionCount (integer)

### submissions
- challengeId (string)
- userId (string)
- storageId (string)
- timestamp (datetime)
- uploadedAt (datetime)
- day (integer)
- caption (string)
- verified (boolean)

## API Functions

All in `lib/appwrite/api.ts`:
- Authentication: `login()`, `signup()`, `logout()`, `getCurrentUser()`
- Users: `createUserProfile()`, `getUserProfile()`, `updateUserProfile()`
- Challenges: `createChallenge()`, `getChallenges()`, `getChallengeById()`, `joinChallenge()`
- Submissions: `uploadSubmission()`, `getSubmissions()`

## Development

```bash
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm start      # Run production build
```

## Tech Notes

- Uses TablesDB API (not older Databases API)
- Responses use `rows` instead of `documents`
- All sensitive config in `.env` (already in `.gitignore`)
