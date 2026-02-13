# 🔧 Troubleshooting Guide - Le Centre Franco Tournament System

Common issues and solutions for the tournament platform.

---

## 🚨 Critical Issues

### Issue: Website Won't Load / Broken Images

**Symptoms**:
- Broken image icons where logos should be
- Page looks incomplete

**Solution**:
1. Add Le Centre Franco logo files to `assets/images/` folder
2. Required files:
   - `logo-only.png` (square icon)
   - `logo-full.png` (full horizontal logo)
3. See `assets/images/README.md` for details

**Temporary Fix**:
- Website still works without logos
- All functionality intact
- Add logos before showing to public

---

### Issue: Translations Not Working

**Symptoms**:
- Language toggle button doesn't change text
- Everything stays in French
- English toggle doesn't work

**Solution**:
1. **Most Common**: You're opening files directly (file:// URLs)
   - ❌ Don't double-click `index.html`
   - ✅ Use a web server instead:
   
   ```powershell
   cd "C:\Users\MattL\OneDrive - CSDCAB\personal\RobloxTourny-CF"
   python -m http.server 8000
   ```
   
   Then open: `http://localhost:8000`

2. Check browser console (F12) for JavaScript errors
3. Verify `js/i18n.js` and `js/language.js` are loading

---

### Issue: Signup Form Doesn't Validate Roblox Usernames

**Symptoms**:
- Username input doesn't show ✓ or ✗
- Can't submit form
- "Loading..." never stops

**Causes & Solutions**:

1. **CORS / Network Issues**
   - Open browser console (F12)
   - Look for "CORS" or "blocked" errors
   - **Solution**: This is a Roblox API limitation when testing locally
   - **Fix**: Deploy to GitHub Pages (Roblox API allows requests from https://)

2. **No Internet Connection**
   - Roblox username validation requires internet
   - **Solution**: Connect to internet or test with demo mode

3. **Roblox API Down** (rare)
   - Check https://www.roblox.com/ - is it working?
   - **Solution**: Wait and try again later

---

### Issue: Admin Panel Won't Show Participants

**Symptoms**:
- Admin panel loads but shows "No participants"
- Can't see registrations

**Solution**:

1. **Supabase Not Configured**
   - Open `js/config.js`
   - Check if `SUPABASE_URL` and `SUPABASE_ANON_KEY` are filled in
   - Should NOT say "YOUR_SUPABASE_URL_HERE"
   - **Fix**: Follow Step 2 in `QUICK_START.md`

2. **Database Tables Not Created**
   - Go to Supabase dashboard
   - Click "Table Editor"
   - Do you see `participants`, `matches`, `tournament_settings` tables?
   - **Fix**: Run the SQL from `QUICK_START.md` Step 2

3. **Wrong API Keys**
   - Verify API keys in `js/config.js` match Supabase dashboard
   - **Fix**: Copy fresh keys from Supabase > Settings > API

---

### Issue: Can't Login to Admin Panel

**Symptoms**:
- "Incorrect password" message
- Can't access admin interface

**Solution**:

1. **Default Password**: `tournament2026`
   - Have you changed it?
   - Check `js/admin.js` line 10

2. **Browser Cache**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+F5)

3. **Typo in Password**
   - Password is case-sensitive
   - Check for extra spaces

---

## ⚠️ Common Issues

### Issue: Countdown Timer Not Working

**Symptoms**:
- Shows "À déterminer" or "TBD"
- Never counts down

**Solution**:
1. Open `index.html`
2. Find tournament configuration (around line 300)
3. Verify date is set correctly:
   ```javascript
   date: new Date(2026, 1, 28, 14, 0, 0) // Year, Month-1, Day, Hour, Min, Sec
   ```
4. **Remember**: Months are 0-indexed! (0=Jan, 1=Feb, 2=Mar...)

---

### Issue: GitHub Pages Not Deploying

**Symptoms**:
- Pushed code to GitHub
- GitHub Pages URL shows 404
- Site not live

**Solution**:

1. **Wait 2-5 Minutes**
   - GitHub Pages takes time to build
   - Refresh after a few minutes

2. **Check Repository Settings**
   - Go to repo > Settings > Pages
   - Source should be "main" branch
   - Branch should show "/ (root)"

3. **Repository Must Be Public**
   - GitHub Pages requires public repos on free tier
   - Settings > General > Change visibility to Public

4. **Check Build Status**
   - Go to "Actions" tab in repository
   - Look for failed builds (red X)
   - Click to see error messages

---

### Issue: Mobile Version Looks Broken

**Symptoms**:
- Text overlaps on phone
- Buttons not clickable
- Layout weird on mobile

**Solution**:
1. Clear mobile browser cache
2. Check if you modified `css/main.css`
   - If yes, verify media queries intact
3. Test in browser dev tools (F12 > Device Toolbar)
4. Try different mobile browsers

---

### Issue: Results Not Saving in Admin Panel

**Symptoms**:
- Enter placements, click save
- Nothing happens
- No success message

**Solution**:

1. **Check Browser Console** (F12)
   - Look for red error messages
   - Common: Supabase connection error

2. **Verify Supabase Connection**
   - Can you see participants in "Participants" tab?
   - If no → Supabase not configured
   - **Fix**: Check API keys in `js/config.js`

