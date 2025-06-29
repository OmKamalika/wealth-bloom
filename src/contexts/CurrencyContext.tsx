// src/contexts/CurrencyContext.tsx
// Context provider for currency information throughout the app

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { CurrencyInfo, defaultCurrency, getCurrencyInfoFromCountry } from '../utils/currencyData';
import { detectUserCurrency, getCountryFromIP } from '../utils/geolocation';

interface CurrencyContextType {
  currencyInfo: CurrencyInfo;
  setCurrencyInfo: React.Dispatch<React.SetStateAction<CurrencyInfo>>;
  isLoading: boolean;
  error: Error | null;
  detectedCountryCode: string | null;
  setDetectedCountryCode: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with a default value
const CurrencyContext = createContext<CurrencyContextType>({
  currencyInfo: defaultCurrency,
  setCurrencyInfo: () => {},
  isLoading: true,
  error: null,
  detectedCountryCode: null,
  setDetectedCountryCode: () => {}
});

// Custom hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: ReactNode;
}

// Provider component
export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(defaultCurrency);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [detectedCountryCode, setDetectedCountryCode] = useState<string | null>(null);

  // Detect user's currency on component mount
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        setIsLoading(true);
        
        // Try to detect currency using geolocation
        const detectedCurrency = await detectUserCurrency();
        setCurrencyInfo(detectedCurrency);
        
        // Try to get country code from IP as fallback
        if (!detectedCountryCode) {
          try {
            const countryCode = await getCountryFromIP();
            setDetectedCountryCode(countryCode);
          } catch (ipError) {
            console.error('Error getting country from IP:', ipError);
          }
        }
      } catch (err) {
        console.error('Error detecting currency:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Fallback to default currency
        setCurrencyInfo(defaultCurrency);
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  // Update currency when country code changes
  useEffect(() => {
    if (detectedCountryCode) {
      const currency = getCurrencyInfoFromCountry(detectedCountryCode);
      setCurrencyInfo(currency);
    }
  }, [detectedCountryCode]);

  const value = {
    currencyInfo,
    setCurrencyInfo,
    isLoading,
    error,
    detectedCountryCode,
    setDetectedCountryCode
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};