# PolkaFlow Deployment Guide

## Backend Deployment (Render)

### Prerequisites
- GitHub repository connected to Render
- Render account

### Deployment Steps

1. **Create Web Service on Render**
   - Connect your GitHub repository
   - Select the backend directory: `polkaflow/backend`

2. **Build Settings**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18.x or higher

3. **Environment Variables**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### Important: Polkadot API Setup

The backend automatically sets up Polkadot API chains during deployment:

- **postinstall script** runs after `npm install`
- **setup-chains** adds all 6 Westend ecosystem chains
- **generate-descriptors** creates the required API descriptors

**Chains included:**
- westend2 (Relay Chain)
- westend2_asset_hub
- westend2_bridge_hub
- westend2_collectives
- westend2_coretime
- westend2_people

### Build Process Flow
1. `npm install` - Install dependencies
2. `npm run build` - Run after dependencies are installed
3. `npm run setup-all-chains` - Add Polkadot chains sequentially (6 chains)
4. `npm run generate-descriptors` - Generate API descriptors
5. `npm start` - Start the server

### Testing Deployment
After deployment, test the health endpoint:
```
GET https://your-app.onrender.com/health
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

## Frontend Deployment (Vercel)

### Prerequisites
- Backend deployed and URL obtained
- Vercel account

### Deployment Steps

1. **Update Environment Variables**
   Create `.env.production` in frontend:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository
   - Select frontend directory: `polkaflow/frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables in Vercel**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

### Update Backend CORS

After frontend deployment, update backend environment variable:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

## Troubleshooting

### Backend Issues
- Check Render logs for build errors
- Verify Polkadot API chains are properly installed
- Test health endpoint for connectivity

### Frontend Issues
- Verify VITE_API_BASE_URL is correctly set
- Check browser network tab for API call failures
- Ensure CORS is properly configured

### Polkadot API Issues
- Descriptors are generated automatically during build
- If build fails, check for network connectivity during papi commands
- Westend chains must be accessible during build time