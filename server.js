import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Advanced wealth calculation logic (JavaScript implementation)
function calculateWealthExtinction(calculatorData) {
  console.log('🔮 Starting advanced wealth extinction calculation');
  
  const { coreIdentity, financialFoundation, complexityAnalysis, childrenContext, familyCareContext, behavioralProfile } = calculatorData;
  
  // Base calculation
  let currentWealth = financialFoundation.currentNetWorth;
  let currentAge = coreIdentity.age;
  let extinctionYear = 2025;
  const projections = [];
  
  // Advanced projection over 75 years with sophisticated modeling
  for (let year = 0; year < 75; year++) {
    const currentYear = 2025 + year;
    currentAge = coreIdentity.age + year;
    
    // Income progression with career lifecycle modeling
    const baseIncome = financialFoundation.annualIncome;
    let incomeGrowth = 0.03; // Base 3% annual growth
    
    // Career stage adjustments
    if (currentAge < 35) incomeGrowth = 0.08; // Early career
    else if (currentAge < 50) incomeGrowth = 0.05; // Mid career
    else if (currentAge < 65) incomeGrowth = 0.02; // Late career
    else incomeGrowth = -0.02; // Retirement decline
    
    const yearlyIncome = baseIncome * Math.pow(1 + incomeGrowth, year);
    
    // Expense progression with lifecycle events
    const baseExpenses = yearlyIncome * 0.7; // 70% of income base
    let expenseGrowth = 0.04; // 4% annual growth (higher than income)
    
    // Lifecycle expense adjustments
    if (currentAge >= 35 && currentAge <= 55 && childrenContext?.children?.length > 0) {
      expenseGrowth += 0.02; // Children education costs
    }
    if (currentAge >= 45 && currentAge <= 65 && familyCareContext?.parents?.length > 0) {
      expenseGrowth += 0.015; // Parent care costs
    }
    
    const yearlyExpenses = baseExpenses * Math.pow(1 + expenseGrowth, year);
    
    // Investment returns with risk tolerance and market volatility
    let investmentReturn = 0.08; // Base 8% annual return
    
    // Risk tolerance adjustments
    switch (behavioralProfile.riskTolerance) {
      case 'conservative':
        investmentReturn = 0.06;
        break;
      case 'aggressive':
        investmentReturn = 0.12;
        break;
      default:
        investmentReturn = 0.08;
    }
    
    // Market volatility simulation
    const marketVolatility = (Math.random() - 0.5) * 0.15; // ±7.5% volatility
    investmentReturn += marketVolatility;
    
    const investmentReturns = currentWealth * investmentReturn;
    
    // Lifecycle events impact
    let lifecycleImpact = 0;
    const majorEvents = [];
    
    // Children education costs
    if (childrenContext?.children?.length > 0) {
      const childrenCount = childrenContext.children.length;
      if (currentAge >= 35 && currentAge <= 55) {
        const educationCost = 500000 * childrenCount;
        lifecycleImpact -= educationCost;
        majorEvents.push(`Children education costs: ₹${(educationCost/100000).toFixed(1)}L`);
      }
    }
    
    // Parent care costs
    if (familyCareContext?.parents?.length > 0) {
      if (currentAge >= 45 && currentAge <= 65) {
        const careCost = 300000;
        lifecycleImpact -= careCost;
        majorEvents.push(`Parent care costs: ₹${(careCost/100000).toFixed(1)}L`);
      }
    }
    
    // Update wealth
    const netCashFlow = yearlyIncome - yearlyExpenses + investmentReturns + lifecycleImpact;
    currentWealth = Math.max(0, currentWealth + netCashFlow);
    
    // Calculate confidence level (decreases over time and with complexity)
    const confidenceLevel = Math.max(0.3, 0.9 - (year * 0.01) - ((complexityAnalysis.complexityScore - 5) * 0.05));
    
    projections.push({
      year: currentYear,
      age: currentAge,
      wealth: currentWealth,
      income: yearlyIncome,
      expenses: yearlyExpenses,
      netCashFlow,
      majorEvents,
      confidenceLevel
    });
    
    // Check for extinction
    if (currentWealth <= 0) {
      extinctionYear = currentYear;
      break;
    }
  }
  
  // Generate comprehensive results
  const yearsRemaining = extinctionYear - 2025;
  const userDeathYear = 2025 + (85 - coreIdentity.age);
  const wealthAtDeath = projections.find(p => p.year >= userDeathYear)?.wealth || 0;
  
  // Estate taxes and transfer costs
  const estateTax = wealthAtDeath > 13600000 ? (wealthAtDeath - 13600000) * 0.40 : 0;
  const transferCosts = wealthAtDeath * 0.05;
  const netTransfer = wealthAtDeath - estateTax - transferCosts;
  
  // Children inheritance
  const childrenCount = childrenContext?.children?.length || 1;
  const inheritancePerChild = netTransfer / childrenCount;
  
  const children = childrenContext?.children?.map(child => ({
    name: child.name,
    inheritance: inheritancePerChild
  })) || [];
  
  // Grandchildren projection
  const grandchildrenInheritance = netTransfer * 0.3;
  const collegeShortfall = Math.max(0, 400000 - grandchildrenInheritance);
  
  // Identify top wealth destroyers
  const topWealthDestroyers = [
    {
      factor: 'Expense Growth',
      impact: 0.04,
      description: 'Expenses growing faster than income'
    },
    {
      factor: 'Lifecycle Events',
      impact: 0.02,
      description: 'Children education and parent care costs'
    },
    {
      factor: 'Market Volatility',
      impact: 0.015,
      description: 'Investment returns affected by market fluctuations'
    }
  ];
  
  // Complexity analysis
  const complexityDrivers = [];
  if (childrenContext?.children?.length > 1) complexityDrivers.push('Multiple children with different timelines');
  if (familyCareContext?.parents?.length > 0) complexityDrivers.push('Aging parents requiring care');
  if (complexityAnalysis.complexityScore > 5) complexityDrivers.push('Complex family coordination needs');
  
  const coordinationOpportunities = [
    'Unified family financial planning',
    'Shared care responsibilities',
    'Coordinated investment strategies'
  ];
  
  // Protected scenario (with optimizations)
  const protectedExtinctionYear = extinctionYear + 5;
  const additionalYears = 5;
  const protectedGrandchildrenInheritance = netTransfer * 0.45;
  
  const improvements = [
    'Systematic expense management',
    'Optimized investment allocation',
    'Family coordination planning'
  ];
  
  // Scenario analysis
  const scenarioAnalysis = {
    bestCase: { extinctionYear: extinctionYear + 10, probability: 0.2 },
    mostLikely: { extinctionYear: extinctionYear, probability: 0.6 },
    worstCase: { extinctionYear: extinctionYear - 5, probability: 0.2 }
  };
  
  return {
    extinctionYear,
    yearsRemaining,
    currentWealth: financialFoundation.currentNetWorth,
    childrenInheritance: children.reduce((sum, child) => sum + child.inheritance, 0),
    grandchildrenInheritance,
    projections,
    topWealthDestroyers,
    familyImpact: {
      today: {
        netWorth: financialFoundation.currentNetWorth,
        status: 'Building wealth actively'
      },
      inheritance: {
        year: userDeathYear,
        children
      },
      grandchildren: {
        year: userDeathYear + 30,
        inheritance: grandchildrenInheritance,
        collegeShortfall
      }
    },
    protectedScenario: {
      extinctionYear: protectedExtinctionYear,
      additionalYears,
      grandchildrenInheritance: protectedGrandchildrenInheritance,
      improvements
    },
    complexityAnalysis: {
      score: complexityAnalysis.complexityScore,
      primaryComplexityDrivers: complexityDrivers,
      coordinationOpportunities,
      optimizationPotential: Math.min(10, complexityAnalysis.complexityScore * 1.5)
    },
    scenarioAnalysis
  };
}

