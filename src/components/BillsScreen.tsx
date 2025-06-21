import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Zap, Droplets, Wifi, Home, Lightbulb } from 'lucide-react';
import { Bill, FamilyMember } from '../types';

interface BillsScreenProps {
  bills: Bill[];
  familyMembers: FamilyMember[];
  onBack: () => void;
  onPayBill: (billId: string) => void;
}

const BillsScreen: React.FC<BillsScreenProps> = ({ bills, familyMembers, onBack, onPayBill }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'paid' | 'overdue'>('upcoming');

  const getBillIcon = (type: string) => {
    switch (type) {
      case 'electricity': return <Lightbulb className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'gas': return <Zap className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const mockFamilyAvatars = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  ];

  const upcomingBills = [
    { id: '1', type: 'wifi', provider: 'My WiFi Bill', amount: 500, dueDate: '2024-01-10', status: 'pending' },
    { id: '2', type: 'gas', provider: 'Mortgage Payment', amount: 25000, dueDate: '2024-01-20', status: 'pending' },
    { id: '3', type: 'water', provider: "Mom's Water Bill", amount: 250, dueDate: '2024-01-21', status: 'pending' },
    { id: '4', type: 'electricity', provider: "Mom's Electricity Bill", amount: 1250, dueDate: '2024-01-07', status: 'pending' }
  ];

  const paidBills = [
    { id: '5', type: 'electricity', provider: 'Electricity Bill', amount: 150, paidDate: 'Jul 15', payer: mockFamilyAvatars[0] },
    { id: '6', type: 'wifi', provider: 'Internet Bill', amount: 75, paidDate: 'Jul 22', payer: mockFamilyAvatars[1] },
    { id: '7', type: 'water', provider: 'Water Bill', amount: 50, paidDate: 'Jul 25', payer: mockFamilyAvatars[2] },
    { id: '8', type: 'gas', provider: 'Mortgage Payment', amount: 1000, paidDate: 'Jul 30', payer: [mockFamilyAvatars[0], mockFamilyAvatars[1]] },
    { id: '9', type: 'electricity', provider: 'Electricity Bill', amount: 150, paidDate: 'Jun 15', payer: mockFamilyAvatars[0] },
    { id: '10', type: 'wifi', provider: 'Internet Bill', amount: 75, paidDate: 'Jun 22', payer: mockFamilyAvatars[1] },
    { id: '11', type: 'water', provider: 'Water Bill', amount: 50, paidDate: 'Jun 25', payer: mockFamilyAvatars[2] },
    { id: '12', type: 'gas', provider: 'Mortgage Payment', amount: 1000, paidDate: 'Jun 30', payer: [mockFamilyAvatars[0], mockFamilyAvatars[1]] }
  ];

  const overdueBills = [
    { id: '13', type: 'electricity', provider: 'Electricity Bill', amount: 150, overdueBy: '5 days' },
    { id: '14', type: 'wifi', provider: 'Internet Bill', amount: 75, overdueBy: '12 days' },
    { id: '15', type: 'water', provider: 'Water Bill', amount: 50, overdueBy: '20 days' }
  ];

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderUpcomingTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-600 text-sm mb-1">Paid this month</p>
          <p className="text-2xl font-bold text-gray-900">$1,250</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-600 text-sm mb-1">Upcoming this month</p>
          <p className="text-2xl font-bold text-gray-900">$875</p>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-4">
        {upcomingBills.map((bill) => (
          <div key={bill.id} className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {getBillIcon(bill.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{bill.provider}</h3>
                  <p className="text-gray-500 text-sm">Due in {getDaysUntilDue(bill.dueDate)} days</p>
                </div>
              </div>
              <button 
                onClick={() => onPayBill(bill.id)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-4 rounded-xl text-sm"
              >
                Pay ₹{bill.amount}
              </button>
            </div>
            {(bill.provider.includes("Mom's") || bill.provider.includes("Dad's")) && (
              <div className="flex -space-x-2 mt-3">
                {mockFamilyAvatars.slice(0, 3).map((avatar, index) => (
                  <div key={index} className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                    <img src={avatar} alt="Family member" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaidTab = () => {
    const groupedBills = paidBills.reduce((acc, bill) => {
      const month = bill.paidDate.includes('Jul') ? 'July' : 'June';
      if (!acc[month]) acc[month] = [];
      acc[month].push(bill);
      return acc;
    }, {} as Record<string, any[]>);

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-600 text-sm mb-1">Paid this month</p>
            <p className="text-2xl font-bold text-gray-900">$1,250</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-600 text-sm mb-1">Upcoming this month</p>
            <p className="text-2xl font-bold text-gray-900">$875</p>
          </div>
        </div>

        {/* Grouped Bills */}
        {Object.entries(groupedBills).map(([month, bills]) => (
          <div key={month}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{month}</h3>
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getBillIcon(bill.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{bill.provider}</h4>
                      <p className="text-purple-600 text-sm">Paid on {bill.paidDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">${bill.amount}</span>
                    {Array.isArray(bill.payer) ? (
                      <div className="flex -space-x-1">
                        {bill.payer.map((avatar, index) => (
                          <div key={index} className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                            <img src={avatar} alt="Payer" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img src={bill.payer} alt="Payer" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverdueTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-600 text-sm mb-1">Paid this month</p>
          <p className="text-2xl font-bold text-gray-900">$1,250</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-gray-600 text-sm mb-1">Total Overdue</p>
          <p className="text-2xl font-bold text-gray-900">$350</p>
          <p className="text-red-500 text-sm font-medium">-$350</p>
        </div>
      </div>

      {/* Overdue Bills */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">July</h3>
        {overdueBills.slice(0, 2).map((bill) => (
          <div key={bill.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getBillIcon(bill.type)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{bill.provider}</h4>
                <p className="text-gray-500 text-sm">Overdue by {bill.overdueBy}</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-4 rounded-xl text-sm">
              Pay Now
            </button>
          </div>
        ))}

        <h3 className="text-lg font-bold text-gray-900 mt-6">June</h3>
        {overdueBills.slice(2).map((bill) => (
          <div key={bill.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getBillIcon(bill.type)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{bill.provider}</h4>
                <p className="text-gray-500 text-sm">Overdue by {bill.overdueBy}</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-4 rounded-xl text-sm">
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Bills</h1>
        <button className="p-2">
          <Search className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-4 px-1 mr-8 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`py-4 px-1 mr-8 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'paid'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Paid
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overdue'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overdue
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'upcoming' && renderUpcomingTab()}
        {activeTab === 'paid' && renderPaidTab()}
        {activeTab === 'overdue' && renderOverdueTab()}
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1">
            <Home className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 text-gray-400">👥</div>
            <span className="text-xs text-gray-400">Family</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 text-gray-400">⭐</div>
            <span className="text-xs text-gray-400">Dreams</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 text-gray-400">💳</div>
            <span className="text-xs text-gray-400">Finances</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 text-gray-400">👤</div>
            <span className="text-xs text-gray-400">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillsScreen;