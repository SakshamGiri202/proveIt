# ProveIt - Multi-Person Challenge Platform

A modern web application where users can create and join time-based challenges, upload timestamped selfies, and compete on leaderboards to prove their progress.

## Features

- **Challenge Creation** - Create custom 1-week or 1-month challenges
- **Challenge Management** - Browse, join, and manage active challenges
- **Photo Uploads** - Capture photos directly from camera or upload from device
- **Timestamped Evidence** - All photos are timestamped to prove daily progress
- **Side-by-Side Comparison** - View submissions from you and your competitors day-by-day
- **Progress Tracking** - Visual progress bars showing completion percentage
- **Leaderboards** - Global and per-challenge rankings
- **Real-Time Stats** - Participant counts, completion percentages, daily streaks
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Appwrite (BaaS)
- **Authentication**: Appwrite Auth with email/password
- **Database**: Appwrite Collections (NoSQL-style)
- **File Storage**: Appwrite Storage Buckets
- **Deployment**: Vercel (frontend), Self-hosted or Cloud (Appwrite backend)

## Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+
- pnpm

### 1. Start Appwrite Backend

```bash
mkdir ~/appwrite && cd ~/appwrite
docker run -it --rm \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
  --entrypoint="install" \
  appwrite/appwrite:1.7.4
```

Follow setup prompts. See detailed instructions in `APPWRITE_SETUP.md`.

### 2. Configure Frontend

```bash
# Clone or extract project
cd /path/to/prove-it

# Install dependencies
pnpm install

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost:80/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_STORAGE_BUCKET_SUBMISSIONS=challenge-submissions
NEXT_PUBLIC_STORAGE_BUCKET_AVATARS=profile-avatars
NEXT_PUBLIC_STORAGE_BUCKET_THUMBNAILS=challenge-thumbnails
EOF

# Start dev server
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
app/
  ├── page.tsx                    # Landing page
  ├── layout.tsx                  # Root layout
  ├── globals.css                 # Global styles
  ├── auth/
  │   ├── login/page.tsx
  │   └── signup/page.tsx
  ├── dashboard/page.tsx          # User dashboard
  ├── challenges/
  │   ├── page.tsx               # Browse challenges
  │   └── create/page.tsx        # Create new challenge
  ├── challenge/
  │   └── [id]/page.tsx          # Challenge detail & submissions
  └── leaderboard/page.tsx       # Leaderboard rankings

components/
  ├── auth/
  │   ├── LoginForm.tsx
  │   └── SignupForm.tsx
  ├── challenges/
  │   ├── ChallengeCard.tsx
  │   └── CreateChallengeForm.tsx
  ├── submissions/
  │   ├── PhotoUploadWidget.tsx
  │   ├── SubmissionComparison.tsx
  │   └── ProgressTracker.tsx
  ├── leaderboard/
  │   └── LeaderboardTable.tsx
  ├── common/
  │   └── Navbar.tsx
  └── ui/                        # shadcn/ui components

lib/
  ├── appwrite/
  │   ├── client.ts             # Appwrite SDK initialization
  │   └── api.ts                # API utility functions
  ├── types.ts                  # TypeScript interfaces
  └── utils.ts                  # General utilities

public/                         # Static assets
```

## Core Pages

### Landing Page (`/`)
- Hero section with platform overview
- Feature showcase
- Statistics
- Call-to-action buttons

### Authentication
- **Login** (`/auth/login`) - Email/password authentication
- **Sign Up** (`/auth/signup`) - Create account with profile

### Dashboard (`/dashboard`)
- Welcome message
- Quick statistics (active, completed, joined)
- Your challenges list
- Quick actions

### Challenges
- **Browse** (`/challenges`) - Discover all challenges with filters
- **Create** (`/challenges/create`) - Start a new challenge
- **Detail** (`/challenge/[id]`) - Full challenge view with photo uploads

### Leaderboard (`/leaderboard`)
- Global rankings across all challenges
- Per-challenge leaderboards
- Participant statistics

## Key Components

### PhotoUploadWidget
Camera + file upload component with:
- Live camera preview
- Photo capture functionality
- File upload fallback
- Image preview
- Validation

### SubmissionComparison
Side-by-side photo viewer with:
- Day-by-day navigation
- Two-column layout (desktop) / stacked (mobile)
- Timestamps and captions
- Progress indicators
- Calendar visualization

### ProgressTracker
Visual progress display with:
- Progress bar
- Completion percentage
- Days remaining
- Daily streak counter
- Submission calendar
- Status indicators

### LeaderboardTable
Rankings component with:
- Sorted participant list
- Medal indicators (1st, 2nd, 3rd)
- Completion percentage
- Submission count
- Status badges
- Top 3 breakdown

## API Functions (lib/appwrite/api.ts)

### Authentication
- `getCurrentUser()` - Get logged-in user
- `logout()` - End session

### Users
- `createUserProfile()` - Create user profile
- `getUserProfile()` - Get user details
- `updateUserProfile()` - Update profile
- `getUserByUsername()` - Search user

