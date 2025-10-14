# Lightspeed Onboarding Dashboard

A modern, interactive visualization of the cohort-based merchant onboarding system for X-Series and Lightspeed Payments.

## Overview

A complete Next.js application that visualizes and manages the cohort-based merchant onboarding system for X-Series and Lightspeed Payments. The application features:

- **Marketing Landing Page** - Public-facing site with product information
- **Get Started Flow** - 4-step merchant signup and onboarding
- **Merchant Dashboard** - Post-signup dashboard with 7 distinct sections
- **Admin Panel** - Operations team view for monitoring all merchants

This prototype demonstrates the complete merchant journey with interactive UI, smooth animations, and responsive design.

### Three-Stage Flow

1. **Qualify Leads** (Steps 1-3)
   - Lead capture
   - Account creation & profiling
   - KYB qualification

2. **Buying Experience** (Steps 4-6)
   - Software selection
   - Hardware selection
   - Purchase & payment

3. **Guided Setup** (Steps 7-10)
   - KYC & payments activation
   - Data import
   - Bank account connection
   - Hardware setup & go-live

### Merchant Cohorts

- **Self-Serve**: <$500K GTV, 1-3 locations
- **Assisted**: $500K-$2M GTV, 3-10 locations
- **Managed**: $2M+ GTV, 10+ locations

## Features

- Interactive onboarding flow visualization
- Real-time progress tracking
- Cohort-specific experience paths
- Stage and step completion indicators
- Merchant profile dashboard
- Next actions panel with critical warnings
- Smooth animations and transitions
- Fully responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page
│   ├── get-started/        # Merchant signup flow
│   ├── dashboard/          # Merchant dashboard (7 pages)
│   ├── admin/              # Admin panel
│   ├── onboarding/         # Onboarding flow view
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard components
│   ├── merchant/           # Merchant flow components
│   ├── admin/              # Admin panel components
│   ├── get-started/        # Get started flow components
│   └── [other components]  # Shared components
├── lib/
│   ├── onboarding-data.ts  # Data models and constants
│   └── utils.ts            # Utility functions
├── data/
│   └── mock-merchants.ts   # Mock merchant data
└── types/
    └── onboarding.ts       # TypeScript type definitions
```

## Key Components

### Dashboard View
- Merchant profile panel showing GTV, locations, and cohort assignment
- Overall progress overview with stage breakdown
- Next actions panel with critical warnings
- Interactive onboarding flow

### Full Flow View
- Cohort selector with detailed configurations
- Complete 10-step journey visualization
- Stage-based organization with visual connectors
- Step cards showing data collection requirements

## Data Flow

Each step tracks:
- Step ID and title
- Description and stage assignment
- Completion status (pending, in-progress, completed, blocked)
- Data collection requirements
- Critical dependencies (e.g., KYB before hardware purchase)

## Critical Flow Requirements

1. **KYB Before Hardware Purchase**: Step 3 must complete before Step 5
2. **Payouts Held Until Bank Verification**: Step 9 enables payouts after verification
3. **Cohort-Specific Paths**: Different experiences for self-serve, assisted, and managed merchants

## Customization

### Adding New Steps

1. Update `ONBOARDING_STEPS` in `/lib/onboarding-data.ts`
2. Assign to appropriate stage
3. Define data collection requirements

### Modifying Cohorts

1. Edit `COHORT_CONFIGS` in `/lib/onboarding-data.ts`
2. Update thresholds and descriptions
3. Adjust cohort-specific logic in components

### Styling

- Theme customization: `/app/globals.css`
- Component styles: Tailwind classes in component files
- shadcn/ui theme: `tailwind.config.ts`

## Build for Production

```bash
npm run build
npm start
```

## Future Enhancements

- Backend integration for real merchant data
- Real-time progress updates
- AE/IC assignment workflow
- Stall detection and alerts
- Analytics dashboard
- A/B testing framework
- Multi-merchant management view

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Documentation Index](./docs/INDEX.md)** - Complete guide to all documentation
- **[Quick Start](./docs/00-getting-started/QUICK_START.md)** - Developer setup guide
- **[Product Requirements](./docs/01-product/merchant_onboarding_prd_revised.md)** - Full PRD
- **[Design Specifications](./docs/02-design/DESIGN_SPECIFICATIONS.md)** - Complete design specs
- **[Component Guide](./docs/03-implementation/COMPONENT_IMPLEMENTATION_GUIDE.md)** - Implementation details

## License

Copyright Lightspeed Commerce Inc.

---

**Built with**: Next.js 15.5.4, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion
**Last Updated**: October 2025
