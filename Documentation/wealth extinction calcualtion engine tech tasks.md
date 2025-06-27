# Epic 2: Calculation Engine & Results - Technical Task Breakdown

## Story 2.1: Instant Preview Calculation

### Task 2.1.1: Client-Side Calculation Engine Setup
**Objective**: Create lightweight calculation engine that runs in browser

**Technical Requirements**:
- Pure JavaScript mathematical functions
- No external API dependencies
- Optimized for mobile performance
- Fallback error handling

**Sub-tasks**:
- [ ] **2.1.1a**: Set up calculation utilities module
  - **Libraries**: None (vanilla JS for performance)
  - **Files**: `utils/calculations.js`, `utils/constants.js`
  - **Functions**: Basic compound interest, inflation adjustment, expense modeling

- [ ] **2.1.1b**: Create simplified wealth decay model
  - **Algorithm**: Linear approximation of wealth trajectory
  - **Inputs**: 8 essential user inputs only
  - **Outputs**: Single extinction year estimate
  - **Performance**: <100ms execution time

- [ ] **2.1.1c**: Implement demographic defaults engine
  - **Data Source**: Hardcoded lookup tables by zip code
  - **Libraries**: None (static JSON files)
  - **Files**: `data/demographics.json`, `data/cost-of-living.json`
  - **Size**: <500KB total data files

- [ ] **2.1.1d**: Add input validation layer
  - **Libraries**: `joi` or `yup` for schema validation
  - **Validation**: Range checks, logical consistency
  - **User feedback**: Real-time validation messages
  - **Performance**: <50ms validation time

**Dependencies**:
- Browser APIs: Web Workers (for non-blocking calculation)
- Storage: localStorage for caching results
- Polyfills: None (modern browser only for MVP)

**Performance Targets**:
- Calculation completion: <3 seconds
- Memory usage: <50MB
- Works on iPhone 8+ and equivalent Android

---

### Task 2.1.2: Real-Time Input Processing
**Objective**: Process user inputs and trigger calculations immediately

**Technical Requirements**:
- Debounced input handling
- Progressive calculation as inputs change
- State management for complex form data
- Optimistic UI updates

**Sub-tasks**:
- [ ] **2.1.2a**: Set up form state management
  - **Libraries**: `zustand` or `jotai` (lightweight state management)
  - **Alternative**: React Context + useReducer
  - **State**: User inputs, calculation status, results cache
  - **Persistence**: localStorage with TTL

- [ ] **2.1.2b**: Implement debounced calculation triggers
  - **Libraries**: `lodash.debounce` or custom implementation
  - **Timing**: 300ms debounce for sliders, immediate for dropdowns
  - **Strategy**: Cancel previous calculations when new inputs arrive
  - **Memory**: Clean up abandoned calculation promises

- [ ] **2.1.2c**: Create input transformation pipeline
  - **Purpose**: Convert UI inputs to calculation parameters
  - **Transformations**: Ranges to midpoint values, categorical to numeric
  - **Validation**: Ensure all required inputs present
  - **Error handling**: Graceful degradation for missing data

- [ ] **2.1.2d**: Add calculation progress indicator
  - **UI**: Progress bar with realistic timing
  - **Messages**: Rotating educational content during calculation
  - **Timing**: Synthetic delay if calculation completes too quickly
  - **UX**: Minimum 2-second display time for credibility

**Dependencies**:
- React hooks: useState, useEffect, useCallback, useMemo
- Custom hooks: useDebounce, useLocalStorage
- Performance: React.memo for expensive components

---

### Task 2.1.3: Basic Results Visualization
**Objective**: Display preview results with immediate visual impact

**Technical Requirements**:
- Lightweight charting for mobile
- Animated timeline visualization
- Responsive design for all screen sizes
- Accessibility compliance

**Sub-tasks**:
- [ ] **2.1.3a**: Set up charting library
  - **Primary Option**: Chart.js with react-chartjs-2
  - **Alternative**: Recharts (if bundle size acceptable)
  - **Fallback**: Custom SVG charts for maximum control
  - **Bundle impact**: <100KB additional size

- [ ] **2.1.3b**: Create wealth timeline component
  - **Chart type**: Line chart with area fill
  - **Data points**: Yearly wealth values over 75-year projection
  - **Styling**: Gradient fill, smooth curves, mobile-optimized
  - **Interaction**: Hover tooltips, zoom capability

- [ ] **2.1.3c**: Design extinction date highlight
  - **Visual**: Large, prominent countdown timer
  - **Animation**: Pulsing effect, color transitions
  - **Typography**: Bold, readable fonts
  - **Mobile**: Large touch targets, readable text

