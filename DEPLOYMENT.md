# 🚀 Cahaya Deployment Guide

## Firebase Configuration for Different Environments

### 1. **Development (Local)**
- ✅ `localhost:3000` - Already authorized by default
- ⚠️ `192.168.1.10:3000` - Needs to be added manually

### 2. **Production Deployment**

#### **Step 1: Add Production Domains to Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `cuanflex` project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add these domains:

**For Web Deployment:**
```
your-app.vercel.app
your-app.netlify.app
cahaya.id
www.cahaya.id
```

**For Mobile App (Capacitor):**
```
localhost
capacitor://localhost
http://localhost
https://localhost
```

**For Development:**
```
localhost:3000
127.0.0.1:3000
192.168.1.10:3000
```

#### **Step 2: Environment Variables**
Create different `.env` files for each environment:

**`.env.local` (Development):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAmw2tta3qz2yjoyhjrOw4i979IDzzfQA0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuanflex.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuanflex
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuanflex.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=859834790066
NEXT_PUBLIC_FIREBASE_APP_ID=1:859834790066:web:751b77f3d245e6dcd919ab
NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY=6LcTY3crAAAAAPS5Gjvt2RcCIi3WKIWaXFzHgr6X
```

**Production (Vercel/Netlify):**
- Add the same environment variables in your deployment platform's settings
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

#### **Step 3: Deployment Platforms**

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
# Upload dist folder to Netlify
```

**Custom Server:**
```bash
npm run build
npm start
```

### 3. **Mobile App (Capacitor)**

#### **Build for Android:**
```bash
npm run build:android
cd android
./gradlew assembleDebug
```

#### **Firebase Configuration for Mobile:**
- Add `capacitor://localhost` to authorized domains
- Configure Firebase for Android in `google-services.json`

### 4. **Common Issues & Solutions**

#### **Auth Domain Error:**
```
Firebase: Error (auth/auth-domain-config-required)
```
**Solution:** Add your domain to Firebase Console authorized domains

#### **CORS Issues:**
```
Access to fetch blocked by CORS policy
```
**Solution:** Ensure your domain is in Firebase authorized domains

#### **Environment Variables Not Loading:**
```
Firebase config undefined
```
**Solution:** Check that all `NEXT_PUBLIC_` prefixed variables are set

### 5. **Security Best Practices**

1. **Never commit `.env` files** to version control
2. **Use different Firebase projects** for dev/staging/production
3. **Restrict API keys** in Firebase Console
4. **Enable App Check** for production
5. **Set up Firebase Security Rules** for Firestore

### 6. **Monitoring & Analytics**

- Enable Firebase Analytics in production
- Set up error monitoring with Firebase Crashlytics
- Monitor authentication metrics in Firebase Console

---

## Quick Commands

```bash
# Development
npm run dev              # localhost only
npm run dev:network      # accessible on network

# Production Build
npm run build
npm start

# Mobile
npm run build:android
```