3. **Duplicate Placements**
   - Error: Two participants with same placement
   - **Fix**: Each participant needs unique placement (1, 2, 3...)

4. **Demo Mode**
   - If Supabase isn't configured, system runs in demo mode
   - Demo mode doesn't persist data
   - **Fix**: Set up Supabase to save real data

---

### Issue: Teams Meeting Link Doesn't Work

**Symptoms**:
- Link says "Meeting not found"
- Can't join meeting

**Solution**:

1. **Meeting Expired**
   - Free Teams meetings expire after 60 minutes
   - **Fix**: Create new meeting
   - Click "Meet Now" in Teams
   - Copy new link
   - Share with participants

2. **Wrong Link**
   - Verify you copied full meeting link
   - Should start with `https://teams.microsoft.com/`

3. **Guest Access Disabled**
   - Check Teams meeting settings
   - Enable "Allow guests to join"

---

## 🐛 Less Common Issues

### Issue: Duplicate Signups Not Being Blocked

**Symptoms**:
- Same username can register twice
- No "already registered" error

**Possible Causes**:
1. Supabase `UNIQUE` constraint not applied
   - **Fix**: Re-run SQL from `QUICK_START.md`
2. Registering for different tournaments
   - This is allowed! Same username can enter both tournaments

---

### Issue: Wrong Language Showing on Load

**Symptoms**:
- Always loads in English (or French)
- Toggle works but preference not saved

**Solution**:
1. Check browser localStorage:
   - F12 > Application > Local Storage
   - Look for "preferredLanguage"
2. Clear localStorage:
   ```javascript
   localStorage.clear();
   ```
3. Refresh page

---

### Issue: Slow Page Load

**Symptoms**:
- Pages take long to load
- Images load slowly

**Causes & Solutions**:

1. **Large Logo Files**
   - Compress logo images
   - Recommended: < 500KB each
   - Use tools like TinyPNG.com

2. **Slow Internet**
   - Test on different connection
   - Check internet speed

3. **Supabase Free Tier Paused**
   - Supabase pauses inactive projects after 1 week
   - **Fix**: Visit Supabase dashboard to wake it up

---

## 🔍 Debugging Tips

### How to Check for JavaScript Errors

1. Open browser (Chrome, Firefox, Edge)
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for red error messages
5. Read the error - often tells you exactly what's wrong!

**Common Error Messages**:
- `CORS`: Needs web server or HTTPS
- `Failed to fetch`: Network/API issue
- `undefined is not a function`: JavaScript error (report this!)
- `404`: File not found (check file paths)

---

### How to Test Features Locally

1. **Start Local Server**:
   ```powershell
   python -m http.server 8000
   ```

2. **Open in Browser**:
   - Go to `http://localhost:8000`

3. **Test Each Feature**:
   - [ ] Landing page loads
   - [ ] FR/EN toggle works
   - [ ] Signup form loads
   - [ ] Admin panel requires password
   - [ ] Brackets page loads

4. **Check Mobile**:
   - Press F12
   - Click device toolbar icon
   - Select "iPhone" or "Pixel"
   - Test all pages

---

### How to View Supabase Data

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Select table:
   - `participants` - See all signups
   - `matches` - See all results
   - `tournament_settings` - See tournament configs
4. You can manually edit data here if needed!

---

## 📞 When to Ask for Help

**Try troubleshooting first**, but ask for help if:
- ❌ Error persists after following solutions
- ❌ Console shows error you don't understand
- ❌ Data is corrupted/lost
- ❌ Security concern
- ❌ Need to recover deleted data

**Before asking for help, gather**:
1. What page/feature has the issue?
2. What were you trying to do?
3. Screenshot of error (if any)
4. Browser console errors (F12 > Console)
5. Steps to reproduce the issue

---

## 🛡️ Preventing Issues

### Pre-Launch Checklist

Use `DEPLOYMENT_CHECKLIST.md` to verify:
- [ ] Logos added
- [ ] Supabase configured
- [ ] Admin password changed
- [ ] Tournament dates set
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested in multiple browsers

### Regular Maintenance

**Weekly** (during signup period):
- Check admin panel for new signups
- Verify website loads correctly
- Test signup form

**Before Tournament Day**:
- Test admin panel results entry
- Verify Teams meeting link works
- Test on mobile device
- Check all pages load

---

## ✅ Success Indicators

**Website is working correctly if**:
- ✅ All pages load without errors
- ✅ FR/EN toggle works
- ✅ Logos display correctly
- ✅ Signup form validates usernames
- ✅ Admin panel shows participants
- ✅ Countdown timers count down
- ✅ Mobile version looks good
- ✅ No console errors

---

## 📚 Additional Resources

- **Full Documentation**: `README.md`
- **Setup Guide**: `QUICK_START.md`
- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Project Summary**: `PROJECT_COMPLETE.md`

---

**Still Stuck?**

1. Re-read the error message carefully
2. Search error message online
3. Check Supabase dashboard for issues
4. Try clearing browser cache
5. Test in incognito/private window
6. Ask Le Centre Franco IT support

---

**Remember**: Most issues are simple configuration problems that can be fixed in 5 minutes! 💪