- [ ] **2.1.3d**: Add family impact summary
  - **Layout**: Card-based design
  - **Content**: Children's inheritance amounts, ages at extinction
  - **Personalization**: Use actual names if provided
  - **Responsive**: Stack vertically on mobile

**Dependencies**:
- Charting: Chart.js v3+ with date adapters
- Animation: CSS transitions + requestAnimationFrame
- Icons: Lucide React or Heroicons
- Styling: Tailwind CSS utilities

**Performance Considerations**:
- Chart rendering: <500ms on mobile
- Animation: 60fps on modern devices
- Memory: Cleanup chart instances on unmount
- Bundle: Code splitting for chart components

---

## Story 2.2: Enhanced Monte Carlo Calculation

### Task 2.2.1: Server-Side Calculation Architecture
**Objective**: Build robust, scalable calculation engine for enhanced results

**Technical Requirements**:
- Serverless function architecture
- High-precision mathematical calculations
- Concurrent request handling
- Result caching and optimization

**Sub-tasks**:
- [ ] **2.2.1a**: Set up serverless calculation API
  - **Platform**: Vercel Functions or AWS Lambda
  - **Runtime**: Node.js 18+ with TypeScript
  - **Memory**: 1GB allocation for complex calculations
  - **Timeout**: 30-second maximum (well under limit)

- [ ] **2.2.1b**: Implement Monte Carlo simulation engine
  - **Libraries**: 
    - `ml-random` for statistical distributions
    - `simple-statistics` for statistical functions
    - `mathjs` for advanced mathematical operations
  - **Scenarios**: 5000 simulation runs
  - **Variables**: Market returns, inflation, health events, family costs

- [ ] **2.2.1c**: Create correlation matrix for variables
  - **Implementation**: Market correlation modeling
  - **Data**: Historical correlation coefficients
  - **Libraries**: `ml-matrix` for matrix operations
  - **Validation**: Ensure positive definite correlation matrices

- [ ] **2.2.1d**: Add economic cycle modeling
  - **Approach**: Regime-switching models for market conditions
  - **Cycles**: Expansion, recession, recovery phases
  - **Duration**: Variable cycle lengths with probability distributions
  - **Impact**: Adjust returns and volatility by cycle phase

**Dependencies**:
- Runtime: Node.js with npm packages
- Mathematical: ml-random, simple-statistics, mathjs, ml-matrix
- Validation: joi for input validation
- Monitoring: Built-in Vercel analytics

**Infrastructure Requirements**:
- CPU: High-performance compute for mathematical operations
- Memory: 1GB for large matrix operations
- Storage: Redis for result caching
- Monitoring: Error tracking and performance metrics

---

### Task 2.2.2: Advanced Financial Modeling
**Objective**: Implement research-grade financial projection models

**Technical Requirements**:
- Actuarial life expectancy calculations
- Healthcare cost inflation modeling
- Education cost projections
- Estate planning tax calculations

**Sub-tasks**:
- [ ] **2.2.2a**: Implement actuarial calculations
  - **Data Source**: Social Security Administration life tables
  - **Libraries**: Custom implementation with statistical distributions
  - **Factors**: Age, gender, health status, geographic location
  - **Files**: `data/mortality-tables.json`, `utils/actuarial.js`

- [ ] **2.2.2b**: Create healthcare cost model
  - **Inflation**: Higher than general inflation (5.5% annually)
  - **Events**: Probability-based health emergencies
  - **Long-term care**: Age-based probability curves
  - **Geographic**: State-based cost variations

- [ ] **2.2.2c**: Build education cost projections
  - **Inflation**: 6% annual for higher education
  - **Types**: Public state, private, international programs
  - **Financial aid**: Income-based aid calculations
  - **Timeline**: Age-based college entry projections

- [ ] **2.2.2d**: Add estate planning calculations
  - **Federal taxes**: Current and projected tax rates
  - **State taxes**: State-by-state estate tax variations
  - **Professional fees**: Probate vs. planned estate costs
  - **Libraries**: Custom tax calculation engine

**Dependencies**:
- Data sources: Government actuarial tables, education statistics
- Mathematical: Probability distributions, regression analysis
- Validation: Cross-reference with industry standards
- Updates: Quarterly data refresh mechanisms

---

### Task 2.2.3: Results Enhancement & Transition
**Objective**: Smoothly update preview results with enhanced calculations

