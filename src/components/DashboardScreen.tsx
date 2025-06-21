import React, { useState, useEffect } from 'react';
import { Plus, Zap, Droplets, Wifi, Eye, FileText, Users, Star, Calendar, Home, CreditCard, User } from 'lucide-react';
import { FamilyMember, Bill } from '../types';
import ParentBillPopup from './ParentBillPopup';
import AddBillScreen from './AddBillScreen';
import BillsScreen from './BillsScreen';
import ConfirmPaymentScreen from './ConfirmPaymentScreen';
import PaymentSuccessScreen from './PaymentSuccessScreen';

interface DashboardScreenProps {
  familyMembers: FamilyMember[];
  onAddBill: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ familyMembers, onAddBill }) => {
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [showBillsScreen, setShowBillsScreen] = useState(false);
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      type: 'electricity',
      provider: "Mom's Electricity Bill",
      amount: 1250,
      dueDate: '2024-01-08',
      familyMemberId: 'mom',
      accountNumber: '123456789',
      status: 'pending'
    },
    {
      id: '2',
      type: 'water',
      provider: "Mom's Water Bill",
      amount: 250,
      dueDate: '2024-01-22',
      familyMemberId: 'mom',
      accountNumber: '987654321',
      status: 'pending'
    },
    {
      id: '3',
      type: 'wifi',
      provider: 'My WiFi Bill',
      amount: 500,
      dueDate: '2024-01-31',
      familyMemberId: 'self',
      accountNumber: '456789123',
      status: 'pending'
    }
  ]);

  // Show popup once daily if no parent bills are added
  useEffect(() => {
    const lastShown = localStorage.getItem('lastBillPopupShown');
    const today = new Date().toDateString();
    const hasParentBills = bills.some(bill => bill.familyMemberId !== 'self');
    
    if (lastShown !== today && !hasParentBills) {
      setShowBillPopup(true);
      localStorage.setItem('lastBillPopupShown', today);
    }
  }, [bills]);

  const handleAddBill = (billData: any) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      ...billData,
      status: 'pending' as const
    };
    setBills(prev => [...prev, newBill]);
    setShowAddBill(false);
  };

  const handlePayBill = (billId: string) => {
    setShowConfirmPayment(true);
  };

  const handleConfirmPayment = () => {
    setShowConfirmPayment(false);
    setShowPaymentSuccess(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentSuccess(false);
    setShowBillsScreen(false);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBillIcon = (type: string) => {
    switch (type) {
      case 'electricity': return <Zap className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      case 'wifi': return <Wifi className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const mockFamilyAvatars = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  ];

  if (showPaymentSuccess) {
    return <PaymentSuccessScreen onClose={handlePaymentComplete} />;
  }

  if (showConfirmPayment) {
    return (
      <ConfirmPaymentScreen
        onBack={() => setShowConfirmPayment(false)}
        onConfirmPayment={handleConfirmPayment}
      />
    );
  }

  if (showBillsScreen) {
    return (
      <BillsScreen
        bills={bills}
        familyMembers={familyMembers}
        onBack={() => setShowBillsScreen(false)}
        onPayBill={handlePayBill}
      />
    );
  }

  if (showAddBill) {
    return (
      <AddBillScreen
        familyMembers={familyMembers}
        onBack={() => setShowAddBill(false)}
        onAddBill={handleAddBill}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Family */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-900">Family</h1>
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Family Avatars */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {mockFamilyAvatars.map((avatar, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                <img src={avatar} alt="Family member" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-gray-600">
                {['Sophia', 'Ethan', 'Noah', 'Ava', 'Liam'][index]}
              </span>
            </div>
          ))}
        </div>

        {/* Wealth Death Clock */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Most Families' Wealth Disappears in
          </h2>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900">47</div>
              <div className="text-xs text-gray-600">Years</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900">04</div>
              <div className="text-xs text-gray-600">Months</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-600">weeks</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900">5</div>
              <div className="text-xs text-gray-600">Days</div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mb-4">
            It take only 7 minutes to hit pause on that clock
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 px-6 rounded-2xl">
            Stop the clock
          </button>
        </div>

        {/* Caring for Family */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Caring for Family</h2>
            <button 
              onClick={() => setShowAddBill(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
            >
              Add More
            </button>
          </div>
          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    {getBillIcon(bill.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{bill.provider}</h3>
                        <p className="text-gray-600 text-sm">₹{bill.amount}</p>
                        <p className="text-gray-500 text-sm">
                          Due in {getDaysUntilDue(bill.dueDate)} Days
                        </p>
                      </div>
                      <button 
                        onClick={() => handlePayBill(bill.id)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-4 rounded-xl text-sm"
                      >
                        Pay Now
                      </button>
                    </div>
                    {/* Family Contributors Row */}
                    {(bill.provider.includes("Mom's") || bill.provider.includes("Dad's")) && (
                      <div className="flex -space-x-2">
                        {mockFamilyAvatars.slice(0, 3).map((avatar, index) => (
                          <div key={index} className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                            <img src={avatar} alt="Family member" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setShowBillsScreen(true)}
            className="flex items-center gap-2 text-gray-600 mt-4"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">View All</span>
          </button>
        </div>

        {/* Vault Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Vault</h2>
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs">⚠</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 text-sm mb-2">Vault Activities</h3>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Manage Documents</h4>
                    <p className="text-gray-600 text-xs">Add, view, and manage important documents</p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              
              <button className="flex items-center gap-2 text-gray-600 mt-3">
                <span className="text-sm">View All</span>
                <Eye className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setShowAddBill(true)}
                className="flex items-center gap-2 text-purple-600 mt-2"
              >
                <span className="text-sm font-medium">Add Documents</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 px-6 rounded-2xl">
              Add Emergency Contact
            </button>
          </div>
        </div>

        {/* Dream Goal Progress */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 text-sm mb-2">Dream Goal Progress</h3>
          <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute right-4 top-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
            <h4 className="font-bold text-lg mb-1">Family Vacation</h4>
            <p className="text-sm opacity-90 mb-3">75% funded</p>
            <button className="bg-white bg-opacity-20 text-white font-medium py-2 px-4 rounded-xl text-sm">
              Contribute
            </button>
          </div>
        </div>

        {/* Payments & Requests */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payments & Requests</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">₹</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">UPI Delegation</h3>
                  <p className="text-gray-600 text-xs">Delegate UPI to family members</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">$</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Allowances</h3>
                  <p className="text-gray-600 text-xs">Set up allowances for children</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Parents</h3>
                  <p className="text-gray-600 text-xs">Set up UPI delegate payments for your parents</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1">
            <Home className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Family</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Star className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Dreams</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Finances</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Account</span>
          </button>
        </div>
      </div>

      {/* Parent Bill Popup */}
      {showBillPopup && (
        <ParentBillPopup
          onContinue={() => {
            setShowBillPopup(false);
            setShowAddBill(true);
          }}
          onMaybeLater={() => setShowBillPopup(false)}
        />
      )}
    </div>
  );
};

export default DashboardScreen;