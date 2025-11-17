# Temporary CORS Fix for Testing

If you want to test immediately, you can temporarily update your backend server.js CORS config to allow all origins:

```javascript
app.use(cors({
  origin: '*'  // TEMPORARY - allows all origins
}));
```

Then redeploy backend. This will help confirm if CORS is the issue.

**IMPORTANT:** Don't use this in production - set the proper FRONTEND_URL instead.