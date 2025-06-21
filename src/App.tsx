import React, { useState } from 'react';
import { Screen, PersonalInfo, FamilyMember, LocationInfo, AssetInfo } from './types';
import LandingScreen from './components/LandingScreen';
import ValuePropositionScreen from './components/ValuePropositionScreen';
import ProblemSolutionScreen from './components/ProblemSolutionScreen';
import OnboardingScreen from './components/OnboardingScreen';
import FamilyBuilderScreen from './components/FamilyBuilderScreen';
import LocationScreen from './components/LocationScreen';
import AssetsScreen from './components/AssetsScreen';
import FinalDecisionsScreen from './components/FinalDecisionsScreen';
import DashboardScreen from './components/DashboardScreen';
import WealthCalculatorLanding from './components/WealthCalculatorLanding';
import WealthCalculatorFlow from './components/WealthCalculatorFlow';
import WealthResultsScreen from './components/WealthResultsScreen';
import EmailCaptureScreen from './components/EmailCaptureScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing'); // Start with wealth calculator landing
  const [userInfo, setUserInfo] = useState<PersonalInfo | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 'mom',
      name: 'Mom',
      relationship: 'guardian',
      email: 'mom@example.com',
      isoCode: '+91',
      mobileNumber: '9876543210'
    },
    {
      id: 'dad',
      name: 'Dad',
      relationship: 'guardian',
      email: 'dad@example.com',
      isoCode: '+91',
      mobileNumber: '9876543211'
    }
  ]);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [assetInfo, setAssetInfo] = useState<AssetInfo | null>(null);
  const [calculatorData, setCalculatorData] = useState<any>(null);

  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleOnboardingComplete = (data: PersonalInfo) => {
    setUserInfo(data);
    setCurrentScreen('family-builder');
  };

  const handleFamilyBuilderComplete = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    setCurrentScreen('location');
  };

  const handleLocationComplete = (location: LocationInfo) => {
    setLocationInfo(location);
    setCurrentScreen('assets');
  };

  const handleAssetsComplete = (assets: AssetInfo) => {
    setAssetInfo(assets);
    setCurrentScreen('final-decisions');
  };

  const handleFinalComplete = () => {
    console.log('Will creation completed:', {
      userInfo,
      familyMembers,
      locationInfo,
      assetInfo
    });
    setCurrentScreen('dashboard');
  };

  const handleCalculatorComplete = (data: any) => {
    setCalculatorData(data);
    setCurrentScreen('wealth-results');
  };

  const handleGetProtectionPlan = () => {
    setCurrentScreen('email-capture');
  };

  const handleEmailCaptureComplete = (email: string) => {
    // Here you would typically send the email to your backend
    console.log('Email captured:', email, 'Calculator data:', calculatorData);
    // Redirect to dashboard or onboarding flow
    setCurrentScreen('value-proposition');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'wealth-calculator':
        setCurrentScreen('landing');
        break;
      case 'wealth-results':
        setCurrentScreen('wealth-calculator');
        break;
      case 'email-capture':
        setCurrentScreen('wealth-results');
        break;
      case 'value-proposition':
        setCurrentScreen('landing');
        break;
      case 'problem-solution':
        setCurrentScreen('value-proposition');
        break;
      case 'onboarding':
        setCurrentScreen('problem-solution');
        break;
      case 'family-builder':
        setCurrentScreen('onboarding');
        break;
      case 'location':
        setCurrentScreen('family-builder');
        break;
      case 'assets':
        setCurrentScreen('location');
        break;
      case 'final-decisions':
        setCurrentScreen('assets');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <WealthCalculatorLanding onStartCalculator={() => handleScreenTransition('wealth-calculator')} />;
      case 'wealth-calculator':
        return (
          <WealthCalculatorFlow 
            onComplete={handleCalculatorComplete}
            onBack={() => handleScreenTransition('landing')}
          />
        );
      case 'wealth-results':
        return (
          <WealthResultsScreen
            calculatorData={calculatorData}
            onGetProtectionPlan={handleGetProtectionPlan}
            onStartOver={() => handleScreenTransition('wealth-calculator')}
          />
        );
      case 'email-capture':
        return (
          <EmailCaptureScreen
            calculatorData={calculatorData}
            onComplete={handleEmailCaptureComplete}
          />
        );
      case 'value-proposition':
        return <ValuePropositionScreen onNext={() => handleScreenTransition('problem-solution')} />;
      case 'problem-solution':
        return <ProblemSolutionScreen onNext={() => handleScreenTransition('onboarding')} />;
      case 'onboarding':
        return (
          <OnboardingScreen 
            onBack={handleBack}
            onNext={handleOnboardingComplete}
          />
        );
      case 'family-builder':
        return (
          <FamilyBuilderScreen
            onBack={handleBack}
            onNext={handleFamilyBuilderComplete}
          />
        );
      case 'location':
        return (
          <LocationScreen
            onBack={handleBack}
            onNext={handleLocationComplete}
          />
        );
      case 'assets':
        return (
          <AssetsScreen
            onBack={handleBack}
            onNext={handleAssetsComplete}
          />
        );
      case 'final-decisions':
        return (
          <FinalDecisionsScreen
            onNext={handleFinalComplete}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            familyMembers={familyMembers}
            onAddBill={() => handleScreenTransition('add-bill')}
          />
        );
      default:
        return <WealthCalculatorLanding onStartCalculator={() => handleScreenTransition('wealth-calculator')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
}

export default App;