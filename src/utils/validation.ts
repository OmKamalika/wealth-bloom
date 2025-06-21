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
  
  return 'Please enter a valid Indian mobile number (10 digits starting with 6-9)';
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