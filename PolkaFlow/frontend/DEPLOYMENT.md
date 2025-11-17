# Frontend Deployment Guide (Vercel)

## Prerequisites
- Backend deployed on Render and URL obtained
- Vercel account
- GitHub repository

## Step 1: Get Backend URL

First, get your backend URL from Render. It should look like:
```
https://your-app-name.onrender.com
```

Test the health endpoint:
```
https://your-app-name.onrender.com/health
```

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `PolkaFlow/frontend` directory as root
4. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Option B: Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel --prod
```

## Step 3: Set Environment Variables in Vercel

In Vercel dashboard > Settings > Environment Variables, add:

```
VITE_API_BASE_URL = https://your-backend.onrender.com/api/v1
```

**Important:** Make sure to include `/api/v1` at the end!

## Step 4: Update Backend CORS

After frontend deployment, update your Render backend environment variables:

```
FRONTEND_URL = https://your-frontend.vercel.app
```

## Step 5: Test Deployment

1. Visit your Vercel frontend URL
2. Test all pages:
   - Dashboard (portfolio analysis)
   - Fee Analyzer (cross-chain fees)
   - Route Optimizer (multi-hop routing)
   - Network Monitor (health checks)

## Build Settings Summary

**Vercel Configuration:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 18.x

**Environment Variables:**
- `VITE_API_BASE_URL`: Your backend URL with `/api/v1` suffix

## Troubleshooting

### Build Issues
- Ensure TypeScript compiles: `npm run build`
- Check for missing dependencies
- Verify environment variables

### Runtime Issues
- Check browser console for API errors
- Verify backend URL is correct
- Ensure CORS is properly configured
- Test backend health endpoint

### Common Fixes
- API calls failing: Check VITE_API_BASE_URL format
- CORS errors: Update FRONTEND_URL in backend
- 404 errors: Verify API endpoints are available