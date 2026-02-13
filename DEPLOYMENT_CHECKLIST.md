# ✅ Deployment Checklist - Le Centre Franco Tournament System

Use this checklist to ensure everything is set up correctly before launching your tournament.

---

## 📋 PRE-DEPLOYMENT

### 1. Assets & Branding
- [ ] Le Centre Franco logos added to `assets/images/`
  - [ ] `logo-only.png` (square logo for favicon)
  - [ ] `logo-full.png` (full logo with text for footer)
- [ ] Logos are high quality and load correctly
- [ ] Colors match Le Centre Franco branding

### 2. Tournament Configuration
- [ ] Tournament dates configured in `index.html`
  - [ ] RIVALS (13-18) date/time set
  - [ ] Racing (All Ages) date/time set
  - [ ] French date displays correct
  - [ ] English date displays correct
- [ ] Countdown timers testing and working
- [ ] Tournament format descriptions reviewed

### 3. Supabase Database
- [ ] Supabase account created (supabase.com)
- [ ] Project created and database is live
- [ ] API credentials copied to `js/config.js`
  - [ ] `SUPABASE_URL` replaced
  - [ ] `SUPABASE_ANON_KEY` replaced
- [ ] Database tables created via SQL Editor:
  - [ ] `participants` table
  - [ ] `matches` table
  - [ ] `tournament_settings` table
- [ ] Row Level Security policies applied
- [ ] Public read/insert permissions working

### 4. Security
- [ ] Admin password changed in `js/admin.js`
  - Current default: `tournament2026`
  - [ ] Changed to secure password
  - [ ] Password documented securely
- [ ] Supabase API keys not exposed in public repos
- [ ] `.gitignore` configured to protect sensitive files

### 5. Content Review
- [ ] All French translations reviewed and correct
- [ ] All English translations reviewed and correct
- [ ] Contact email correct: `info@lecentrefranco.ca`
- [ ] Footer links correct
- [ ] Privacy policy text accurate

---

## 🚀 DEPLOYMENT

### 6. GitHub Repository
- [ ] Git initialized in project folder
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
  ```powershell
  git add .
  git commit -m "Deploy Le Centre Franco Tournament System"
  git push -u origin main
  ```
- [ ] Repository is public (required for GitHub Pages)

### 7. GitHub Pages
- [ ] GitHub Pages enabled in repository settings
- [ ] Source set to: `main` branch / `/ (root)`
- [ ] Custom domain configured (if applicable)
- [ ] Site is live and accessible
- [ ] HTTPS enabled automatically by GitHub

### 8. Microsoft Teams
- [ ] Teams meeting created for RIVALS tournament
- [ ] Teams meeting created for Racing tournament (or shared)
- [ ] Meeting links saved and documented
- [ ] Meeting settings configured:
  - [ ] Allow guests to join
  - [ ] No lobby (or appropriate lobby settings)
  - [ ] Recording enabled (if desired)

---

## 🧪 TESTING

### 9. Functionality Tests
- [ ] Landing page loads correctly
- [ ] FR/EN language toggle works on all pages
- [ ] Countdown timers display correctly
- [ ] Logo images load on all pages
- [ ] Navigation menu works
- [ ] Footer links work

### 10. Signup Flow
- [ ] Signup form loads
- [ ] Roblox username validation works
  - [ ] Test with valid username: accepts
  - [ ] Test with invalid username: rejects
- [ ] Tournament selection dropdown works
- [ ] Age confirmation checkbox required
- [ ] Rules acceptance checkbox required
- [ ] Form submits successfully
- [ ] Success page displays
- [ ] Duplicate username detection works

### 11. Admin Panel
- [ ] Admin panel loads at `/admin.html`
- [ ] Password protection works
- [ ] Login with correct password succeeds
- [ ] Login with wrong password fails
- [ ] Participants tab shows registered users
- [ ] Filter by tournament works
- [ ] Verify checkbox works
- [ ] Delete participant works
- [ ] Export to CSV works

### 12. Results Entry
- [ ] Admin can select tournament
- [ ] Round number input works
- [ ] Participant list loads
- [ ] Placement inputs accept numbers
- [ ] Points calculate automatically
- [ ] Save results button works
- [ ] Success message displays

