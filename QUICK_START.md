# Quick Start Guide - Lightspeed Onboarding Dashboard

## Immediate Access

The development server is already running!

**Open your browser and visit:**
- **Local:** http://localhost:3000
- **Network:** http://10.0.0.66:3000

---

## What You'll See

### Dashboard View (Default)
1. **Left Panel:**
   - Merchant profile for "Riverside Coffee Co."
   - Current step: Step 5 (Hardware Selection)
   - Next actions with warnings

2. **Right Panel:**
   - Progress overview showing 40% completion
   - Interactive onboarding flow with all 10 steps
   - Three stages clearly distinguished

### Full Flow View (Second Tab)
1. **Cohort Selector:**
   - Three interactive cards
   - Click to switch between Self-Serve, Assisted, and Managed

2. **Complete Journey:**
   - All 10 steps organized by stage
   - Stage 1: Qualify Leads (Steps 1-3)
   - Stage 2: Buying Experience (Steps 4-6)
   - Stage 3: Guided Setup (Steps 7-10)

---

## Interactive Features to Try

### 1. Switch Views
Click the tabs at the top:
- **Dashboard:** Unified merchant view
- **Full Flow:** Complete journey visualization

### 2. Select Different Cohorts
In the Full Flow view, click on the cohort cards:
- Self-Serve (blue)
- Assisted (purple)
- Managed (amber)

Watch the merchant profile update!

### 3. Click on Steps
Click any step card to select it (adds a ring indicator)

### 4. Observe Animations
- Scroll to see entrance animations
- Hover over cards to see scale effects
- Watch the spinning loader on Step 5 (in-progress)

---

## Key Features Highlighted

### Stage Organization
Notice the three stages with distinct colors:
- **Stage 1:** Emerald green (Qualify Leads)
- **Stage 2:** Blue (Buying Experience)
- **Stage 3:** Purple (Guided Setup)

### Progress Tracking
- Overall: 4 out of 10 steps completed (40%)
- Current: Step 5 - Hardware Selection
- Status indicators on each step

### Critical Warnings
Look for the warning box in "Next Actions":
- Currently showing KYB requirement notice
- Different warnings appear based on current step

### Cohort Differences
Switch cohorts to see different:
- Action buttons (Self-Serve vs. Assisted)
- Support team information
- Selling and setup plans

---

## Demo Data

The app is pre-loaded with:
- **Business:** Riverside Coffee Co.
- **Cohort:** Assisted
- **GTV:** $1.2M
- **Locations:** 5
- **Progress:** Steps 1-4 completed, on Step 5
- **AE:** Sarah Johnson
- **IC:** Mike Chen

---

## File Locations

All files are in:
```
/Users/mike.mcmillan/onboarding/
```

**Key directories:**
- `/app` - Main pages
- `/components` - UI components
- `/lib` - Data and utilities
- `/types` - TypeScript definitions

---

## Making Changes

### 1. Edit Demo Data
File: `/app/page.tsx`
Lines: 17-29

Change the merchant state to test different scenarios:
```typescript
const [merchant, setMerchant] = useState<MerchantProfile>({
  cohort: 'self-serve',  // Try: 'assisted', 'managed'
  currentStep: 7,         // Change to any step 1-10
  completedSteps: [1, 2, 3, 4, 5, 6],  // Add/remove steps
  // ... other fields
});
```

### 2. Modify Steps
File: `/lib/onboarding-data.ts`
Edit the `ONBOARDING_STEPS` array

### 3. Adjust Cohort Configurations
File: `/lib/onboarding-data.ts`
Edit the `COHORT_CONFIGS` array

### 4. Update Styles
File: `/app/globals.css`
Modify colors, fonts, or spacing

**Note:** Changes auto-reload in the browser!

---

## Stopping the Server

If you need to stop the development server:
```bash
# Find the process
ps aux | grep "next dev"

# Kill it (replace PID with actual process ID)
kill <PID>
```

Or use Ctrl+C in the terminal where it's running.

---

## Restarting the Server

If you stopped it and want to restart:
```bash
cd /Users/mike.mcmillan/onboarding
npm run dev
```

---

## Building for Production

When ready to deploy:
```bash
cd /Users/mike.mcmillan/onboarding
npm run build
npm start
```

Production optimizations:
- Static page generation
- CSS purging
- Code minification
- Image optimization

---

## Troubleshooting

### Port Already in Use
If port 3000 is taken:
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Dependencies Missing
```bash
cd /Users/mike.mcmillan/onboarding
npm install
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

---

## Documentation

Three documentation files created:

1. **PROJECT_SUMMARY.md** - Complete project overview
   - Architecture
   - Features
   - Tech stack
   - File structure

2. **COMPONENT_GUIDE.md** - Detailed component documentation
   - Props and usage
   - Visual design
   - Animation specs
   - Color reference

3. **README.md** (in project folder) - Standard project README
   - Getting started
   - Installation
   - Project structure
   - Customization guide

---

## Next Steps

### Immediate
1. Explore the dashboard interface
2. Try different cohorts
3. Click through all steps
4. Check responsive layout (resize browser)

### Development
1. Customize demo data
2. Add new steps or stages
3. Integrate with backend API
4. Add authentication

### Production
1. Connect to real data
2. Set up CI/CD
3. Deploy to hosting platform
4. Configure monitoring

---

## Support & Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Framer Motion: https://www.framer.com/motion
- Tailwind CSS: https://tailwindcss.com

**Project Files:**
- Main app: `/app/page.tsx`
- Components: `/components/`
- Data: `/lib/onboarding-data.ts`
- Types: `/types/onboarding.ts`

---

**Happy Coding!**

Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui
