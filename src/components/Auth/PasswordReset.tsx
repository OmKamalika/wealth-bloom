import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PasswordResetProps {
  onBack: () => void;
  onResetSent: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack, onResetSent }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Send password reset email with Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password-confirmation`,
      });
      
      if (resetError) throw resetError;
      
      setSuccessMessage('Password reset instructions have been sent to your email');
      setTimeout(() => {
        onResetSent();
      }, 3000);
      
    } catch (error) {
      console.error('Error sending password reset:', error);
      setError(error instanceof Error ? error.message : 'Failed to send password reset email');
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
          <h1 className="header-custom mb-4">Reset your password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="label-custom mb-2 block">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field-custom w-full"
              placeholder="Your email address"
              required
            />
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
                Sending...
              </div>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;