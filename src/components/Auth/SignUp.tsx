import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SignUpProps {
  onBack: () => void;
  onSignUpSuccess: () => void;
  onSignInClick: () => void;
  initialEmail?: string;
}

const SignUp: React.FC<SignUpProps> = ({ 
  onBack, 
  onSignUpSuccess, 
  onSignInClick,
  initialEmail = ''
}) => {
  console.log('🔍 SignUp component rendered with initialEmail:', initialEmail);
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: '',
    confirmPassword: '',
    fullName: '',
    mobileNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'text-gray-400' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 1) return { score, label: 'Very Weak', color: 'text-red-500' };
    if (score === 2) return { score, label: 'Weak', color: 'text-orange-500' };
    if (score === 3) return { score, label: 'Fair', color: 'text-yellow-500' };
    if (score === 4) return { score, label: 'Good', color: 'text-blue-500' };
    return { score, label: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check for stronger password requirements
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      setError('Password must contain at least one special character');
      return;
    }

    // Check for common weak passwords
    const weakPasswords = [
      'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
      'princess', 'qwerty123', 'admin123', 'password1', '123456789'
    ];
    
    if (weakPasswords.includes(formData.password.toLowerCase())) {
      setError('Please choose a stronger password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            mobile_number: formData.mobileNumber
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Create profile in the database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: formData.fullName,
              mobile_number: formData.mobileNumber,
              email: formData.email
            }
          ]);
        
        if (profileError) throw profileError;
      }
      
      setSuccessMessage('Account created successfully!');
      
      // Directly sign in the user after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (signInError) {
        console.error('Error signing in after signup:', signInError);
        // Still consider signup successful, but user will need to sign in manually
        setTimeout(() => {
          onSignUpSuccess();
        }, 1000);
      } else {
        // Successful signup and sign in
        setTimeout(() => {
          onSignUpSuccess();
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-8 flex flex-col">
      <div className="flex-1">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="header-custom mb-4">Create your account</h1>
          <p className="text-gray-600">
            Join thousands of families protecting their wealth
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="label-custom mb-2 block">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              className="input-field-custom w-full"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label-custom mb-2 block">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field-custom w-full"
              placeholder="Your email address"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="label-custom mb-2 block">Mobile Number (Optional)</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="input-field-custom w-full"
              placeholder="Your mobile number"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="label-custom mb-2 block">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="input-field-custom w-full pr-12"
                placeholder="Create a password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <p>Password must be at least 8 characters</p>
              {formData.password && (
                <div className="space-y-1">
                  <p className={formData.password.length >= 8 ? "text-green-600" : "text-red-600"}>
                    ✓ At least 8 characters {formData.password.length >= 8 ? "✓" : ""}
                  </p>
                  <p className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-red-600"}>
                    ✓ Contains uppercase letter {/[A-Z]/.test(formData.password) ? "✓" : ""}
                  </p>
                  <p className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-red-600"}>
                    ✓ Contains lowercase letter {/[a-z]/.test(formData.password) ? "✓" : ""}
                  </p>
                  <p className={/\d/.test(formData.password) ? "text-green-600" : "text-red-600"}>
                    ✓ Contains number {/\d/.test(formData.password) ? "✓" : ""}
                  </p>
                  <p className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : "text-red-600"}>
                    ✓ Contains special character {/[^A-Za-z0-9]/.test(formData.password) ? "✓" : ""}
                  </p>
                  {passwordStrength.label && (
                    <p className={`font-medium ${passwordStrength.color}`}>
                      Password Strength: {passwordStrength.label}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="label-custom mb-2 block">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`input-field-custom w-full pr-12 ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? 'border-red-300 focus:ring-red-500' 
                    : formData.confirmPassword && formData.password === formData.confirmPassword 
                    ? 'border-green-300 focus:ring-green-500' 
                    : ''
                }`}
                placeholder="Confirm your password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${
                formData.password === formData.confirmPassword 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formData.password === formData.confirmPassword 
                  ? '✓ Passwords match' 
                  : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-custom w-full py-4 text-white font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSignInClick}
              className="text-custom-purple font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;