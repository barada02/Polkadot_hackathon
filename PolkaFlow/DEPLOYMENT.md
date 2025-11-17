# 🚀 PolkaFlow Deployment Guide

Complete deployment guide for PolkaFlow's frontend and backend services.

## 📋 Deployment Overview

PolkaFlow uses a modern deployment architecture:
- **Frontend**: Vercel for global CDN and serverless deployment
- **Backend**: Render for containerized Node.js application hosting
- **Database**: Stateless architecture with real-time Polkadot network data

## 🎯 Production Deployment (Current)

### Live URLs
- **Frontend**: https://polkaflow-five.vercel.app
- **Backend API**: https://polkaflow-backend.onrender.com
- **Health Check**: https://polkaflow-backend.onrender.com/health

---

## 🖥️ Backend Deployment (Render)

### Prerequisites
- GitHub repository
- Render account
- Node.js 18+ support

### Step 1: Repository Setup
Ensure your repository structure:
```
PolkaFlow/
└── backend/
    ├── package.json
    ├── server.js
    ├── src/
    └── .env.example
```

### Step 2: Render Configuration
**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18.x or higher
- **Root Directory**: `PolkaFlow/backend`

### Step 3: Environment Variables (Render Dashboard)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://polkaflow-five.vercel.app
```

### Step 4: Polkadot API Setup (Automated)
The build process automatically:
1. Cleans existing PAPI configuration
2. Adds all 6 Westend chains sequentially:
   - westend2 (Relay Chain)
   - westend2_asset_hub
   - westend2_bridge_hub
   - westend2_collectives
   - westend2_coretime
   - westend2_people
3. Generates API descriptors
4. Starts the server

### Step 5: Deploy
1. Connect GitHub repository to Render
2. Select `PolkaFlow/backend` as root directory
3. Configure build settings above
4. Deploy automatically on commits

**Expected Build Output:**
```
✔ Metadata saved as .papi/metadata/westend2.scale
✔ Metadata saved as .papi/metadata/westend2_asset_hub.scale
... (all chains)
✔ Descriptors generated successfully
✔ Build successful 🎉
```

---

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository
- Vercel account
- Backend deployed and URL obtained

### Step 1: Build Configuration
**Vercel Settings:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `PolkaFlow/frontend`

### Step 2: Environment Variables (Vercel Dashboard)
```env
VITE_API_BASE_URL=https://polkaflow-backend.onrender.com/api/v1
```

**Important Notes:**
- Include `/api/v1` suffix in the backend URL
- Do NOT add trailing slashes
- Variable must be prefixed with `VITE_` for client-side access

### Step 3: Deploy
1. Push code to GitHub
2. Connect Vercel to repository
3. Select `PolkaFlow/frontend` as root directory
4. Configure settings above
5. Deploy automatically

**Expected Build Output:**
```
✓ built in 1.81s
dist/index.html                   0.47 kB │ gzip:  0.30 kB
dist/assets/index-BYErqeos.css    9.78 kB │ gzip:  2.58 kB
dist/assets/index-7PM4WDdW.js   227.52 kB │ gzip: 68.33 kB
```

---

## 🔧 Configuration Management

### CORS Configuration
Backend automatically handles CORS for:
- `https://polkaflow-five.vercel.app`
- `http://localhost:5173` (development)
- Any URL set in `FRONTEND_URL` environment variable

### API Integration
Frontend automatically uses:
- Production: `VITE_API_BASE_URL` from environment
- Development: Falls back to `http://localhost:3001/api/v1`

---

## 🧪 Local Development

### Backend Setup
```bash
cd backend
npm install
npm run build    # Sets up Polkadot chains
npm run dev      # Development server
```

### Frontend Setup  
```bash
cd frontend
npm install
npm run dev      # Development server
```

### Development URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/v1

---

## ✅ Verification Steps

### 1. Backend Health Check
```bash
curl https://polkaflow-backend.onrender.com/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-18T...",
  "service": "PolkaFlow Backend",
  "version": "1.0.0"
}
```

### 2. API Endpoints Test
```bash
curl https://polkaflow-backend.onrender.com/api/v1/portfolio/supported-chains
```

### 3. Frontend Integration Test
Visit https://polkaflow-five.vercel.app and test:
- Dashboard portfolio analysis
- Fee analyzer functionality  
- Route optimizer features
- Network monitor status

---

## 🚨 Troubleshooting

### Common Issues

**Backend Build Failures:**
- Ensure all PAPI chains are properly configured
- Check Node.js version compatibility (18+)
- Verify Polkadot network connectivity during build

**Frontend CORS Errors:**
- Verify `FRONTEND_URL` in backend environment
- Ensure no trailing slashes in URLs
- Check browser console for specific CORS messages

**Environment Variable Issues:**
- Verify `VITE_` prefix for frontend variables
- Ensure backend URL includes `/api/v1` suffix
- Redeploy frontend after environment changes

### Logs and Monitoring
- **Render Logs**: Available in Render dashboard
- **Vercel Logs**: Available in Vercel dashboard  
- **Browser Console**: Check for client-side errors

---

## 🔄 Deployment Workflow

### Automated Deployment
1. **Code Changes**: Push to GitHub repository
2. **Backend**: Render automatically rebuilds and deploys
3. **Frontend**: Vercel automatically rebuilds and deploys
4. **Testing**: Verify health endpoints and functionality

### Manual Deployment
If needed, trigger manual deployments through:
- Render dashboard (backend)
- Vercel dashboard (frontend)

---

**Deployment Status**: ✅ Production Ready  
**Last Updated**: November 2025  
**Next Review**: Post-hackathon evaluation
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