**Technical Requirements**:
- Seamless UI transitions
- Result comparison and validation
- Confidence interval calculations
- Progressive result enhancement

**Sub-tasks**:
- [ ] **2.2.3a**: Create result comparison engine
  - **Purpose**: Compare preview vs. enhanced results
  - **Validation**: Flag major discrepancies for review
  - **Confidence**: Calculate statistical confidence intervals
  - **Fallback**: Use preview results if enhancement fails

- [ ] **2.2.3b**: Implement smooth result transitions
  - **Animation**: Morph charts from preview to enhanced data
  - **Libraries**: Framer Motion or CSS transitions
  - **Timing**: 2-3 second transition duration
  - **User feedback**: "Results now 99% accurate" message

- [ ] **2.2.3c**: Add sensitivity analysis
  - **Variables**: Key inputs that most affect outcome
  - **Calculations**: Partial derivatives or finite differences
  - **Presentation**: Ranked list of wealth destroyers
  - **Interaction**: Click to see detailed impact

- [ ] **2.2.3d**: Implement result caching strategy
  - **Cache key**: Hash of normalized inputs
  - **Storage**: Redis with 24-hour TTL
  - **Invalidation**: Clear cache on model updates
  - **Performance**: <100ms cache lookup

**Dependencies**:
- Animation: Framer Motion or similar
- Caching: Redis or in-memory cache
- Hashing: Built-in crypto for cache keys
- Monitoring: Cache hit rates and performance

---

## Story 2.3: Interactive Results Exploration

### Task 2.3.1: Interactive Chart Components
**Objective**: Enable rich interaction with calculation results

**Technical Requirements**:
- Hover tooltips with detailed information
- Zoom and pan capabilities
- Scenario switching
- Real-time calculation updates

**Sub-tasks**:
- [ ] **2.3.1a**: Enhanced timeline chart component
  - **Libraries**: D3.js with React integration or Recharts
  - **Features**: Hover tooltips, zoom controls, annotation markers
  - **Data**: Multi-scenario display with confidence bands
  - **Performance**: Smooth interactions at 60fps

- [ ] **2.3.1b**: Create generational wealth visualization
  - **Type**: Waterfall chart or family tree diagram
  - **Libraries**: D3.js for custom visualizations
  - **Data**: Wealth transfer at each generation
  - **Interaction**: Click generations for detailed breakdown

- [ ] **2.3.1c**: Build wealth destroyer breakdown chart
  - **Type**: Stacked bar or treemap visualization
  - **Libraries**: Chart.js or D3.js
  - **Data**: Ranked impact of different factors
  - **Interaction**: Click categories for detailed explanations

- [ ] **2.3.1d**: Add scenario comparison view
  - **Layout**: Side-by-side or overlay comparison
  - **Controls**: Toggle switches for different scenarios
  - **Animation**: Smooth transitions between scenarios
  - **Mobile**: Swipe between scenarios on touch devices

**Dependencies**:
- Visualization: D3.js v7+, React integration patterns
- Charts: Chart.js with custom plugins or Recharts
- Animation: CSS transitions + JavaScript
- Mobile: Touch event handling, gesture recognition

---

### Task 2.3.2: Real-Time Assumption Adjustment
**Objective**: Allow users to modify key assumptions and see immediate impact

**Technical Requirements**:
- Slider controls for key variables
- Instant recalculation
- Before/after comparison
- Assumption persistence

**Sub-tasks**:
- [ ] **2.3.2a**: Create assumption adjustment panel
  - **Controls**: Range sliders for key variables
  - **Variables**: Investment returns, inflation, major expenses
  - **Libraries**: React components with custom styling
  - **Validation**: Reasonable ranges with warnings for extremes

- [ ] **2.3.2b**: Implement real-time recalculation
  - **Strategy**: Simplified calculation for immediate feedback
  - **Debouncing**: 200ms delay to avoid excessive calculations
  - **Web Workers**: Offload calculation from main thread
  - **Fallback**: Show previous results if calculation fails

- [ ] **2.3.2c**: Add before/after comparison
  - **Visual**: Split view or overlay showing original vs. adjusted
  - **Highlighting**: Color-coded improvements/deterioration
  - **Metrics**: Show specific impact (years gained/lost)
  - **Reset**: Option to return to original assumptions

- [ ] **2.3.2d**: Save custom scenarios
  - **Storage**: localStorage for anonymous users
  - **Naming**: User-defined scenario labels
  - **Sharing**: Generate shareable URLs for custom scenarios
  - **Limits**: Maximum 5 saved scenarios for performance

