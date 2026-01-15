# Vercel Deployment Guide for Quick-Kart Backend

## ✅ Pre-Deployment Checklist

All backend code has been configured for Vercel serverless deployment:

- ✅ **Database Connection**: Mongoose connection reuse implemented for serverless
- ✅ **File Uploads**: Multer configured to use `/tmp` directory on Vercel
- ✅ **Connection Initialization**: Lazy initialization with proper error handling
- ✅ **Vercel Configuration**: `vercel.json` configured with proper routes and timeout
- ✅ **File Cleanup**: Automatic cleanup of temporary files after Cloudinary upload
- ✅ **Environment Variables**: Ready for Vercel dashboard configuration

## 🚀 Deployment Steps

### 1. Install Vercel CLI (if using CLI)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Backend Directory
```bash
cd backend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **Project name?** → quick-kart-backend (or your preferred name)
- **Directory?** → `./` (current directory)

### 4. Set Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all these variables:

```
MONGO_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=https://quick-kart-two.vercel.app
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
MAIL_HOST=smtp.your_email_provider.com
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
NODE_ENV=production
```

### 5. Redeploy After Adding Environment Variables
```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

## 🔧 Configuration Details

### Serverless Function Configuration
- **Entry Point**: `index.js`
- **Runtime**: Node.js (auto-detected)
- **Max Duration**: 30 seconds (configurable in `vercel.json`)
- **Memory**: Default (can be increased if needed)

### File Upload Handling
- Files are temporarily stored in `/tmp` directory (Vercel's writable filesystem)
- Files are automatically uploaded to Cloudinary
- Temporary files are cleaned up after upload
- Supports up to 5 files per request, 5MB each

### Database Connection
- Mongoose connection is reused across serverless invocations
- Connection state is checked before reconnecting
- Handles connection errors gracefully

### CORS Configuration
- Configured to allow requests from `FRONTEND_URL`
- Credentials enabled for cookie-based authentication
- Update `FRONTEND_URL` if your frontend domain changes

## 📝 Important Notes

1. **Environment Variables**: Must be set in Vercel dashboard, not in `.env` file
2. **Frontend URL**: Update `FRONTEND_URL` to match your frontend deployment URL
3. **Database**: Ensure MongoDB Atlas allows connections from Vercel IPs (0.0.0.0/0)
4. **File Size Limits**: Vercel has a 4.5MB request body limit (we use 5MB limit per file)
5. **Cold Starts**: First request may be slower due to serverless cold start

## 🔍 Troubleshooting

### Connection Errors
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Verify `MONGO_URI` is correct in environment variables
- Check Vercel function logs for detailed error messages

### File Upload Issues
- Ensure Cloudinary credentials are correct
- Check file size limits (5MB per file)
- Verify `/tmp` directory permissions (should work automatically)

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend deployment URL exactly
- Check browser console for specific CORS error messages
- Ensure credentials are enabled in frontend requests

## 📊 Monitoring

- View logs in Vercel Dashboard → Deployments → Click on deployment → Functions → View logs
- Monitor function execution time and errors
- Check database connection pool usage

## 🔄 Updating Deployment

To update your deployment:
```bash
cd backend
vercel --prod
```

Or push to your connected Git repository (if configured).

---

**Backend URL**: After deployment, Vercel will provide a URL like `https://your-project.vercel.app`

Update your frontend's `VITE_BACKEND_URL` environment variable to this URL.


