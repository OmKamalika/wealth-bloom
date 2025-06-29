import React, { useState, useEffect } from 'react';
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
import WealthExtinctionResults from './components/WealthExtinctionResults';
import EmailCaptureScreen from './components/EmailCaptureScreen';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import PasswordReset from './components/Auth/PasswordReset';
import Profile from './components/User/Profile';
import AuthGuard from './components/Auth/AuthGuard';
import { supabase } from './lib/supabase';
import { getAnonymousSessionId } from './utils/sessionUtils';
import { associateAnonymousCalculations } from './api/calculate-wealth-api';

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
  const [capturedEmail, setCapturedEmail] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [anonymousSessionId, setAnonymousSessionId] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');

  // Initialize anonymous session ID on app load
  useEffect(() => {
    const sessionId = getAnonymousSessionId();
    setAnonymousSessionId(sessionId);
    console.log('🔑 Anonymous session ID:', sessionId);
  }, []);

  // Check for user session on app load
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      
      // If user is logged in and we have an anonymous session ID, associate calculations
      if (currentUser && anonymousSessionId) {
        console.log('🔄 Associating anonymous calculations with user on app load');
        try {
          const success = await associateAnonymousCalculations(currentUser.id, anonymousSessionId);
          if (success) {
            console.log('✅ Successfully associated anonymous calculations');
          }
        } catch (error) {
          console.error('❌ Error associating calculations:', error);
        }
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user || null;
      setUser(newUser);
      
      // Redirect to dashboard if user signs in
      if (event === 'SIGNED_IN' && ['signin', 'signup', 'password-reset'].includes(currentScreen)) {
        setCurrentScreen('dashboard');
        
        // Associate anonymous calculations with the new user
        if (newUser && anonymousSessionId) {
          console.log('🔄 Associating anonymous calculations with user on sign in');
          associateAnonymousCalculations(newUser.id, anonymousSessionId)
            .catch(error => console.error('❌ Error associating calculations:', error));
        }
      }
      
      // Redirect to landing if user signs out
      if (event === 'SIGNED_OUT') {
        setCurrentScreen('landing');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [currentScreen, anonymousSessionId]);

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

  const handleFinalComplete = async () => {
    console.log('Will creation completed:', {
      userInfo,
      familyMembers,
      locationInfo,
      assetInfo
    });
    
    // Check if user is already authenticated
    if (user) {
      // User is already logged in, go to dashboard
      setCurrentScreen('dashboard');
    } else {
      // User is not logged in, store the captured email and password for signup
      if (capturedEmail) {
        // If we have an email from the calculator, use it for signup
        try {
          // Create a random password if none exists
          const userPassword = password || Math.random().toString(36).slice(-8);
          setPassword(userPassword);
          
          // Sign up the user
          const { data, error } = await supabase.auth.signUp({
            email: capturedEmail,
            password: userPassword,
            options: {
              data: {
                full_name: userInfo?.fullName || '',
                mobile_number: userInfo?.mobileNumber || ''
              }
            }
          });
          
          if (error) {
            console.error('Error signing up user:', error);
            // Redirect to signup screen for manual signup
            setCurrentScreen('signup');
          } else if (data.user) {
            // Create profile in the database
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  full_name: userInfo?.fullName || '',
                  mobile_number: userInfo?.mobileNumber || '',
                  email: capturedEmail
                }
              ]);
            
            if (profileError) {
              console.error('Error creating profile:', profileError);
            }
            
            // Redirect to dashboard
            setCurrentScreen('dashboard');
          }
        } catch (error) {
          console.error('Error during automatic signup:', error);
          // Redirect to signup screen for manual signup
          setCurrentScreen('signup');
        }
      } else {
        // No email captured, redirect to signup
        setCurrentScreen('signup');
      }
    }
  };

  const handleCalculatorComplete = (data: any) => {
    console.log('🎯 App: handleCalculatorComplete called with data:', data);
    setCalculatorData(data);
    setCurrentScreen('wealth-extinction-results');
  };

  const handleGetProtectionPlan = () => {
    console.log('🔍 handleGetProtectionPlan called - transitioning to email-capture');
    setCurrentScreen('email-capture');
  };

  const handleEmailCaptureComplete = (email: string) => {
    console.log('🔍 handleEmailCaptureComplete called with email:', email);
    // Store the email for later use in onboarding
    setCapturedEmail(email);
    
    // Here you would typically send the email to your backend
    console.log('Email captured:', email, 'Calculator data:', calculatorData);
    // Redirect directly to signup for protection plan flow
    console.log('🔍 transitioning to signup');
    setCurrentScreen('signup');
  };

  const handleSignOut = async () => {
    console.log('Sign out initiated from App component');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentScreen('landing');
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'wealth-calculator':
        setCurrentScreen('landing');
        break;
      case 'wealth-extinction-results':
        setCurrentScreen('wealth-calculator');
        break;
      case 'email-capture':
        setCurrentScreen('wealth-extinction-results');
        break;
      case 'signup':
        setCurrentScreen('email-capture');
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
      case 'signin':
      case 'password-reset':
        setCurrentScreen('landing');
        break;
      case 'profile':
        setCurrentScreen('dashboard');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <WealthCalculatorLanding 
          onStartCalculator={() => handleScreenTransition('wealth-calculator')} 
          onSignIn={() => handleScreenTransition('signin')}
          isLoggedIn={!!user}
          onProfile={() => handleScreenTransition('profile')}
          onSignOut={handleSignOut}
        />;
      case 'wealth-calculator':
        return (
          <WealthCalculatorFlow 
            onComplete={handleCalculatorComplete}
            onBack={() => handleScreenTransition('landing')}
          />
        );
      case 'wealth-extinction-results':
        return (
          <WealthExtinctionResults
            results={calculatorData?.results}
            userProfile={{
              age: calculatorData?.inputs?.coreIdentity?.age || 30,
              netWorth: calculatorData?.inputs?.financialFoundation?.currentNetWorth || 0,
              income: calculatorData?.inputs?.financialFoundation?.annualIncome || 0,
              location: `${calculatorData?.inputs?.coreIdentity?.location?.city || 'Mumbai'}, ${calculatorData?.inputs?.coreIdentity?.location?.state || 'Maharashtra'}`,
              children: calculatorData?.inputs?.childrenContext?.children?.length || 0,
              maritalStatus: calculatorData?.inputs?.coreIdentity?.maritalStatus || 'married'
            }}
            onGetProtectionPlan={handleGetProtectionPlan}
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
            capturedEmail={capturedEmail}
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
          <AuthGuard
            fallback={<SignIn 
              onBack={() => setCurrentScreen('landing')}
              onSignInSuccess={() => setCurrentScreen('dashboard')}
              onSignUpClick={() => setCurrentScreen('signup')}
              onForgotPasswordClick={() => setCurrentScreen('password-reset')}
            />}
          >
            <DashboardScreen
              familyMembers={familyMembers}
              onAddBill={() => handleScreenTransition('add-bill')}
              onProfile={() => handleScreenTransition('profile')}
              onSignOut={handleSignOut}
            />
          </AuthGuard>
        );
      case 'signin':
        return (
          <SignIn 
            onBack={handleBack}
            onSignInSuccess={() => setCurrentScreen('dashboard')}
            onSignUpClick={() => setCurrentScreen('signup')}
            onForgotPasswordClick={() => setCurrentScreen('password-reset')}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onBack={handleBack}
            onSignUpSuccess={() => setCurrentScreen('dashboard')}
            onSignInClick={() => setCurrentScreen('signin')}
            initialEmail={capturedEmail}
          />
        );
      case 'password-reset':
        return (
          <PasswordReset 
            onBack={handleBack}
            onResetSent={() => setCurrentScreen('signin')}
          />
        );
      case 'profile':
        return (
          <AuthGuard
            fallback={<SignIn 
              onBack={() => setCurrentScreen('landing')}
              onSignInSuccess={() => setCurrentScreen('dashboard')}
              onSignUpClick={() => setCurrentScreen('signup')}
              onForgotPasswordClick={() => setCurrentScreen('password-reset')}
            />}
          >
            <Profile 
              onBack={handleBack} 
              onNavigate={handleScreenTransition}
              onSignOut={handleSignOut}
            />
          </AuthGuard>
        );
      default:
        return <WealthCalculatorLanding 
          onStartCalculator={() => handleScreenTransition('wealth-calculator')} 
          onSignIn={() => handleScreenTransition('signin')}
          isLoggedIn={!!user}
          onProfile={() => handleScreenTransition('profile')}
          onSignOut={handleSignOut}
        />;
    }
  };

  return (
    <AuthProvider>
      <CurrencyProvider>
        <div className="min-h-screen">
          {renderScreen()}
        </div>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;