# Railway Deployment Instructions

## Environment Variables

Add these environment variables to Railway:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

1. **Push to GitHub:**
   ```bash
   cd dashboard
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Railway:**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect Next.js

3. **Add Environment Variables:**
   - Go to your project settings
   - Add the environment variables listed above

4. **Deploy:**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Access your dashboard at the Railway URL

## Local Development

```bash
cd dashboard
npm install
npm run dev
```

Access at http://localhost:3000
