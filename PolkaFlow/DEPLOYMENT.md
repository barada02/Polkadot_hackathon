# PolkaFlow Deployment Guide

## 🚀 Frontend Deployment (Vercel)

### Step 1: Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 2: Environment Variables (Vercel Dashboard)
Add this environment variable:
```
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api/v1
```

### Step 3: Deploy
1. Push your code to GitHub
2. Connect Vercel to your GitHub repo
3. Deploy automatically
4. Get your Vercel URL (e.g., `https://polkaflow.vercel.app`)

---

## 🖥️ Backend Deployment (Railway)

### Step 1: Prepare Backend
1. Ensure all Polkadot API dependencies are set up:
```bash
cd backend
npm install
npx papi add westend2 -n westend2
npx papi add westend2_asset_hub -n westend2_asset_hub
npx papi add westend2_bridge_hub -n westend2_bridge_hub
npx papi add westend2_collectives -n westend2_collectives
npx papi add westend2_coretime -n westend2_coretime
npx papi add westend2_people -n westend2_people
npx papi
```

### Step 2: Environment Variables (Railway Dashboard)
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 3: Deploy
1. Connect Railway to your GitHub repo
2. Select backend folder as root directory
3. Railway will auto-deploy

---

## 🔄 Update Process

1. **Deploy Frontend First** → Get Vercel URL
2. **Update Backend CORS** → Add Vercel URL to environment
3. **Deploy Backend** → Get Railway URL  
4. **Update Frontend API** → Set Railway URL in Vercel environment
5. **Redeploy Frontend** → Final deployment with correct API URL

## 📝 Notes

- The API service now automatically uses environment variables
- CORS is configured to work with Vercel domains
- All TypeScript errors have been fixed
- Polkadot API setup commands are documented in commands.md