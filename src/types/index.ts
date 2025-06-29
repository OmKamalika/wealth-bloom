export interface PersonalInfo {
  fullName: string;
  mobileNumber: string;
  email: string;
}

export interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  isoCode: string;
  mobileNumber: string;
  avatar?: string;
}

export interface LocationInfo {
  state: string;
  zipCode: string;
}

export interface AssetInfo {
  home: number;
  financialAccounts: number;
  everythingElse: number;
  specialItems: number;
  total: number;
}

export interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'wifi' | 'gas' | 'other';
  provider: string;
  amount: number;
  dueDate: string;
  familyMemberId: string;
  accountNumber: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface BillForm {
  familyMemberId: string;
  provider: string;
  accountNumber: string;
  amount: string;
  dueDate: string;
}

export type Screen = 
  | 'landing' 
  | 'wealth-calculator'
  | 'wealth-results'
  | 'wealth-extinction-results'
  | 'email-capture'
  | 'value-proposition' 
  | 'problem-solution' 
  | 'onboarding' 
  | 'family-builder'
  | 'location'
  | 'assets'
  | 'final-decisions'
  | 'dashboard'
  | 'add-bill'
  | 'bills'
  | 'confirm-payment'
  | 'payment-success'
  | 'signin'
  | 'signup'
  | 'password-reset'
  | 'profile';