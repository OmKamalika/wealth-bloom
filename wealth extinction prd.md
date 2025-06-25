# Wealth Extinction Calculator™ - Product Requirements Document

## Version 1.0 | Launch Asset for Legacy Guardian Platform

---

## 1. Executive Summary

### 1.1 Product Vision
The Wealth Extinction Calculator is a viral, free tool that reveals when families will lose their wealth completely, creating visceral awareness of the "silent financial extinction" crisis while building our launch audience.

### 1.2 Strategic Objectives
- **Awareness**: Make wealth extinction tangible and personal
- **Lead Generation**: Build email list of 10,000+ qualified prospects
- **Social Proof**: Generate organic sharing and media coverage
- **Market Education**: Position Legacy Guardian as the solution category creator

### 1.3 Success Metrics
- **Primary**: 50,000+ calculator completions in first 6 months
- **Secondary**: 15% email capture rate, 25% social sharing rate
- **Tertiary**: 100+ media mentions, 5,000+ organic backlinks

---

## 2. Product Overview

### 2.1 Core Experience Flow
```
Landing → Input (2 mins) → Shock Revelation → Educational Context → Call-to-Action → Sharing
```

### 2.2 Emotional Journey Design
1. **Curiosity** ("How long will my wealth last?")
2. **Confidence** ("I'm probably fine...")
3. **Shock** ("My grandchildren will inherit ZERO?!")
4. **Understanding** ("This is a real crisis...")
5. **Hope** ("But it can be prevented...")
6. **Action** ("I need to learn more")

---

## 3. Functional Requirements

### 3.1 Data Input Interface

#### 3.1.1 Progressive Disclosure Design
**Step 1: Basic Profile (30 seconds)**
- Current age (slider: 25-65)
- Marital status (single/married)
- Number of children (0-5+)
- Location (state dropdown - affects inheritance laws)

**Step 2: Wealth Snapshot (60 seconds)**
- Current net worth (slider: $0-$5M+)
  - Smart defaults based on age/location
  - Helpful context: "Include home equity, investments, savings"
- Annual household income (dropdown ranges)
- Monthly essential expenses (auto-calculated based on location, adjustable)

**Step 3: Family Context (30 seconds)**
- Aging parents status:
  - ☐ Parents financially independent
  - ☐ Provide occasional support ($X/month)
  - ☐ Significant care costs expected
  - ☐ Already managing parent finances
- Children's futures:
  - ☐ Public school → state college
  - ☐ Private school → state college  
  - ☐ Private school → private college
  - ☐ International/premium education

#### 3.1.2 Smart Input Features
- **Auto-suggestions**: Based on zip code demographics
- **Reality checks**: "This seems high/low for your area - adjust?"
- **Progress indicators**: "2 of 3 steps complete"
- **Save & resume**: Browser localStorage for incomplete sessions
- **Mobile optimization**: Thumb-friendly sliders and touch targets

### 3.2 Calculation Engine

#### 3.2.1 Wealth Extinction Algorithm
```python
def calculate_wealth_extinction(inputs):
    # Base wealth trajectory
    starting_wealth = inputs.net_worth
    annual_income_growth = 0.03  # Conservative
    annual_spending_growth = 0.035  # Slightly above income
    investment_return = 0.05  # Conservative portfolio
    
    # Sandwich generation modifiers
    parent_care_shock = calculate_parent_care_costs(inputs.parent_status)
    education_costs = calculate_education_trajectory(inputs.children_education)
    lifestyle_inflation = calculate_lifestyle_creep(inputs.income_level)
    
    # Generational wealth transfer
    inheritance_tax_impact = calculate_estate_taxes(inputs.state)
    next_gen_financial_literacy = 0.3  # 70% lose wealth due to poor management
    asset_fragmentation_loss = 0.15  # Legal fees, family disputes
    
    # Monte Carlo simulation (1000 iterations)
    scenarios = run_wealth_simulation(
        base_params=base_trajectory,
        risk_factors=[parent_care_shock, education_costs, lifestyle_inflation],
        generational_transfers=[inheritance_tax_impact, financial_literacy, fragmentation],
        generations=3
    )
    
    return {
        'extinction_year': median_extinction_year,
        'confidence_interval': (p25_extinction, p75_extinction),
        'primary_causes': ranked_wealth_destroyers,
        'generational_impact': wealth_by_generation,
        'prevention_opportunities': intervention_points
    }
```

