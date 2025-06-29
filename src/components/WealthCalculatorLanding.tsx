import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Users, TrendingDown, Clock, CheckCircle, LogOut, User as UserIcon } from 'lucide-react';

interface WealthCalculatorLandingProps {
  onStartCalculator: () => void;
  onSignIn: () => void;
  isLoggedIn?: boolean;
  onProfile?: () => void;
  onSignOut?: () => void;
}

const WealthCalculatorLanding: React.FC<WealthCalculatorLandingProps> = ({ 
  onStartCalculator, 
  onSignIn,
  isLoggedIn = false,
  onProfile,
  onSignOut
}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [wealthCounter, setWealthCounter] = useState(70);

  const testimonials = [
    {
      text: "I thought my kids would inherit $500K. This showed they'll get $0. Mind blown. 🤯",
      author: "Sarah M., Mother of 3"
    },
    {
      text: "As a financial advisor, this opened my eyes to generational wealth destruction.",
      author: "David K., CFP"
    },
    {
      text: "This calculator saved our family's financial future. Eye-opening results!",
      author: "Jennifer R., Parent"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWealthCounter((prev) => {
        const newValue = prev - 0.1;
        return newValue <= 0 ? 70 : newValue;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    if (onSignOut) {
      console.log('Sign out button clicked in WealthCalculatorLanding');
      onSignOut();
      console.log('Navigated back to landing page after sign out');
    }
  };

  const handleProfileClick = () => {
    if (onProfile) {
      console.log('Profile button clicked in WealthCalculatorLanding');
      onProfile();
      console.log('Navigating to dashboard from landing page');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-custom-purple" />
            <span className="text-xl font-bold text-gray-900">FamilyPe</span>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-2 text-custom-purple hover:text-purple-700 font-medium transition-colors touch-target"
                aria-label="View profile"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors touch-target"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="text-custom-purple hover:text-purple-700 font-medium transition-colors touch-target"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              EVERY FAMILY'S WEALTH HAS AN
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                EXPIRATION DATE
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto elder-text">
              Will Your Grandchildren Inherit $0?
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartCalculator}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-6 px-8 md:px-12 rounded-3xl text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl mb-6 touch-target"
          >
            <span className="relative z-10">Find My Family's Wealth Timeline</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span>Shocking results guaranteed</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>Join 12,847 families who discovered their countdown</span>
          </div>
        </div>
      </section>

      {/* Animated Wealth Destruction Visual */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                THE SILENT FINANCIAL EXTINCTION
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">70%</div>
                  <p className="text-gray-600 elder-text">of family wealth disappears by the 2nd generation</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">90%</div>
                  <p className="text-gray-600 elder-text">is completely gone by the 3rd generation</p>
                </div>
              </div>
            </div>

            {/* Animated Family Tree */}
            <div className="relative">
              <div className="flex justify-center items-end space-x-4 md:space-x-8 mb-8">
                {/* Generation 1 */}
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-base">You</span>
                  </div>
                  <div className="w-16 md:w-20 h-24 md:h-32 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs p-2 text-center">
                      $750K
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Generation 1</p>
                </div>

                {/* Generation 2 */}
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">Kids</span>
                  </div>
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-t from-yellow-400 to-orange-400 rounded-t-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-orange-500 transition-all duration-1000"
                      style={{ height: `${wealthCounter}%` }}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 text-white text-xs p-2 text-center">
                      ${Math.round(750 * (wealthCounter / 100))}K
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Generation 2</p>
                </div>

                {/* Generation 3 */}
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">Grand</span>
                  </div>
                  <div className="w-16 md:w-20 h-6 md:h-8 bg-gradient-to-t from-red-400 to-red-500 rounded-t-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
                      $0
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Generation 3</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-gray-900 mb-4">
                  Your family's wealth is dying.
                </p>
                <p className="text-lg text-gray-600 mb-6 elder-text">
                  But you can stop the countdown.
                </p>
                <button
                  onClick={onStartCalculator}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 touch-target"
                >
                  See When My Wealth Dies
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Families Are Saying</h3>
              <div className="relative h-24 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ${
                      index === currentTestimonial
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-4'
                    }`}
                  >
                    <blockquote className="text-lg text-gray-700 mb-4 italic elder-text">
                      "{testimonial.text}"
                    </blockquote>
                    <cite className="text-purple-600 font-medium">
                      - {testimonial.author}
                    </cite>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Stop Your Family's Wealth Extinction
            </h3>
            <p className="text-lg md:text-xl text-gray-600 elder-text">
              Join thousands of families protecting their generational wealth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2-Minute Assessment</h4>
              <p className="text-gray-600 elder-text">
                Quick analysis of your family's wealth timeline with personalized insights
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Protection Plan</h4>
              <p className="text-gray-600 elder-text">
                Customized strategies to extend your wealth across generations
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Family Coordination</h4>
              <p className="text-gray-600 elder-text">
                Tools to help your family work together on financial planning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Don't Let Your Family Become Another Statistic
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-90 elder-text">
              Calculate your family's wealth timeline and get your protection plan today
            </p>
            <button
              onClick={onStartCalculator}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 md:px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg touch-target"
            >
              Start My Free Assessment
            </button>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>100% confidential</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 FamilyPe. Protecting families, preserving wealth.</p>
        </div>
      </footer>
    </div>
  );
};

export default WealthCalculatorLanding;