### 13. Brackets Page
- [ ] Brackets page loads
- [ ] Tournament tabs work
- [ ] Participants display correctly
- [ ] Live update indicator shows
- [ ] Empty state shows when no participants
- [ ] Refreshes automatically (if Supabase configured)

### 14. Results Page
- [ ] Results page loads
- [ ] Tournament tabs work
- [ ] Shows "upcoming" state before tournament
- [ ] Podium displays correctly (when results exist)
- [ ] Full standings table displays

### 15. Mobile Responsiveness
- [ ] Test on mobile phone (or browser dev tools)
- [ ] Test on tablet (or browser dev tools)
- [ ] All buttons are clickable
- [ ] Text is readable
- [ ] Images scale correctly
- [ ] Navigation menu works on mobile

### 16. Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if available)

---

## 📢 LAUNCH PREPARATION

### 17. Communication Materials
- [ ] Tournament announcement post written
- [ ] Registration link ready to share
- [ ] QR codes generated (optional)
  - [ ] QR code for website registration
  - [ ] QR code for Teams meeting (if needed)
- [ ] Social media graphics prepared
- [ ] Email announcement ready (if applicable)

### 18. Documentation
- [ ] Teams meeting links shared with organizers
- [ ] Admin panel credentials documented securely
- [ ] Emergency contact list prepared
- [ ] Backup plan documented
- [ ] Tournament rules shared with participants

### 19. Final Checks
- [ ] All team members know their roles
- [ ] Admin panel access tested by all admins
- [ ] Backup person knows admin password
- [ ] Tournament date/time confirmed
- [ ] Roblox private server links ready (if needed)
- [ ] Prizes/awards prepared (if applicable)

---

## 🎮 TOURNAMENT DAY

### 20. Pre-Tournament (1-2 hours before)
- [ ] Check admin panel - all signups visible
- [ ] Test Teams meeting link
- [ ] Test Roblox game server
- [ ] Announce Teams meeting link to participants
- [ ] Final reminder post on social media
- [ ] Have admin panel open and ready

### 21. During Tournament
- [ ] Monitor Teams meeting
- [ ] Monitor participant count
- [ ] Take screenshots of each round
- [ ] Enter results after each round
- [ ] Verify bracket updates are live
- [ ] Respond to participant questions

### 22. Post-Tournament
- [ ] Enter final results in admin panel
- [ ] Verify results page displays correctly
- [ ] Announce winners on social media
- [ ] Thank participants
- [ ] Gather feedback
- [ ] Export participant list for records
- [ ] Document lessons learned

---

## 🔧 TROUBLESHOOTING CONTACTS

### If something goes wrong:

**Database Issues:**
- Check Supabase dashboard for errors
- Verify API keys in `js/config.js`
- Check browser console (F12) for errors

**Website Down:**
- Check GitHub Pages status
- Verify repository is still public
- Check GitHub Actions for build errors

**Admin Panel Issues:**
- Clear browser cache
- Check admin password
- Verify Supabase connection

**Teams Meeting Issues:**
- Have backup Discord/Zoom ready
- Share new link immediately
- Post in multiple channels

---

## 📊 POST-LAUNCH MONITORING

### First 24 Hours
- [ ] Monitor signups hourly
- [ ] Respond to questions quickly
- [ ] Fix any reported bugs immediately
- [ ] Check error logs in browser console

### Weekly Until Tournament
- [ ] Check signup count
- [ ] Test admin panel weekly
- [ ] Remind participants
- [ ] Update countdown if needed

---

## ✅ READY TO LAUNCH!

Once all items are checked, you're ready to:
1. 📢 Announce tournament
2. 📱 Share registration link
3. 🎮 Run amazing tournament
4. 🏆 Celebrate winners!

---

## 🎯 Success Metrics

Track these to measure success:
- Total signups
- Signups per tournament
- Average signup time
- Completion rate
- Participant satisfaction
- Technical issues encountered
- Admin ease of use rating

---

**Last Updated:** February 2026  
**Tournament System Version:** 1.0  
**Created for:** Le Centre franco
