# 🚀 Major Updates: Dynamic Multi-Platform Tournament System

## ✅ Changes Implemented

### 1. **Teams Button Removed from Home Page**
- ❌ Removed: "Rejoindre la réunion Teams" button
- ✅ Teams links will be included in individual tournament detail pages instead

### 2. **Added "Plateforme" Field**
Each tournament card now shows:
- 📱 **Plateforme**: Roblox / Kahoot / etc.
- 📅 **Date**: 28 février 2026
- 🕐 **Heure**: 14h00 - 16h00
- 🎮 **Format**: FFA / Élimination

**Bilingual:**
- FR: "Plateforme"
- EN: "Platform"

### 3. **Replaced "Tower of Hell" with "Racing"**
**Tournament 2 is now:**
- **FR**: "Tournoi 2: Course de voitures"
- **EN**: "Tournament 2: Racing"
- **Description FR**: "Compétition de course rapide et excitante"
- **Description EN**: "Fast-paced and exciting racing competition"

More family-friendly and appropriate for all ages!

---

## 🎯 NEW PLAN: Dynamic Tournament Management System

Based on your requirements, here's the complete plan for dynamic tournaments:

### Admin Panel - Tournament Management

#### **Create New Tournament** (Form-based)
```
┌────────────────────────────────────────────┐
│  CREATE NEW TOURNAMENT                     │
├────────────────────────────────────────────┤
│                                            │
│  Tournament Name (FR): [____________]      │
│  Tournament Name (EN): [____________]      │
│                                            │
│  Description (FR):     [____________]      │
│  Description (EN):     [____________]      │
│                                            │
│  Platform:             [▼ Roblox     ]    │
│                        (Kahoot, Minecraft) │
│                                            │
│  Age Group:            [____________]      │
│                        (e.g., "13-18 ans") │
│                                            │
│  Date:                 [📅 Select Date]    │
│  Time Display:         [____________]      │
│                        (e.g., "14h00-16h00")│
│                                            │
│  Format:               [____________]      │
│                        (e.g., "FFA/Élim.") │
│                                            │
│  Teams Meeting Link:   [____________]      │
│                                            │
│  Tournament Type ID:   [____________]      │
│                        (e.g., "rivals-pvp")│
│                                            │
│  Status:               ○ Draft             │
│                        ● Published         │
│                                            │
│  Display Order:        [  3  ]             │
│                        (sorting on home)   │
│                                            │
│  [Cancel]           [Save as Draft]  [Publish]│
└────────────────────────────────────────────┘
```

#### **Manage Existing Tournaments**
```
┌──────────────────────────────────────────────────────────┐
│  TOURNAMENT MANAGEMENT                                    │
├──────────────────────────────────────────────────────────┤
│  Search: [____________] Status: [▼ All]                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  📄 RIVALS (13-18 ans) - Roblox                          │
│     Status: Published | Date: 28 fév 2026 | 45 signups  │
│     [Edit] [View] [Mark Completed] [Delete]              │
│                                                           │
│  📄 Course de voitures (Tous âges) - Roblox              │
│     Status: Published | Date: 7 mars 2026 | 32 signups  │
│     [Edit] [View] [Mark Completed] [Delete]              │
│                                                           │
│  📄 Kahoot Trivia (10-14 ans) - Kahoot                   │
│     Status: Draft | Date: 15 mars 2026 | 0 signups      │
│     [Edit] [Publish] [Delete]                            │
│                                                           │
│  📝 Fortnite Battle (12+) - Epic Games                   │
│     Status: Completed | Date: 10 fév 2026 | 28 finished │
│     [View Results] [Archive]                             │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Tournament Status Flow

```
[Create Tournament]
       ↓
   📝 DRAFT
       ↓
  [Publish Button]
       ↓
   ✅ PUBLISHED (visible on home page)
       ↓
  [Start Tournament]
       ↓
   🎮 IN PROGRESS (accepting results)
       ↓
  [Mark Completed]
       ↓
   🏆 COMPLETED (moved to past tournaments)
       ↓
  [Archive]
       ↓
   📦 ARCHIVED (hidden from home, kept in database)
```

### Home Page Display Logic

**Active Tournaments Section:**
```javascript
// Fetch tournaments with status = 'published'
// Sort by display_order
// Generate tournament cards dynamically
```

**Past Tournaments Section** (at bottom):
```javascript
// Fetch tournaments with status = 'completed'
// Show last 3-5 tournaments
// Link to full Results page
```

Example:
```
═══════════════════════════════════════════
    ACTIVE TOURNAMENTS
───────────────────────────────────────────
[Tournament Card 1: RIVALS]
[Tournament Card 2: Racing]
[Tournament Card 3: Kahoot Trivia]

