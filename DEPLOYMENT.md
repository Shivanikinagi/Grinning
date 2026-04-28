# Deployment Guide

## Quick Deploy to Render (Free)

### Step 1: Prepare Your Repository
✅ Already done - your code is on GitHub!

### Step 2: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Shivanikinagi/Grinning`
3. Configure:
   - **Name**: `svm-task-manager`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

```
PORT=3000
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your_private_key_with_newlines
ANTHROPIC_API_KEY=your_anthropic_key
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Your app will be live at: `https://svm-task-manager.onrender.com`

## Alternative: Deploy to Railway

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `Shivanikinagi/Grinning`

### Step 3: Add Variables
Add the same environment variables as above

### Step 4: Deploy
Railway will auto-deploy and give you a URL

## Alternative: Ngrok (For Testing)

### Quick Local Access
```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm start

# In another terminal, expose it
ngrok http 3000
```

You'll get a public URL like: `https://abc123.ngrok.io`

## Mobile Access

### Option 1: Same WiFi Network
1. Find your computer's IP address
   - Windows: `ipconfig` → look for IPv4
   - Mac/Linux: `ifconfig` → look for inet
2. On mobile, visit: `http://YOUR_IP:3000`

### Option 2: Deployed URL
Use the Render/Railway URL on any device

## Testing Checklist

- [ ] Server starts without errors
- [ ] Can access homepage
- [ ] Team members load
- [ ] Can select a team member
- [ ] Tasks display correctly
- [ ] Can mark tasks as done
- [ ] Google Sheet updates
- [ ] AI insights appear
- [ ] Works on mobile browser

## Troubleshooting

### "Application Error"
- Check environment variables are set correctly
- Check logs in Render/Railway dashboard

### "Cannot connect to Google Sheets"
- Verify service account email has access to sheet
- Check private key format (preserve \n characters)

### "Claude AI not working"
- Verify Anthropic API key is valid
- Check you have credits in your Anthropic account

## Production Checklist

- [ ] Environment variables configured
- [ ] Google Sheet shared with service account
- [ ] HTTPS enabled (automatic on Render/Railway)
- [ ] Custom domain (optional)
- [ ] Error monitoring setup
- [ ] Backup strategy for Google Sheet

## Cost

- **Render Free Tier**: Free forever, sleeps after 15 min inactivity
- **Railway Free Tier**: $5 credit/month
- **Google Sheets API**: Free (up to 100 requests/100 seconds)
- **Claude AI**: Pay as you go (very cheap for this use case)

## Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables
3. Test locally first with `npm start`
4. Check Google Sheet permissions
