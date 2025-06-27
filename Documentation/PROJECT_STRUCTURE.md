# Wealth Bloom - Project Structure

## Overview
Wealth Bloom is a React-based financial planning application built with TypeScript, Vite, and Tailwind CSS. The application focuses on wealth extinction calculations and financial modeling for families.

## Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 10.16.16
- **Icons**: Lucide React 0.344.0
- **Linting**: ESLint with TypeScript support
- **Package Manager**: npm

## Project Structure

```
wealth-bloom/
├── 📁 .bolt/                          # Bolt configuration files
├── 📁 .git/                           # Git version control
├── 📁 dist/                           # Production build output
├── 📁 node_modules/                   # Dependencies (excluded from git)
├── 📁 src/                            # Source code
│   ├── 📁 components/                 # React components
│   │   ├── 📄 AddBillScreen.tsx      # Bill addition interface
│   │   ├── 📄 AddFamilyMemberModal.tsx # Family member management
│   │   ├── 📄 AnimatedResultsReveal.tsx # Results animation component
│   │   ├── 📄 AssetsScreen.tsx       # Assets management screen
│   │   ├── 📄 BillsScreen.tsx        # Bills overview screen
│   │   ├── 📄 ConfirmPaymentScreen.tsx # Payment confirmation
│   │   ├── 📄 DashboardScreen.tsx    # Main dashboard interface
│   │   ├── 📄 EmailCaptureScreen.tsx # Email collection component
│   │   ├── 📄 FamilyBuilderScreen.tsx # Family setup interface
│   │   ├── 📄 FinalDecisionsScreen.tsx # Final decision interface
│   │   ├── 📄 InteractiveWealthTimeline.tsx # Wealth timeline visualization
│   │   ├── 📄 LandingScreen.tsx      # Landing page component
│   │   ├── 📄 LocationScreen.tsx     # Location selection screen
│   │   ├── 📄 OnboardingScreen.tsx   # User onboarding flow
│   │   ├── 📄 ParentBillPopup.tsx    # Parent bill popup modal
│   │   ├── 📄 PaymentSuccessScreen.tsx # Payment success confirmation
│   │   ├── 📄 ProblemSolutionScreen.tsx # Problem/solution presentation
│   │   ├── 📄 SocialShareModal.tsx   # Social sharing functionality
│   │   ├── 📄 ValuePropositionScreen.tsx # Value proposition display
│   │   ├── 📄 WealthCalculatorFlow.tsx # Main calculator workflow
│   │   ├── 📄 WealthCalculatorLanding.tsx # Calculator landing page
│   │   ├── 📄 WealthDeathClock.tsx   # Wealth extinction countdown
│   │   └── 📄 WealthResultsScreen.tsx # Results display screen
│   ├── 📁 types/                      # TypeScript type definitions
│   ├── 📁 utils/                      # Utility functions
│   │   ├── 📄 analytics.ts           # Analytics and tracking utilities
│   │   ├── 📄 validation.ts          # Form validation functions
│   │   └── 📄 wealthCalculations.ts  # Core wealth calculation logic
│   ├── 📄 App.tsx                    # Main application component
│   ├── 📄 index.css                  # Global styles and Tailwind imports
│   ├── 📄 main.tsx                   # Application entry point
│   ├── 📄 vite-env.d.ts              # Vite environment types
│   ├── 📄 logo.png                   # Application logo (1.3MB)
│   └── 📄 logo_2.png                 # Alternative logo (500KB)
├── 📄 .gitignore                      # Git ignore rules
├── 📄 eslint.config.js               # ESLint configuration
├── 📄 index.html                     # HTML entry point
├── 📄 package-lock.json              # Dependency lock file
├── 📄 package.json                   # Project configuration and dependencies
├── 📄 postcss.config.js              # PostCSS configuration
├── 📄 README.md                      # Project documentation
├── 📄 tailwind.config.js             # Tailwind CSS configuration
├── 📄 tsconfig.app.json              # TypeScript app configuration
├── 📄 tsconfig.json                  # TypeScript base configuration
├── 📄 tsconfig.node.json             # TypeScript Node.js configuration
├── 📄 vite.config.ts                 # Vite build configuration
├── 📄 logo_1.png                     # Additional logo asset (348KB)

# 📋 Documentation Files
├── 📄 financil modelling plan.md     # Financial modeling documentation
├── 📄 wealth extinction missing items.md # Missing features list
├── 📄 wealth extinction phase 4.md   # Phase 4 implementation details
├── 📄 wealth extinction phase 3.md   # Phase 3 implementation details
├── 📄 wealth extinction phase 2.md   # Phase 2 implementation details
├── 📄 wealth extinction phase1.md    # Phase 1 implementation details
├── 📄 wireframe wealth extinction.md # UI/UX wireframes
├── 📄 wealth extinction complete epics. md # Complete epic documentation
├── 📄 wealth extinction calcualtion engine tech tasks.md # Calculation engine tasks
├── 📄 wealth extinction epics.md     # Epic requirements
├── 📄 wealth extinction user stories.md # User story documentation
├── 📄 wealth extinction calculator use flow.md # Calculator workflow
├── 📄 revised business plan.md       # Updated business strategy
├── 📄 legacy bloom overall GTM.md    # Legacy go-to-market strategy
├── 📄 wealth extinction GTM.md       # Current go-to-market strategy
├── 📄 wealth extinction tech deepdive.md # Technical architecture details
├── 📄 wealth extinction prd.md       # Product requirements document
└── 📄 wealth extinction tech implementation.md # Technical implementation guide
```

