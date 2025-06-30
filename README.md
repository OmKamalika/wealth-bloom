# Wealth Bloom - Family Wealth Calculator

A sophisticated wealth extinction calculator that analyzes your family's financial future across multiple generations.

## 🚀 Quick Start 

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
npm install
```

### Development Mode
The project now runs with both frontend and backend servers:

```bash
npm run dev
```

This will start:
- **Frontend**: Vite dev server on `http://localhost:5173`
- **Backend**: Express API server on `http://localhost:3001`

### Alternative: Frontend Only
If you prefer to run just the frontend (with client-side calculations):

```bash
npm run dev:frontend
```

## 🔧 How It Works

### Backend API (Recommended)
- **Endpoint**: `POST /api/calculate-wealth`
- **Features**: Full wealth extinction analysis with Monte Carlo simulations
- **Complexity**: Handles 247 variables across 75-year projections

### Client-Side Fallback
- **Fallback**: If backend is unavailable, calculations run in the browser
- **Features**: Simplified but functional wealth projections
- **Performance**: Faster but less sophisticated than backend version

## 📊 Calculation Features

- **Multi-Generational Analysis**: Projects wealth across children and grandchildren
- **Lifecycle Events**: Accounts for education costs, parent care, and major life events
- **Complexity Scoring**: Analyzes family coordination challenges
- **Scenario Analysis**: Best case, most likely, and worst case projections
- **Optimization Recommendations**: Suggests improvements to extend wealth timeline

## 🛠️ Project Structure

```
src/
├── components/
│   └── WealthCalculatorFlow.tsx    # Main calculator interface
├── services/                       # Advanced calculation services
├── types/                          # TypeScript type definitions
├── utils/                          # Utility functions
└── api/                           # API route definitions
server.js                          # Express backend server
```

## 🔍 Troubleshooting

### "Calculate My Family's Timeline" Button Not Working

**Problem**: The button doesn't respond when clicked.

**Solutions**:

1. **Check Backend Server**:
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return a success response.

2. **Check Frontend Console**:
   - Open browser developer tools (F12)
   - Look for error messages in the Console tab
   - Check Network tab for failed API calls

3. **Restart Servers**:
   ```bash
   # Stop all processes (Ctrl+C)
   npm run dev
   ```

4. **Client-Side Fallback**:
   - If backend fails, the calculator will automatically fall back to client-side calculations
   - Check console for "🔄 Falling back to client-side calculation..." message

### Common Issues

1. **Port Conflicts**: If port 3001 is in use, change it in `server.js`
2. **CORS Errors**: Backend includes CORS headers, but check browser console
3. **TypeScript Errors**: Run `npm run lint` to check for type issues

## 🎯 Next Steps

1. **Enhanced Calculations**: Integrate the full TypeScript calculation services
2. **Database Integration**: Store user data and calculation history
3. **Advanced UI**: Add charts, graphs, and interactive visualizations
4. **Export Features**: Generate PDF reports and action plans

## 📝 API Documentation

### Calculate Wealth Extinction

**POST** `/api/calculate-wealth`

**Request Body**:
```json
{
  "coreIdentity": {
    "age": 42,
    "maritalStatus": "married",
    "location": { "cityType": "metro" },
    "education": { "level": "masters" },
    "employment": { "status": "corporate" },
    "financialSophistication": "moderate"
  },
  "financialFoundation": {
    "currentNetWorth": 750000,
    "annualIncome": 180000,
    "primaryIncomeSource": "salary"
  },
  "childrenContext": { "children": [] },
  "familyCareContext": { "parents": [] },
  "behavioralProfile": { "riskTolerance": "moderate" },
  "complexityAnalysis": { "complexityScore": 1.2 }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "extinctionYear": 2045,
    "yearsRemaining": 20,
    "currentWealth": 750000,
    "childrenInheritance": 225000,
    "grandchildrenInheritance": 75000,
    "projections": [...],
    "topWealthDestroyers": [...],
    "familyImpact": {...},
    "protectedScenario": {...},
    "complexityAnalysis": {...},
    "scenarioAnalysis": {...}
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 