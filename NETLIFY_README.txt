===============================================
⚠️  NETLIFY DRAG-AND-DROP WON'T WORK  ⚠️
===============================================

Your video chat app needs a running server 24/7.
Netlify drag-and-drop is only for static websites (no server).

❌ What WON'T work on Netlify:
   - Video calling
   - Real-time chat
   - Socket.IO connections
   - PeerJS server

===============================================
✅  WHAT TO DO INSTEAD
===============================================

OPTION 1: RENDER.COM (Recommended - FREE & EASY)
------------------------------------------------
1. Go to: https://render.com
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect GitHub or upload your code
5. Settings:
   - Build Command: npm install
   - Start Command: npm start
6. Click "Create Web Service"
7. Done! Your app will be live in 2 minutes.

FREE TIER: Yes (app sleeps after 15 min of inactivity)


OPTION 2: RAILWAY.APP (Modern & Fast)
--------------------------------------
1. Go to: https://railway.app
2. Sign up
3. Click "New Project"
4. Upload your code or connect GitHub
5. Railway auto-deploys your app
6. Done!

FREE TIER: $5 credit per month


OPTION 3: FLY.IO (Uses Docker)
-------------------------------
1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Run: fly launch
3. Run: fly deploy
4. Done!

FREE TIER: Limited free usage


===============================================
📦 FILES CREATED FOR YOU
===============================================

✅ netlify.toml - Netlify config (reference only)
✅ render.yaml - One-click Render deployment
✅ railway.json - Railway config
✅ Dockerfile - Docker config
✅ app.json - Heroku config
✅ DEPLOYMENT.md - Full deployment guide


===============================================
🎯 RECOMMENDED: Use Render.com
===============================================

It's the easiest and has a generous free tier.
Just upload your code and it works!

Questions? Read DEPLOYMENT.md for full guide.