═══════════════════════════════════════════
    PAST TOURNAMENTS
───────────────────────────────────────────
🏆 Minecraft Building Contest - Completed
🏆 Among Us Tournament - Completed
🏆 FIFA 2026 Cup - Completed

[View All Results →]
═══════════════════════════════════════════
```

---

## 📊 Updated Database Schema

### New Table: `tournaments`

```sql
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Names & Descriptions (bilingual)
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  age_group TEXT,
  
  -- Platform & Game Info
  platform TEXT NOT NULL, -- 'Roblox', 'Kahoot', 'Minecraft', etc.
  game_name TEXT, -- Specific game if needed
  
  -- Tournament Details
  tournament_type_id TEXT NOT NULL UNIQUE, -- 'rivals-pvp', 'racing-allages'
  format TEXT, -- 'FFA / Élimination', 'Chronométré / Points', etc.
  
  -- Date & Time
  tournament_date TIMESTAMP WITH TIME ZONE NOT NULL,
  time_display TEXT, -- '14h00 - 16h00'
  
  -- Links & Resources
  teams_meeting_link TEXT,
  signup_link TEXT, -- Generated: /signup.html?tournament=ID
  qr_code_url TEXT, -- Generated QR code image path
  
  -- Status & Visibility
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'in-progress', 'completed', 'archived'
  display_order INTEGER DEFAULT 0, -- For sorting on home page
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID, -- Admin user ID (future feature)
  
  -- Statistics
  participant_count INTEGER DEFAULT 0,
  max_participants INTEGER
);

-- Index for faster queries
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_display_order ON tournaments(display_order);
CREATE INDEX idx_tournaments_date ON tournaments(tournament_date);
```

### Updated `participants` Table

```sql
ALTER TABLE participants
ADD COLUMN tournament_id UUID REFERENCES tournaments(id);

-- Remove the hardcoded tournament_type column eventually
-- Or keep it for backwards compatibility
```

### Updated `matches` Table

```sql
ALTER TABLE matches
ADD COLUMN tournament_id UUID REFERENCES tournaments(id);
```

---

## 🔧 Implementation Steps

### Phase 1: Database Migration
1. Create `tournaments` table
2. Migrate existing hardcoded tournaments to database
3. Update foreign keys in `participants` and `matches`

### Phase 2: Dynamic Home Page
1. Replace hardcoded HTML with JavaScript template
2. Fetch active tournaments from Supabase
3. Generate tournament cards dynamically
4. Implement countdown timers per tournament
5. Add "Past Tournaments" section at bottom

### Phase 3: Admin Panel - Tournament CRUD
1. Create tournament creation form
2. Build tournament list/management view
3. Implement edit functionality
4. Add status change buttons (Draft → Published → Completed)
5. Delete/archive functionality

### Phase 4: Signup Form Integration
1. Update signup form to accept dynamic tournament IDs
2. Query tournament details from database
3. Validate tournament is "published" before allowing signup

### Phase 5: QR Code Generation
1. Auto-generate QR codes when tournament is published
2. Store QR code image in Supabase Storage
3. Display in tournament cards

---

## 🎨 Benefits of Dynamic System

✅ **Scalability**: Add unlimited tournaments without touching code  
✅ **Flexibility**: Support any platform (Roblox, Kahoot, Fortnite, Minecraft)  
✅ **Easy Management**: Le Centre Franco staff can manage independently  
✅ **Draft System**: Preview tournaments before publishing  
✅ **Archive History**: Keep records of past tournaments  
✅ **Multi-Use**: Reuse system year after year  
✅ **Professional**: Clean separation between data and presentation  

---

## 📋 Current Static vs Future Dynamic

### Current (Static):
```html
<!-- Hardcoded in index.html -->
<article class="tournament-card">
  <h3>Tournoi 1: RIVALS</h3>
  <p>13-18 ans</p>
  <!-- More hardcoded content -->
</article>
```

### Future (Dynamic):
```javascript
// Fetch from database
const tournaments = await supabase
  .from('tournaments')
  .select('*')
  .eq('status', 'published')
  .order('display_order');

// Generate cards
tournaments.forEach(tournament => {
  createTournamentCard(tournament);
});
```

---

## 🚀 Next Steps

**Immediate (This Session):**
1. ✅ Teams button removed
2. ✅ "Plateforme" field added
3. ✅ "Racing" replaces "Tower of Hell"
4. ⏳ Continue building signup form? OR
5. ⏳ Start implementing dynamic tournament system?

**Your Choice:**
- **Option A**: Continue with signup form (keep static tournaments for now, migrate to dynamic later)
- **Option B**: Implement dynamic tournament system first (bigger refactor, more powerful)

**Which direction would you like to go?** 🎯