**Dependencies**:
- UI Components: Custom range sliders, toggle switches
- State Management: Complex state for multiple scenarios
- Performance: Web Workers API
- Storage: localStorage with compression

---

### Task 2.3.3: Family Impact Deep Dive
**Objective**: Provide detailed, personalized family impact analysis

**Technical Requirements**:
- Individual family member projections
- Life stage milestone mapping
- Educational cost breakdowns
- Parent care impact analysis

**Sub-tasks**:
- [ ] **2.3.3a**: Create family member profile cards
  - **Data**: Individual inheritance projections by family member
  - **Timeline**: Show inheritance at different life stages
  - **Personalization**: Use provided names and current ages
  - **Scenarios**: How protection changes individual outcomes

- [ ] **2.3.3b**: Build milestone timeline visualization
  - **Events**: College, marriage, home buying, retirement
  - **Overlap**: Show family events with wealth trajectory
  - **Libraries**: Timeline.js or custom D3 implementation
  - **Interaction**: Click events for detailed explanations

- [ ] **2.3.3c**: Education cost breakdown calculator
  - **Granularity**: Per-child education cost projections
  - **Variables**: Public vs. private, state vs. out-of-state
  - **Inflation**: Education-specific inflation rates
  - **Financial aid**: Income-based aid projections

- [ ] **2.3.3d**: Parent care impact analysis
  - **Scenarios**: Different levels of care involvement
  - **Costs**: Geographic-based care cost projections
  - **Duration**: Actuarial-based care duration estimates
  - **Coordination**: Multi-sibling care cost sharing

**Dependencies**:
- Timeline: Custom timeline component or library
- Data: Education cost databases, care cost data
- Calculations: Age-based projections, inflation modeling
- Personalization: Dynamic content generation

---

## Technical Infrastructure & Dependencies

### Core Libraries & Packages

**Client-Side Calculation**:
```json
{
  "dependencies": {
    "zustand": "^4.4.0",
    "joi": "^17.9.0",
    "lodash.debounce": "^4.0.8",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  }
}
```

**Server-Side Calculation**:
```json
{
  "dependencies": {
    "ml-random": "^2.0.3",
    "simple-statistics": "^7.8.0",
    "mathjs": "^11.11.0",
    "ml-matrix": "^6.10.7",
    "joi": "^17.9.0"
  }
}
```

**Interactive Visualization**:
```json
{
  "dependencies": {
    "d3": "^7.8.5",
    "framer-motion": "^10.16.0",
    "recharts": "^2.8.0"
  }
}
```

### Performance Requirements

**Client-Side**:
- Bundle size: <200KB for calculation engine
- Execution time: <3 seconds for preview calculation
- Memory usage: <50MB total
- Mobile compatibility: iOS 12+, Android 8+

**Server-Side**:
- Function duration: <15 seconds for enhanced calculation
- Memory allocation: 1GB for Monte Carlo simulations
- Cold start: <2 seconds function initialization
- Concurrent requests: 100+ simultaneous calculations

### Data Requirements

**Static Data Files**:
- Demographics by zip code: ~2MB compressed
- Mortality tables: ~500KB
- Education cost data: ~100KB
- Tax rate tables: ~50KB

**API Integrations**:
- Census API: For real-time demographic validation
- BLS API: For inflation and economic data
- Educational statistics: For cost projections

### Error Handling & Fallbacks

**Client-Side Failures**:
- Web Worker not available: Fall back to main thread
- Calculation error: Use simplified linear model
- Data missing: Use national averages
- Storage full: Clear old cached results

**Server-Side Failures**:
- Timeout: Return preview results with disclaimer
- Memory overflow: Reduce simulation scenarios
- API failure: Use cached demographic data
- Invalid input: Return error with guidance

### Testing Strategy

**Unit Testing**:
- Mathematical functions: Verify calculation accuracy
- Input validation: Test edge cases and invalid inputs
- State management: Test complex user interaction flows
- Chart components: Visual regression testing

**Integration Testing**:
- Client-server communication: Test API contracts
- Real-time updates: Test smooth result transitions
- Cross-browser: Test calculation consistency
- Performance: Load testing for viral traffic spikes

**End-to-End Testing**:
- Complete user journeys: Input to results
- Mobile experience: Touch interactions and performance
- Error scenarios: Network failures and invalid inputs
- Accessibility: Screen reader compatibility

This technical breakdown provides the foundation for implementing a robust, scalable calculation engine that delivers both immediate emotional impact and research-grade accuracy.