## Key Features & Components

### 🏠 Core Application Flow
1. **Landing & Onboarding** (`LandingScreen.tsx`, `OnboardingScreen.tsx`)
2. **Family Setup** (`FamilyBuilderScreen.tsx`, `AddFamilyMemberModal.tsx`)
3. **Financial Data Collection** (`AssetsScreen.tsx`, `BillsScreen.tsx`, `AddBillScreen.tsx`)
4. **Wealth Calculations** (`WealthCalculatorFlow.tsx`, `wealthCalculations.ts`)
5. **Results & Visualization** (`WealthResultsScreen.tsx`, `AnimatedResultsReveal.tsx`)
6. **Social Sharing** (`SocialShareModal.tsx`)

### 🧮 Calculation Engine
- **Core Logic**: `src/utils/wealthCalculations.ts` (15KB, 488 lines)
- **Validation**: `src/utils/validation.ts`
- **Analytics**: `src/utils/analytics.ts`

### 🎨 UI/UX Components
- **Interactive Timeline**: `InteractiveWealthTimeline.tsx`
- **Death Clock**: `WealthDeathClock.tsx`
- **Value Proposition**: `ValuePropositionScreen.tsx`
- **Problem/Solution**: `ProblemSolutionScreen.tsx`

### 💳 Payment Flow
- **Payment Confirmation**: `ConfirmPaymentScreen.tsx`
- **Success Screen**: `PaymentSuccessScreen.tsx`

## Development Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Configuration Files

### Build Configuration
- **Vite**: `vite.config.ts` - Build tool configuration
- **TypeScript**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **PostCSS**: `postcss.config.js` - CSS processing
- **Tailwind**: `tailwind.config.js` - Utility-first CSS framework

### Code Quality
- **ESLint**: `eslint.config.js` - Code linting and formatting
- **Git**: `.gitignore` - Version control exclusions

## Dependencies

### Production Dependencies
- `react` (^18.3.1) - UI library
- `react-dom` (^18.3.1) - React DOM rendering
- `framer-motion` (^10.16.16) - Animation library
- `lucide-react` (^0.344.0) - Icon library

### Development Dependencies
- `@vitejs/plugin-react` (^4.3.1) - Vite React plugin
- `typescript` (^5.5.3) - Type safety
- `tailwindcss` (^3.4.1) - CSS framework
- `eslint` (^9.9.1) - Code linting
- `autoprefixer` (^10.4.18) - CSS vendor prefixes

## Project Phases

The project is organized into 4 phases with comprehensive documentation:
- **Phase 1**: Initial implementation and core features
- **Phase 2**: Enhanced functionality and user experience
- **Phase 3**: Advanced features and optimizations
- **Phase 4**: Final implementation and polish

## File Size Analysis

### Large Assets
- `src/logo.png` (1.3MB) - Main application logo
- `src/logo_2.png` (500KB) - Alternative logo
- `logo_1.png` (348KB) - Additional logo asset

### Key Components by Size
- `WealthCalculatorFlow.tsx` (19KB) - Main calculator workflow
- `DashboardScreen.tsx` (16KB) - Dashboard interface
- `wealthCalculations.ts` (15KB) - Core calculation logic
- `BillsScreen.tsx` (14KB) - Bills management
- `WealthCalculatorLanding.tsx` (14KB) - Calculator landing

## Development Guidelines

1. **Component Organization**: All React components are in `src/components/`
2. **Utility Functions**: Business logic and helpers in `src/utils/`
3. **Type Safety**: TypeScript types defined in `src/types/`
4. **Styling**: Tailwind CSS classes for consistent design
5. **Animations**: Framer Motion for smooth user interactions

## Next Steps

1. Review the comprehensive documentation files for detailed implementation guidance
2. Follow the phase-based development approach outlined in the documentation
3. Implement missing features identified in `wealth extinction missing items.md`
4. Complete the calculation engine tasks as specified in the technical documentation 