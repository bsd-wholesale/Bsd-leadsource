# Railway Deployment Guide - Step by Step

## What I've Done Automatically:
✓ Initialized git repository
✓ Added all files to git
✓ Committed changes

## What You Need to Do (Manual Steps):

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `lead-dashboard` (or your preferred name)
3. Make it **Public** (easier for Railway)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 2: Connect Your Local Git to GitHub
After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd dashboard
git remote add origin https://github.com/YOUR_USERNAME/lead-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Connect Railway to GitHub
1. Go to https://railway.app
2. Sign up/login (use GitHub login for easiest setup)
3. Click "New Project"
4. Click "Deploy from GitHub repo"
5. Authorize Railway to access your GitHub
6. Select your `lead-dashboard` repository
7. Click "Deploy"

### Step 4: Add Environment Variables in Railway
1. After deployment starts, go to your Railway project
2. Click on your project settings (gear icon)
3. Go to "Variables" tab
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://kgpdjqfltcbjttpzxnbh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncGRqcWZsdGNianR0cHp4bmJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc5NTMwMCwiZXhwIjoyMDkyMzcxMzAwfQ.j_Ob137y5VUUo6Z-RKIBW-MtM_7_AKrUmhB5DYg9LNA
```

### Step 5: Wait for Deployment
- Railway will automatically deploy
- Takes 2-5 minutes
- Click on your project to see the deployment URL

### Step 6: Access Your Dashboard
- Railway will provide a URL like `https://your-project-name.up.railway.app`
- Access your dashboard there

## Troubleshooting:
- If deployment fails, check Railway logs
- Make sure environment variables are set correctly
- Railway will auto-redeploy on git push

## Done!
Your father can now access the dashboard at the Railway URL.