### Challenges
- `createChallenge()` - Start new challenge
- `getChallenges()` - List challenges with filters
- `getChallengeById()` - Get challenge details
- `updateChallenge()` - Update challenge
- `joinChallenge()` - Become participant

### Submissions
- `uploadSubmission()` - Upload photo with metadata
- `getChallengeSubmissions()` - Get all submissions
- `getUserSubmissions()` - Get user's photos
- `getSubmissionComparison()` - Get side-by-side data
- `deleteSubmission()` - Remove photo

### Leaderboard
- `getChallengeLeaderboard()` - Get challenge rankings
- `getGlobalLeaderboard()` - Get global rankings

## Database Schema

### Collections

**users**
- userId (string, unique)
- username (string, unique)
- email (string)
- displayName (string)
- avatarUrl (string)
- bio (string)
- totalChallengesCreated (integer)
- totalChallengesJoined (integer)
- createdAt (datetime)
- updatedAt (datetime)

**challenges**
- creatorId (string)
- title (string)
- description (string)
- duration (enum: week, month)
- durationDays (integer)
- startDate (datetime)
- endDate (datetime)
- status (enum: pending, active, completed)
- imageUrl (string)
- maxParticipants (integer)
- createdAt (datetime)
- updatedAt (datetime)

**challenge_participants**
- challengeId (string)
- userId (string)
- displayName (string)
- avatarUrl (string)
- joinedAt (datetime)
- status (enum: active, completed, quit)
- completionPercentage (integer 0-100)
- submissionCount (integer)

**submissions**
- challengeId (string)
- userId (string)
- storageId (string)
- timestamp (datetime)
- uploadedAt (datetime)
- caption (string)
- day (integer)
- verified (boolean)

### Storage Buckets

- **challenge-submissions** - User photo uploads (10MB max)
- **profile-avatars** - User profile pictures (5MB max)
- **challenge-thumbnails** - Generated thumbnails (1MB max)

## Development

### Environment Variables

Create `.env.local` with:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost:80/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id

# Storage
NEXT_PUBLIC_STORAGE_BUCKET_SUBMISSIONS=challenge-submissions
NEXT_PUBLIC_STORAGE_BUCKET_AVATARS=profile-avatars
NEXT_PUBLIC_STORAGE_BUCKET_THUMBNAILS=challenge-thumbnails
```

### Running Locally

```bash
# Install deps
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Testing Checklist

- [ ] Create account
- [ ] Sign in/out
- [ ] Create challenge
- [ ] Browse challenges
- [ ] Join challenge
- [ ] Upload photo via camera
- [ ] Upload photo via file
- [ ] View submissions
- [ ] Check leaderboard
- [ ] Mobile responsiveness
- [ ] Dark mode

## Deployment

### Frontend (Vercel)

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel project settings
# Auto-deploy on git push
```

### Backend (Appwrite)

Options:
1. **Docker on your server** - See Appwrite docs
2. **Managed services** - AWS, DigitalOcean, Heroku
3. **Appwrite Cloud** - Official managed service

Update `NEXT_PUBLIC_APPWRITE_ENDPOINT` with production URL.

## Security Features

- **Row-Level Security (RLS)** - Users can only access their own data
- **File Validation** - Validate file type and size
- **Session Management** - HTTP-only session cookies
- **Input Validation** - Both client and server-side
- **CORS Configuration** - Restricted to allowed origins

## Performance Optimization

- Image lazy loading
- Photo compression before upload
- Indexed database queries
- Client-side filtering
- Responsive images
- Code splitting with Next.js

## Troubleshooting

### "Collection not found"
- Verify collection names in Appwrite console
- Collection names are case-sensitive

### "CORS error"
- Add `http://localhost:3000` to Appwrite Auth CORS origins
- For production, add your domain

### "Port 80 already in use"
- Use port 8080 in Docker installer
- Update `NEXT_PUBLIC_APPWRITE_ENDPOINT` to `http://localhost:8080/v1`

### Camera permission denied
- Allow camera access in browser settings
- Falls back to file upload

### Images not loading
- Check file exists in Appwrite storage
- Verify bucket name in environment variables
- Check file isn't too large

## Documentation

- **QUICK_START.md** - Step-by-step local setup
- **APPWRITE_SETUP.md** - Detailed Appwrite configuration
- **IMPLEMENTATION_STATUS.md** - Features and progress
- **v0_plans/sleek-map.md** - Full architecture document

## Future Enhancements

- [ ] User profiles and followers
- [ ] Direct challenge invitations
- [ ] Push notifications
- [ ] Leaderboard filtering/sorting
- [ ] Photo moderation system
- [ ] Badges and achievements
- [ ] Comment system
- [ ] Challenge history/archives
- [ ] Export submissions as video
- [ ] Mobile app

## License

MIT - Feel free to use and modify

## Support

For issues and questions:
1. Check documentation files
2. Review error messages in browser console
3. Check Appwrite console for API errors
4. Verify environment variables

---

**Built with ProveIt** - Challenge yourself. Prove your progress.
