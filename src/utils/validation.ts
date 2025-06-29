export const validateFullName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Full name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (!/^[a-zA-Z\s.]+$/.test(name.trim())) {
    return 'Name can only contain letters, spaces, and dots';
  }
  return undefined;
};

export const validateIndianMobile = (mobile: string): string | undefined => {
  // Remove all non-digit characters
  const digits = mobile.replace(/\D/g, '');
  
  if (!digits) {
    return 'Mobile number is required';
  }
  
  // Check if it starts with +91 or 91 or is 10 digits
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return undefined; // Valid 10-digit number
  }
  
  if (digits.length === 12 && digits.startsWith('91') && /^91[6-9]\d{9}$/.test(digits)) {
    return undefined; // Valid with 91 prefix
  }
  
  return 'Please enter a valid mobile number';
};

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

export const formatIndianMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, '');
  
  if (digits.length <= 10) {
    return digits.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  
  if (digits.length === 12 && digits.startsWith('91')) {
    const number = digits.substring(2);
    return `+91 ${number.replace(/(\d{5})(\d{5})/, '$1 $2')}`;
  }
  
  return mobile;
};

// Validate mobile number for any country
export const validateMobile = (mobile: string, isoCode: string): string | undefined => {
  // Remove all non-digit characters
  const digits = mobile.replace(/\D/g, '');
  
  if (!digits) {
    return 'Mobile number is required';
  }
  
  // Different validation rules based on country code
  switch (isoCode) {
    case '+91': // India
      if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
        return undefined;
      }
      return 'Please enter a valid Indian mobile number (10 digits starting with 6-9)';
      
    case '+1': // US/Canada
      if (digits.length === 10 && /^\d{10}$/.test(digits)) {
        return undefined;
      }
      return 'Please enter a valid US/Canada mobile number (10 digits)';
      
    case '+44': // UK
      if ((digits.length === 10 || digits.length === 11) && /^7\d{9,10}$/.test(digits)) {
        return undefined;
      }
      return 'Please enter a valid UK mobile number';
      
    default:
      // Generic validation - just check if it's a reasonable length
      if (digits.length >= 8 && digits.length <= 15) {
        return undefined;
      }
      return 'Please enter a valid mobile number';
  }
};

// Validate calculator data
export const validateCalculatorData = (data: any): string | undefined => {
  if (!data) {
    return 'Calculator data is required';
  }
  
  if (!data.coreIdentity) {
    return 'Core identity data is missing';
  }
  
  if (!data.financialFoundation) {
    return 'Financial foundation data is missing';
  }
  
  if (data.coreIdentity.age < 18 || data.coreIdentity.age > 100) {
    return 'Age must be between 18 and 100';
  }
  
  if (data.financialFoundation.currentNetWorth < 0) {
    return 'Net worth cannot be negative';
  }
  
  if (data.financialFoundation.annualIncome < 0) {
    return 'Annual income cannot be negative';
  }
  
  // Validate investment allocation
  const { stocks, bonds, realEstate, alternatives } = data.financialFoundation.investmentAllocation;
  const totalAllocation = stocks + bonds + realEstate + alternatives;
  if (Math.abs(totalAllocation - 1) > 0.01) {
    return 'Investment allocation must sum to 1';
  }
  
  return undefined;
};