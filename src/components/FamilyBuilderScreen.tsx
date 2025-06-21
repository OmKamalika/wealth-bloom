import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Users, UserPlus, Shield, X } from 'lucide-react';
import { FamilyMember } from '../types';
import AddFamilyMemberModal from './AddFamilyMemberModal';

interface FamilyBuilderScreenProps {
  onBack: () => void;
  onNext: (familyMembers: FamilyMember[]) => void;
}

const FamilyBuilderScreen: React.FC<FamilyBuilderScreenProps> = ({ onBack, onNext }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddFamilyMember = (member: FamilyMember) => {
    setFamilyMembers(prev => [...prev, member]);
    setShowAddModal(false);
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleNext = () => {
    onNext(familyMembers);
  };

  const familyCategories = [
    {
      id: 'guardians',
      title: 'Your Guardians',
      description: 'Parents, Legal Guardians who brought you up',
      icon: Users,
      members: familyMembers.filter(m => m.relationship === 'guardian')
    },
    {
      id: 'partner',
      title: 'Your Partner',
      description: 'Spouse, partner, or significant other',
      icon: UserPlus,
      members: familyMembers.filter(m => m.relationship === 'partner')
    },
    {
      id: 'children',
      title: 'Your Children',
      description: 'Children, stepchildren, or adopted children',
      icon: Users,
      members: familyMembers.filter(m => m.relationship === 'child')
    },
    {
      id: 'childGuardians',
      title: 'Their Guardians',
      description: 'Legal guardians for minor children',
      icon: Shield,
      members: familyMembers.filter(m => m.relationship === 'childGuardian')
    },
    {
      id: 'otherFamily',
      title: 'Other Family Members',
      description: 'Uncles, Aunts, Grandparents, Siblings',
      icon: Users,
      members: familyMembers.filter(m => m.relationship === 'other')
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-8 flex flex-col">
      <div className="flex-1">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold mb-4 text-gray-900">
            Let's meet your family.
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">Step 2 of 5</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full w-2/5 transition-all duration-300"></div>
          </div>
          <div className="text-sm text-purple-600 mt-2">40% done already!</div>
        </div>

        {/* Main Question */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Who would you like to protect?</h2>
          <p className="text-gray-600 text-sm">
            We'll only ask about people who matter for your will. No family drama, just the basics.
          </p>
        </div>

        {/* Family Builder */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Family Builder</h3>
          
          <div className="space-y-4">
            {familyCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{category.title}</h4>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  {/* Added Members */}
                  {category.members.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {category.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                            <div className="text-xs text-gray-600">{member.email}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveFamilyMember(member.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Button */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium py-2 transition-colors"
                  >
                    + Add {category.title.toLowerCase()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Message */}
        {familyMembers.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-4 mb-8 text-center">
            <p className="text-green-800 text-sm">
              Family setup complete! ⭐ You're protecting the people who matter most.
            </p>
          </div>
        )}

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            You can change any of this later. We're just getting started.
          </p>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 mt-8"
      >
        Next: Your Assets →
      </button>

      {/* Add Family Member Modal */}
      {showAddModal && (
        <AddFamilyMemberModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFamilyMember}
        />
      )}
    </div>
  );
};

export default FamilyBuilderScreen;