#### 3.2.2 Scenario Modeling
**Base Case**: Conservative assumptions, steady-state lifestyle
**Optimistic Case**: 20% better investment returns, no major family crises
**Pessimistic Case**: Market downturns, extended parent care, multiple family emergencies

**Special Calculations**:
- **Parent Care Shock Modeling**: 
  - Independent parents: 5% wealth impact over 20 years
  - Occasional support: 15% wealth impact
  - Significant care expected: 35% wealth impact
  - Currently managing: 45% wealth impact

- **Education Cost Trajectories**:
  - Public track: $80K total per child (today's dollars)
  - Private track: $200K total per child
  - Premium track: $400K+ total per child

### 3.3 Results Visualization Engine

#### 3.3.1 Primary Shock Revelation
**Wealth Extinction Countdown**
```javascript
// Animated countdown showing years until wealth = $0
<div className="extinction-countdown">
  <div className="countdown-number">{extinctionYear}</div>
  <div className="countdown-label">Year Your Family Wealth Dies</div>
  <div className="current-year">Current Year: 2025</div>
  <div className="years-remaining">{extinctionYear - 2025} Years Remaining</div>
</div>

// Animated wealth decay visualization
<WealthTimelineChart 
  data={wealthByYear}
  currentYear={2025}
  extinctionYear={extinctionYear}
  generationMarkers={[userGeneration, childrenGeneration, grandchildrenGeneration]}
/>
```

#### 3.3.2 Generational Impact Visualization
**Family Tree with Wealth Inheritance**
- User's generation: Current wealth
- Children's generation: Projected inheritance (often 50-70% less)
- Grandchildren's generation: Projected inheritance (usually $0)
- Great-grandchildren: "The wealth extinction generation"

**Interactive Elements**:
- Hover over generations to see detailed breakdowns
- Toggle between optimistic/pessimistic scenarios
- "What if" sliders for key variables

#### 3.3.3 Emotional Amplification Features
**Personalization Elements**:
- Use actual child names if provided
- Show child's age at extinction date
- Calculate grandchildren's likely college years
- Local cost-of-living context

**Visceral Details**:
- "Your daughter Emma will inherit $23,000 instead of $340,000"
- "Your grandchildren's college fund: $0"
- "Wealth that survived your ancestors for 150+ years ends with Generation 3"

### 3.4 Educational Context Layer

#### 3.4.1 "Why This Happens" Section
**The 70/90 Rule Education**
- Interactive infographic: "70% of families lose wealth by generation 2"
- Historical examples: Vanderbilt, Getty, Kennedy families
- Research citations: Federal Reserve wealth transfer studies

**Common Wealth Destroyers** (ranked by user's profile)
1. Unplanned parent care costs
2. Educational expenses without strategy
3. Lack of financial education for next generation
4. Estate planning delays and legal fees
5. Asset fragmentation and family conflicts

#### 3.4.2 Prevention Teaser Content
**"But It Doesn't Have To Be This Way"**
- Success stories: Families who broke the cycle
- Simple intervention impact: "A $500 investment in estate planning saves $50,000 in legal fees"
- Compound effect visualization: "Starting protection 5 years earlier = $200K more family wealth"

### 3.5 Call-to-Action & Lead Capture

#### 3.5.1 Primary CTA Strategy
**Immediate Value Exchange**
```html
<div className="cta-primary">
  <h3>Get Your Free Family Wealth Protection Plan</h3>
  <p>Receive a personalized 5-step plan to stop your wealth extinction countdown</p>
  
  <form className="email-capture">
    <input type="email" placeholder="Enter your email for instant access" />
    <button>Send My Protection Plan</button>
  </form>
  
  <div className="trust-signals">
    ✓ 2,847 families already protected their wealth
    ✓ Average wealth extension: +12.3 years
    ✓ No spam, unsubscribe anytime
  </div>
</div>
```

#### 3.5.2 Secondary CTAs
**Social Sharing Encouragement**
- "Share this wake-up call with other parents"
- Pre-written social media posts
- LinkedIn article template for professionals

**Further Education**
- "Download: The Family Wealth Extinction Crisis Report (23 pages)"
- "Join: Free webinar - 'How to Add 10+ Years to Your Wealth Timeline'"

### 3.6 Viral Mechanics

#### 3.6.1 Shareability Features
**Social-Optimized Results**
```html
<!-- Custom social sharing with personalized messaging -->
<meta property="og:title" content="My family's wealth will be extinct by 2067 😱" />
<meta property="og:description" content="I just discovered my grandchildren will inherit $0. This calculator shows the shocking truth about family wealth extinction." />
<meta property="og:image" content="/dynamic-og-image.jpg?extinction=2067&generation=3" />

<!-- Twitter card with dynamic content -->
<meta name="twitter:title" content="Family wealth extinction countdown: 42 years remaining" />
```

**Comparison Mechanics**
- "See how your wealth timeline compares to others in your area"
- Anonymous aggregate data: "73% of families in your zip code face extinction within 50 years"
- Peer benchmarking: "You're in the top 23% for wealth longevity in your age group"

#### 3.6.2 Community Features
**Wealth Extinction Leaderboard**
- Anonymous rankings by wealth longevity
- State/city comparisons
- Age group benchmarks

**Family Challenge Mode**
- "Challenge your siblings to test their wealth timeline"
- Family group calculations
- Collaborative prevention planning

---

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework**: Next.js 14 with TypeScript for SEO optimization
- **Styling**: Tailwind CSS with custom animations
- **Charts**: D3.js for interactive wealth timelines
- **Analytics**: Google Analytics 4 + Mixpanel for detailed user behavior
- **A/B Testing**: Vercel Edge Config for rapid iteration

### 4.2 Backend Requirements
- **API**: Serverless functions (Vercel/Netlify) for calculation engine
- **Database**: Supabase for email capture and anonymous analytics
- **Email**: ConvertKit API for immediate delivery of protection plans
- **File Storage**: AWS S3 for generated reports and social sharing images

### 4.3 Performance Requirements
- **Page Load**: <1.5 seconds on mobile 3G
- **Calculation Speed**: <3 seconds for complete wealth projection
- **Uptime**: 99.9% availability during marketing campaigns
- **Mobile Optimization**: <2MB total page weight
- **SEO**: Perfect Core Web Vitals scores

### 4.4 Analytics & Tracking
**User Journey Analytics**
- Input completion rates by step
- Exit points and drop-off analysis
- Time spent on results page
- Social sharing conversion rates

**A/B Testing Framework**
- Headline variations
- Visual design alternatives
- CTA button copy and placement
- Email capture form variations

---

## 5. User Experience Design

### 5.1 Visual Design Language
**Emotional Design System**
- **Colors**: Deep reds for extinction, greens for protection, gold for wealth
- **Typography**: Sans-serif for readability, serif for trust elements
- **Iconography**: Family-focused, financial security themes
- **Animations**: Smooth transitions that enhance emotional impact

### 5.2 Mobile-First Experience
**Touch-Optimized Interface**
- Large finger-friendly sliders
- Swipe navigation between steps
- Thumb-zone CTA placement
- Readable text without zooming

### 5.3 Accessibility Requirements
- **WCAG 2.1 AA compliance**
- **Screen reader optimization**
- **High contrast mode support**
- **Keyboard navigation**
- **Alternative text for all graphics**

### 5.4 Error Handling & Edge Cases
**Input Validation**
- Reasonable range checking with helpful messages
- "Are you sure?" confirmations for extreme values
- Graceful handling of incomplete data

**Calculation Edge Cases**
- Very high/low net worth scenarios
- Single parents and blended families
- No children or elderly user scenarios
- International users (basic version)

---

## 6. Content Strategy

### 6.1 Copy Writing Principles
**Tone**: Urgent but not fear-mongering, educational but not preachy
**Language**: 8th grade reading level maximum
**Emotional Arc**: Curiosity → Shock → Understanding → Hope → Action

### 6.2 Key Messages
**Primary Message**: "Your family's wealth has an expiration date - but you can extend it"
**Supporting Messages**:
- "70% of family wealth disappears by generation 2"
- "The sandwich generation unknowingly accelerates wealth extinction"
- "Small changes today prevent massive losses tomorrow"

### 6.3 Educational Content
**Micro-Learning Modules**
- 1-minute explanations of wealth extinction causes
- Success story snippets
- Quick prevention tips
- Statistical context for user's situation

---

## 7. Integration Requirements

### 7.1 Email Marketing Integration
**ConvertKit Automation**
- Immediate delivery: Personalized wealth protection plan
- Follow-up sequence: Educational email series (7 days)
- Segmentation: By wealth level, family situation, urgency score

### 7.2 Social Media Integration
**Platform-Specific Sharing**
- LinkedIn: Professional/business angle
- Facebook: Family protection focus
- Twitter: Statistical shock value
- WhatsApp: Private family sharing

### 7.3 Analytics Integration
**Multi-Platform Tracking**
- Google Analytics 4 for web analytics
- Facebook Pixel for ad retargeting
- LinkedIn Insight Tag for B2B targeting
- Custom events for product funnel analysis

---

## 8. Security & Privacy

### 8.1 Data Collection Philosophy
**Minimal Data Collection**
- No financial account access required
- Anonymous calculations (no login needed)
- Optional email for results delivery only
- Clear data usage policy

### 8.2 Privacy Compliance
- **GDPR compliance** for European visitors
- **CCPA compliance** for California residents
- **Clear opt-out mechanisms**
- **No sale of personal data**
- **Transparent privacy policy**

### 8.3 Security Measures
- **HTTPS encryption** for all data transmission
- **Input sanitization** to prevent injection attacks
- **Rate limiting** to prevent abuse
- **No sensitive data storage** (calculations performed client-side when possible)

---

## 9. Success Metrics & KPIs

### 9.1 Primary Metrics
**User Engagement**
- Calculator completion rate: Target 75%
- Time on results page: Target 3+ minutes
- Email capture rate: Target 15%
- Social sharing rate: Target 25%

**Lead Quality**
- Email open rates: Target 45%
- Click-through rates: Target 12%
- Webinar attendance: Target 8%
- Product waitlist conversion: Target 5%

### 9.2 Viral Metrics
**Organic Growth**
- Social media mentions: Target 1,000/month
- Organic backlinks: Target 500 in first 6 months
- Direct traffic growth: Target 20%/month
- Brand search volume: Target 10x increase

**Media Coverage**
- Tier 1 publications: Target 5 articles
- Podcast mentions: Target 20 shows
- Industry blog coverage: Target 50 mentions
- Social media influencer shares: Target 100

### 9.3 Business Impact
**Pipeline Generation**
- Qualified leads: Target 2,500 in first 6 months
- Sales-ready leads: Target 500
- Product pre-orders: Target 100
- Revenue pipeline value: Target $500K

---

## 10. Launch Readiness Checklist

### 10.1 Technical Requirements
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsiveness testing
- [ ] Page speed optimization (<1.5s load time)
- [ ] Analytics implementation and testing
- [ ] Email automation setup and testing
- [ ] Social sharing functionality testing
- [ ] Error handling and edge case testing

### 10.2 Content Requirements
- [ ] All copy finalized and approved
- [ ] Educational content created
- [ ] Email sequences written and scheduled
- [ ] Social media templates created
- [ ] Press kit and media materials prepared
- [ ] Legal disclaimers and privacy policy updated

### 10.3 Marketing Readiness
- [ ] GTM strategy finalized
- [ ] Influencer outreach list prepared
- [ ] Paid advertising campaigns created
- [ ] PR strategy and media list ready
- [ ] Launch event or webinar planned
- [ ] Community seeding strategy prepared

---

This calculator serves as our primary customer acquisition engine, transforming abstract wealth extinction statistics into personal, visceral awareness that drives action. Every element is designed to maximize emotional impact while building trust and authority for the full Legacy Guardian platform.