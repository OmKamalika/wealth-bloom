import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Home, Building, Briefcase, Diamond, ChevronRight } from 'lucide-react';
import { AssetInfo } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';

interface AssetsScreenProps {
  onBack: () => void;
  onNext: (assets: AssetInfo) => void;
}

const AssetsScreen: React.FC<AssetsScreenProps> = ({ onBack, onNext }) => {
  const [assets, setAssets] = useState<AssetInfo>({
    home: 5000000,
    financialAccounts: 500000,
    everythingElse: 500000,
    specialItems: 500000,
    total: 6500000
  });
  const { currencyInfo } = useCurrency();

  // Calculate total whenever individual assets change
  useEffect(() => {
    const total = assets.home + assets.financialAccounts + assets.everythingElse + assets.specialItems;
    setAssets(prev => ({ ...prev, total }));
  }, [assets.home, assets.financialAccounts, assets.everythingElse, assets.specialItems]);

  const handleAssetChange = (field: keyof AssetInfo, value: string) => {
    const numValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
    setAssets(prev => ({ ...prev, [field]: numValue }));
  };

  const handleNext = () => {
    onNext(assets);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <div className="max-w-md mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          What would you want your family to have?
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">Step 4 of 5</div>
          <div className="progress-bar-track-custom h-2">
            <div className="progress-bar-fill-custom h-2 rounded-full w-4/5 transition-all duration-300"></div>
          </div>
          <div className="text-sm text-custom-purple mt-2">Almost there!</div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            Don't worry about exact values. We just need the big picture.
          </p>
        </div>

        {/* Quick Assets */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Assets</h2>
          
          <div className="space-y-4">
            {/* Home */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">Home</h3>
                  <p className="text-sm text-gray-600">Home, condo, or other real estate</p>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 mb-1">Approx:</div>
                    <input
                      type="number"
                      value={assets.home}
                      onChange={(e) => handleAssetChange('home', e.target.value)}
                      className="input-field-custom"
                      aria-label="Home value"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Accounts */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">Financial Accounts</h3>
                  <p className="text-sm text-gray-600">Checking, savings, Demat and other accounts</p>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 mb-1">Approx:</div>
                    <input
                      type="number"
                      value={assets.financialAccounts}
                      onChange={(e) => handleAssetChange('financialAccounts', e.target.value)}
                      className="input-field-custom"
                      aria-label="Financial accounts value"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Everything Else */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">Everything Else</h3>
                  <p className="text-sm text-gray-600">Vehicles, jewelry, and other valuables</p>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 mb-1">Approx:</div>
                    <input
                      type="number"
                      value={assets.everythingElse}
                      onChange={(e) => handleAssetChange('everythingElse', e.target.value)}
                      className="input-field-custom"
                      aria-label="Other assets value"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Items */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Special Items</h2>
          
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Diamond className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base">Special Items</h3>
                <p className="text-sm text-gray-600">Art, collectibles, and other unique items</p>
                <p className="text-sm text-gray-600 mt-1">Approx: {formatCurrency(assets.specialItems, currencyInfo)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-3 mb-8">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <span className="text-gray-900 font-medium">Estimate Values</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <span className="text-gray-900 font-medium">Skip for Now</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Total Assets */}
        <div className="bg-purple-50 rounded-2xl p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Assets</h3>
          <div className="text-2xl font-bold text-purple-600 mb-2">
            ~{formatCurrency(assets.total, currencyInfo)}
          </div>
          <p className="text-sm text-gray-600">
            Most people have more than they think. You're doing great.
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="btn-primary-custom w-full"
        >
          Next: Make Your Choices
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AssetsScreen;