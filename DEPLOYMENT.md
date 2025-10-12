# Deployment Guide for Vercel

## 🚀 Quick Fix for "Failed to Fetch API" Error

Your site is live at: https://instrumentation-zisw.vercel.app/

But the API calls are failing because **MongoDB environment variable is missing**.

## ✅ Solution: Add Environment Variables

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your project: `instrumentation-zisw`
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add MongoDB Connection String

Add the following environment variable:

**Variable Name:**
```
MONGODB_URI
```

**Value (use your MongoDB connection string):**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Important:**
- Replace `username`, `password`, `cluster`, and `database` with your actual MongoDB credentials
- If you don't have MongoDB yet, you can:
  - Use **MongoDB Atlas** (free): https://www.mongodb.com/cloud/atlas
  - Or use a local MongoDB for development

### Step 3: Set Environment for All Deployments

Make sure to select:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

### Step 4: Redeploy

After adding the environment variable:

1. Go to: **Deployments** tab
2. Click on the latest deployment
3. Click: **⋯** (three dots) → **Redeploy**
4. Or just push a new commit to trigger automatic deployment

## 🔍 Check API Health

After deployment, visit:
```
https://instrumentation-zisw.vercel.app/api/health
```

You should see:
```json
{
  "success": true,
  "status": "healthy",
  "message": "API and database are working correctly",
  "mongodb": "connected"
}
```

## 📋 Environment Variables Needed

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `NEXT_PUBLIC_API_BASE_URL` | ❌ Optional | API base URL (defaults to same origin) |

## 🔧 Alternative: Use MongoDB Atlas (Free)

If you don't have MongoDB:

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create a free cluster** (M0 - Free tier)
3. **Create a database user**:
   - Database Access → Add New Database User
   - Username: `admin`
   - Password: (generate a secure password)
4. **Whitelist all IPs** (for Vercel):
   - Network Access → Add IP Address
   - Add: `0.0.0.0/0` (allow access from anywhere)
5. **Get connection string**:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
6. **Add to Vercel** as shown above

## 🐛 Troubleshooting

### Issue: Still getting "Failed to fetch"

**Check:**
1. Environment variable is set correctly in Vercel
2. MongoDB connection string is valid
3. MongoDB cluster allows connections from `0.0.0.0/0`
4. You've redeployed after adding environment variables

### Issue: "MONGODB_URI is not defined"

**Solution:**
- Make sure you added the environment variable in Vercel dashboard
- Redeploy the application
- Check `/api/health` endpoint

### Issue: "Connection timeout"

**Solution:**
- Check MongoDB Atlas Network Access settings
- Make sure `0.0.0.0/0` is whitelisted
- Verify your connection string is correct

## 📞 Need Help?

1. Check health endpoint: `/api/health`
2. Check Vercel logs: Project → Deployments → Click deployment → View Function Logs
3. Check MongoDB Atlas logs: Atlas Dashboard → Activity Feed

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] IP whitelist configured (`0.0.0.0/0`)
- [ ] Connection string copied
- [ ] `MONGODB_URI` added to Vercel
- [ ] Application redeployed
- [ ] `/api/health` returns success
- [ ] Website loads products correctly

---

After completing these steps, your site should work perfectly! 🎉