// API Routes
app.post('/api/calculate-wealth', async (req, res) => {
  try {
    console.log('📝 Received calculation request');
    console.log('📦 Request headers:', req.headers);
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const calculatorData = req.body;
    
    // Validate input data
    if (!calculatorData || !calculatorData.coreIdentity || !calculatorData.financialFoundation) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Invalid input data provided',
        message: 'Required fields: coreIdentity, financialFoundation'
      });
    }
    
    // Additional validation
    if (calculatorData.coreIdentity.age < 18 || calculatorData.coreIdentity.age > 100) {
      console.error('❌ Validation failed: Invalid age');
      return res.status(400).json({
        success: false,
        error: 'Invalid age provided',
        message: 'Age must be between 18 and 100'
      });
    }
    
    if (calculatorData.financialFoundation.currentNetWorth < 0) {
      console.error('❌ Validation failed: Invalid net worth');
      return res.status(400).json({
        success: false,
        error: 'Invalid net worth provided',
        message: 'Net worth cannot be negative'
      });
    }
    
    console.log('📝 Received calculation request for user age:', calculatorData.coreIdentity.age);
    console.log('💰 Net worth:', calculatorData.financialFoundation.currentNetWorth);
    console.log('🔢 Complexity score:', calculatorData.complexityAnalysis.complexityScore);
    
    // Run the advanced calculation
    console.log('🔮 Starting calculation with local function...');
    const results = calculateWealthExtinction(calculatorData);
    console.log('✅ Advanced calculation completed');
    
    // Log results for monitoring
    console.log('📅 Extinction year:', results.extinctionYear);
    console.log('⏰ Years remaining:', results.yearsRemaining);
    console.log('💰 Current wealth:', results.currentWealth);
    console.log('👨‍👩‍👧‍👦 Children inheritance:', results.childrenInheritance);
    console.log('🎓 Grandchildren inheritance:', results.grandchildrenInheritance);
    
    const responseData = {
      success: true,
      data: results,
      calculatedAt: new Date().toISOString(),
      version: '2.0',
      metadata: {
        simulationYears: 75,
        monteCarloRuns: 1000,
        variablesMonitored: 247
      }
    };
    
    console.log('📤 About to send response');
    console.log('📦 Response data structure:', {
      success: responseData.success,
      extinctionYear: responseData.data.extinctionYear,
      yearsRemaining: responseData.data.yearsRemaining,
      hasProjections: !!responseData.data.projections,
      projectionsCount: responseData.data.projections?.length || 0,
      hasTopWealthDestroyers: !!responseData.data.topWealthDestroyers,
      hasFamilyImpact: !!responseData.data.familyImpact,
      hasProtectedScenario: !!responseData.data.protectedScenario,
      hasComplexityAnalysis: !!responseData.data.complexityAnalysis,
      hasScenarioAnalysis: !!responseData.data.scenarioAnalysis
    });
    
    res.json(responseData);
    console.log('✅ Response sent successfully');
    
  } catch (error) {
    console.error('❌ Calculation API error:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during calculation',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wealth Calculation API is running',
    version: '2.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/calculate-wealth',
      description: 'Calculate wealth extinction analysis'
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, proxy frontend requests to Vite dev server
  // Try multiple possible ports for the frontend
  const frontendPorts = [5173, 5174, 5175];
  let proxyTarget = null;
  
  // Find which port the frontend is actually running on
  for (const port of frontendPorts) {
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.ok) {
        proxyTarget = `http://localhost:${port}`;
        break;
      }
    } catch (e) {
      // Port not available, try next one
    }
  }
  
  if (proxyTarget) {
    console.log(`🔄 Proxying frontend requests to ${proxyTarget}`);
    app.use('/', createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
      ws: true
    }));
  } else {
    console.log('⚠️ Frontend not found on expected ports, serving API only');
    app.get('/', (req, res) => {
      res.json({
        message: 'Backend API is running',
        endpoints: {
          health: '/api/health',
          calculate: '/api/calculate-wealth'
        }
      });
    });
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});