import React from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Users, 
  Bell, 
  FileText, 
  Star, 
  HelpCircle, 
  Shield, 
  ArrowRight,
  Home,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Screen } from '../../types';

interface ProfileProps {
  onBack: () => void;
  onNavigate?: (screen: Screen) => void;
  onSignOut?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack, onNavigate, onSignOut }) => {
  const { user, profile, signOut } = useAuth();

  // Get user's join year from created_at
  const getJoinYear = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).getFullYear();
    }
    return new Date().getFullYear();
  };

  const handleLogout = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut();
    }
  };

  const handleNavigation = (screen: string) => {
    if (onNavigate) {
      // Only navigate to valid screens
      if (screen === 'dashboard') {
        onNavigate('dashboard');
      }
      // For now, other navigation items will just go back to dashboard
      // as they don't have corresponding screens yet
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center">
        <button onClick={onBack} className="w-6 h-6 text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Account</h1>
        <div className="w-6"></div>
      </div>

      {/* Profile Section */}
      <div className="bg-white px-6 py-8 relative">
        <Edit3 className="absolute top-4 right-4 w-5 h-5 text-gray-400" />
        
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Profile Info */}
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {profile?.full_name || user?.user_metadata?.full_name || 'User'}
          </h2>
          <p className="mt-1 text-gray-500">Joined in {getJoinYear()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Referrals Section */}
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Referrals</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-medium text-gray-900">Invite family</h4>
                <p className="text-sm text-gray-500 mt-1">Invite friends to join and earn rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Settings</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Notifications */}
            <div className="flex items-center p-4 border-b border-gray-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-gray-600" />
              </div>
              <span className="ml-4 font-medium text-gray-900">Notifications</span>
            </div>
            
            {/* Wealth Extinction Report */}
            <div className="flex items-center p-4 border-b border-gray-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <span className="ml-4 font-medium text-gray-900">Wealth Extinction Report</span>
            </div>
            
            {/* Milestones */}
            <div className="flex items-center p-4 border-b border-gray-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-600" />
              </div>
              <span className="ml-4 font-medium text-gray-900">Milestones</span>
            </div>
            
            {/* Help */}
            <div className="flex items-center p-4 border-b border-gray-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-gray-600" />
              </div>
              <span className="ml-4 font-medium text-gray-900">Help</span>
            </div>
            
            {/* Log out */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <span className="ml-4 font-medium text-gray-900">Log out</span>
            </button>
          </div>
        </div>

        {/* Action History Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Action History</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </div>
                <span className="ml-4 font-medium text-gray-900">View actions and rewards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {/* Home - Outline (not active) */}
          <button 
            onClick={() => handleNavigation('dashboard')}
            className="flex flex-col items-center py-2"
          >
            <Home className="w-6 h-6 text-gray-400 stroke-2" strokeWidth={1.5} fill="none" />
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </button>
          
          {/* Family */}
          <button 
            onClick={() => handleNavigation('family')}
            className="flex flex-col items-center py-2"
          >
            <Users className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Family</span>
          </button>
          
          {/* Dreams */}
          <button 
            onClick={() => handleNavigation('dreams')}
            className="flex flex-col items-center py-2"
          >
            <Star className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Dreams</span>
          </button>
          
          {/* Vault */}
          <button 
            onClick={() => handleNavigation('vault')}
            className="flex flex-col items-center py-2"
          >
            <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-400 mt-1">Vault</span>
          </button>
          
          {/* Account - Filled (active) */}
          <div className="flex flex-col items-center py-2">
            <User className="w-6 h-6 text-purple-600 fill-current" />
            <span className="text-xs text-purple-600 mt-1 font-medium">Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;