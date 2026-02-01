# GymSnap

A photo-first gym workout tracker with AI coaching. Take a photo of gym equipment, let AI identify the exercise, log your sets, and track your progress.

## Features (Week 1)

- 📸 Photo-based exercise identification using Claude AI
- 💪 Track sets, reps, and weight for each exercise
- 🕐 Workout history
- 📱 Progressive Web App (installable on mobile)
- 🔐 Passwordless authentication with magic links

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **PWA**: vite-plugin-pwa
- **Backend/DB**: Supabase (Postgres + Auth + Storage)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- An Anthropic API key
- A Vercel account (for deployment)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy:
   - Project URL
   - Anon/public key
3. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
4. Go to **Storage** and create a bucket named `exercise-photos` with public access

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**IMPORTANT**: Never commit `.env.local` to git!

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Configure environment variables in Vercel:
   - `VITE_SUPABASE_URL` (same as local)
   - `VITE_SUPABASE_ANON_KEY` (same as local)
   - `ANTHROPIC_API_KEY` (your Anthropic API key - **server-side only**)
3. Deploy!

Vercel will automatically:
- Detect the Vite project
- Build and deploy
- Set up the `/api` directory as serverless functions
- Give you a URL like `https://your-app.vercel.app`

### 3. Update Supabase Auth Settings

In your Supabase project:
1. Go to **Authentication > URL Configuration**
2. Add your Vercel URL to **Site URL** and **Redirect URLs**

## PWA Icons

The project includes a placeholder icon at `public/icons/icon.svg`. For production, you should:

1. Create PNG icons at these sizes:
   - 192x192px → `public/icons/icon-192.png`
   - 512x512px → `public/icons/icon-512.png`
2. Use a tool like [RealFaviconGenerator](https://realfavicongenerator.net/) to generate all required sizes

You can use the SVG as a starting point or replace it with your own design.

## Project Structure

```
gym-app/
├── api/
│   └── identify.ts          # Vercel serverless function for AI
├── public/
│   ├── icons/               # PWA icons
│   └── robots.txt
├── src/
│   ├── components/          # React components
│   │   ├── Camera.tsx
│   │   ├── ExerciseConfirm.tsx
│   │   ├── SetLogger.tsx
│   │   ├── WorkoutSession.tsx
│   │   ├── History.tsx
│   │   └── Layout.tsx
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts
│   │   ├── anthropic.ts
│   │   └── types.ts
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Workout.tsx
│   │   ├── HistoryPage.tsx
│   │   └── Profile.tsx
│   ├── App.tsx              # Router setup
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── schema.sql           # Database schema
├── .env.example             # Environment variables template
├── vercel.json              # Vercel configuration
└── package.json
```

## Core Flow

1. User logs in with email (magic link)
2. Starts a workout
3. Takes a photo of gym equipment
4. AI identifies the exercise
5. User confirms or edits the exercise
6. Logs sets (weight × reps)
7. Repeats for more exercises
8. Ends workout
9. Views history

## Supabase Tables

- **workouts**: Workout sessions
- **exercises**: Exercises within a workout
- **sets**: Individual sets for each exercise

See `supabase/schema.sql` for full schema with Row Level Security policies.

## API Routes

- `POST /api/identify`: Takes a base64 image and returns exercise identification from Claude

## Development Notes

- Camera uses `getUserMedia` with rear-facing camera on mobile
- Images are compressed to ~200KB JPEG before sending to API
- All Claude API calls go through server-side function (API key never exposed to frontend)
- PWA is configured for offline-first with service worker
- Uses Supabase Auth with magic link (passwordless)

## Next Steps (Post Week 1)

- [ ] AI coaching chat based on workout history
- [ ] Exercise analytics and charts
- [ ] Progressive overload recommendations
- [ ] Photo gallery for exercises
- [ ] Social features
- [ ] Custom exercise library

## Troubleshooting

### Camera not working
- Check browser permissions
- Try the "Choose from Gallery" fallback
- On iOS, camera access requires HTTPS (works on localhost and Vercel)

### Build errors
- Make sure all environment variables are set
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18+

### Authentication issues
- Verify Supabase URL and keys are correct
- Check that redirect URLs are configured in Supabase
- Make sure you're using HTTPS in production

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
