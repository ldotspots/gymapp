# Quick Setup Guide

Follow these steps to get GymSnap running locally and deployed to production.

## Part 1: Local Development Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (this takes ~2 minutes)

### Step 3: Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL editor and click **Run**
5. You should see "Success. No rows returned"

### Step 4: Create Storage Bucket

1. In Supabase, go to **Storage**
2. Click **New bucket**
3. Name it `exercise-photos`
4. Make it **Public**
5. Click **Create bucket**

### Step 5: Get Your Supabase Credentials

1. Go to **Settings > API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon/public** key (under "Project API keys")

### Step 6: Create Environment File

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and paste your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Do NOT add the Anthropic API key to .env.local** - it will go on Vercel only

### Step 7: Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

You should see the GymSnap login page.

Note: The camera and AI identification won't work locally without the Anthropic API key being set server-side. You'll need to deploy to Vercel for full functionality.

---

## Part 2: Deployment to Vercel

### Step 1: Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys**
4. Create a new key
5. Copy it (you won't be able to see it again!)

### Step 2: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - GymSnap"
```

### Step 3: Push to GitHub

1. Create a new repository on GitHub (don't initialize with README)
2. Copy the commands from GitHub to push your code:
   ```bash
   git remote add origin https://github.com/yourusername/gym-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (use your GitHub account)
3. Click **Add New Project**
4. Import your GitHub repository
5. **Don't deploy yet!** First, configure environment variables:

### Step 5: Configure Environment Variables in Vercel

In the Vercel project settings, add these environment variables:

1. `VITE_SUPABASE_URL`: Your Supabase project URL
2. `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
3. `ANTHROPIC_API_KEY`: Your Anthropic API key

Make sure all three are added for **Production**, **Preview**, and **Development** environments.

### Step 6: Deploy

Click **Deploy**

Vercel will build and deploy your app. This takes about 2-3 minutes.

### Step 7: Configure Supabase Auth URLs

1. Copy your Vercel deployment URL (e.g., `https://gym-app-xyz.vercel.app`)
2. Go back to your Supabase project
3. Go to **Authentication > URL Configuration**
4. Set **Site URL** to your Vercel URL
5. Add your Vercel URL to **Redirect URLs**
6. Click **Save**

---

## Part 3: Testing

1. Open your Vercel URL on your phone
2. Click **Install App** if prompted (iOS Safari: Share > Add to Home Screen)
3. Sign up with your email
4. Check your email for the magic link
5. Click the link to log in
6. Start a workout
7. Take a photo of gym equipment
8. Watch the AI identify it
9. Log some sets
10. View your history

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created `.env.local` with the correct values
- Restart the dev server after creating the file

### Camera not working locally
- Use **Choose from Gallery** instead
- Or deploy to Vercel where HTTPS is enabled

### Authentication not working
- Check that redirect URLs are set in Supabase
- Make sure you're using the correct Supabase URL and keys
- Try incognito/private browsing mode

### AI identification fails
- Make sure `ANTHROPIC_API_KEY` is set in Vercel (not .env.local)
- Check the Vercel function logs for errors
- Verify your Anthropic API key is valid and has credits

### Build fails on Vercel
- Check the build logs for specific errors
- Make sure all environment variables are set
- Try running `npm run build` locally first

---

## Next Steps

Once everything is working:

1. **Generate proper PWA icons**: See `public/icons/README.md`
2. **Customize the app**: Change colors, add your branding
3. **Invite friends**: Share your Vercel URL
4. **Monitor usage**: Check Vercel and Supabase dashboards

---

## Costs

- **Vercel**: Free tier (plenty for personal use)
- **Supabase**: Free tier (500MB database, 1GB storage, 50MB file uploads)
- **Anthropic**: Pay-per-use (roughly $0.003 per image identification with Claude Sonnet)

For personal use, you'll likely stay within all free tiers except Anthropic, which should cost less than $5/month for regular use.

---

## Need Help?

- Check the main [README.md](README.md) for more details
- Review the [project brief](../PROJECT_BRIEF.md) if you have it
- Open an issue on GitHub
- Check Vercel and Supabase documentation
