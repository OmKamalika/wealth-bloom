import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Users, FileText, Clock, Shield } from 'lucide-react';

interface EmailCaptureScreenProps {
  onComplete: (email: string) => void;
  calculatorData: any;
}

const EmailCaptureScreen: React.FC<EmailCaptureScreenProps> = ({ onComplete, calculatorData }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onComplete(email);
  };

  const benefits = [
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: 'Personalized 5-step plan to stop YOUR countdown',
      description: 'Custom strategies based on your family situation'
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: 'Specific actions for your family situation',
      description: 'Tailored recommendations for your wealth level and concerns'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Timeline to extend wealth to 2089+ (22 extra years)',
      description: 'Step-by-step roadmap with deadlines and milestones'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: 'Early access to our wealth protection platform',
      description: 'Be among the first to use our comprehensive tools'
    }
  ];

  const testimonials = [
    {
      text: "This plan helped us save $80K in parent care costs while keeping our kids' college funds intact.",
      author: "Michael R., Dallas"
    },
    {
      text: "Finally, someone who understands the sandwich generation struggle. Their advice actually works.",
      author: "Jennifer S., Seattle"
    },
    {
      text: "We extended our wealth timeline by 15 years in just 6 months following their recommendations.",
      author: "David & Lisa K., Miami"
    }
  ];

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Protection Plan Sent!
          </h2>
          <p className="text-gray-600 mb-6">
            Check your email for "Your Family Wealth Protection Plan - Action Required"
          </p>
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">⏰ While you wait, here's what happens next:</h3>
            <div className="space-y-3 text-left">
              <p className="flex items-center gap-3">
                <span className="text-purple-600">📧</span>
                <span className="text-sm">Next 7 days: Educational email series</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-purple-600">🛡️</span>
                <span className="text-sm">Week 2: Early access to our protection platform</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-purple-600">👥</span>
                <span className="text-sm">Week 3: Invitation to exclusive family wealth community</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🛡️ Get Your FREE Family Protection Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Don't let your wealth become another statistic
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mb-12">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for instant access"
                  className="w-full px-6 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!email}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                Get My Protection Plan
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% confidential</span>
                </div>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                ✨ Delivered instantly • No spam • Unsubscribe anytime
              </p>
              
              <p className="text-center text-sm text-gray-600 mt-2">
                Join 12,847 families already protecting their future
              </p>
            </form>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">What others are saying:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="text-center">
                  <blockquote className="text-gray-700 mb-4 italic">
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
    </div>
  );
};

export default EmailCaptureScreen;