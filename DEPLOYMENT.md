# 🚀 Twin Clash - Deployment Guide for Netlify

## 📋 Quick Deployment Steps

### Option 1: Deploy via Netlify CLI (Fastest)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy from project root:**
   ```bash
   netlify deploy --prod
   ```

4. **Follow the prompts:**
   - Create & configure new site? **Yes**
   - Site name: `twin-clash` (or your preferred name)
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 2: Deploy via Netlify Dashboard (Recommended for first time)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Twin Clash"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/twin-clash.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your `twin-clash` repository

3. **Configure Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18 (auto-detected from netlify.toml)

4. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=https://wjzwkafzvsgmscwijozp.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqendrYWZ6dnNnbXNjd2lqb3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTgyMjIsImV4cCI6MjA3NzQ3NDIyMn0.2-dgQ_9ATkmRf3c4I5vDKQGRkeRVilldk1isunXVDgs
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://YOUR_SITE_NAME.netlify.app`

## 🔧 Configuration Files Created

### `netlify.toml`
- ✅ Build command and publish directory
- ✅ SPA redirect rules (for React Router)
- ✅ Security headers
- ✅ Cache optimization for assets
- ✅ Audio/SVG content-type headers

### `.env.example`
- Template for environment variables
- Safe to commit to Git (no secrets)

### `.gitignore`
- Updated to exclude `.netlify` folder
- Protects `.env` from being committed

## 🌐 Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `twinclash.com`)
4. Follow DNS configuration instructions
5. Netlify will auto-provision SSL certificate

## 📊 Post-Deployment Checklist

- [ ] Site loads correctly at Netlify URL
- [ ] Logo appears (Twin Clash with glow effect)
- [ ] Can create account / login with Supabase
- [ ] Game levels work (1-5)
- [ ] Shop shows themes
- [ ] Can purchase and equip themes
- [ ] Leaderboard displays scores
- [ ] Daily rewards work
- [ ] Duel mode accessible
- [ ] Sound effects (if WAV files added)

## 🔊 Adding Sound Files (Optional)

If you want to enable sound effects:

1. **Generate WAV files** using the Python script in `SOUNDS_README.md`

2. **Create sounds folder:**
   ```bash
   mkdir -p public/sounds
   ```

3. **Copy WAV files:**
   ```bash
   cp *.wav public/sounds/
   ```

4. **Rebuild and redeploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

## 🐛 Troubleshooting

### Build fails on Netlify

**Check Node version:**
- Netlify should use Node 18 (specified in `netlify.toml`)
- If using different version, update `netlify.toml`:
  ```toml
  [build.environment]
    NODE_VERSION = "18"
  ```

### Environment variables not working

**Verify prefix:**
- Vite requires `VITE_` prefix for client-side variables
- Check variables are set in Netlify dashboard
- Redeploy after adding variables

### 404 errors on refresh

**Check redirects:**
- Should be configured in `netlify.toml`
- Verify redirect rule is present:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

### Supabase connection fails

**Check CORS settings:**
- Go to Supabase Dashboard → Project Settings → API
- Add Netlify URL to allowed origins:
  ```
  https://your-site-name.netlify.app
  ```

### Assets not loading

**Check public folder:**
- Ensure `public/` folder has logos:
  - `logo-twinclash.svg`
  - `logo-small.svg`
  - `logo-icon.svg`
- Run build locally first to test

## 📱 Mobile Optimization

The app is already optimized for mobile with:
- ✅ Responsive design (Tailwind CSS)
- ✅ Touch-friendly buttons
- ✅ Mobile viewport meta tag
- ✅ PWA-ready structure

To make it installable as PWA, add manifest.json (future enhancement).

## 🚀 Continuous Deployment

Once connected to GitHub, Netlify will:
- ✅ Auto-deploy on push to `main` branch
- ✅ Build preview for pull requests
- ✅ Show deploy status in GitHub
- ✅ Rollback to previous deploys if needed

## 📈 Performance Tips

### Already Optimized:
- ✅ Vite production build (minified JS/CSS)
- ✅ Code splitting
- ✅ Asset caching (1 year for immutable files)
- ✅ Gzip compression (automatic by Netlify)

### Future Enhancements:
- Add service worker for offline support
- Preload critical fonts
- Lazy load images
- Enable HTTP/3

## 🔒 Security

### Implemented:
- ✅ XSS Protection headers
- ✅ HTTPS by default (Netlify)
- ✅ Content Security Policy headers
- ✅ Frame protection
- ✅ Environment variables secured

### Supabase Security:
- ✅ Row Level Security (RLS) enabled
- ✅ JWT authentication
- ✅ API keys scoped to anonymous role

## 📊 Analytics (Optional)

To add analytics, in Netlify Dashboard:
1. Go to Integrations
2. Add Netlify Analytics or Google Analytics
3. No code changes needed

## 💾 Backups

Supabase data is automatically backed up:
- Point-in-time recovery available
- Managed backups (depending on plan)
- Export data via Supabase dashboard if needed

## 🎯 Next Steps After Deployment

1. **Test everything** on production URL
2. **Share with friends** to get feedback
3. **Monitor Supabase usage** (free tier limits)
4. **Add custom domain** if desired
5. **Enable sound effects** (optional)
6. **Set up social sharing** (add OG meta tags)
7. **Mobile app** (using Capacitor - already configured!)

## 📱 Building Mobile App (Bonus)

The project already has Capacitor configured for Android:

```bash
# Build web app
npm run build

# Copy to Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK
# (Use Android Studio to build and sign)
```

## 🆘 Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Verify Supabase connection
4. Check environment variables
5. Review `netlify.toml` configuration

## ✅ Success!

Your Twin Clash game should now be live at:
**https://YOUR_SITE_NAME.netlify.app**

Share it with the world! 🎮⚡
