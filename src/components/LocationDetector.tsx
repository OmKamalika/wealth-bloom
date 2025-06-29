import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, MapPin, Globe, Clock, CheckCircle } from 'lucide-react';
import { getOptimizedLocation } from '../utils/geolocation';

interface LocationDetectorProps {
  onLocationDetected: (location: {
    state: string;
    city: string;
    zipCode: string;
    cityType: 'metro' | 'tier2' | 'tier3' | 'rural';
  }) => void;
  onError?: (error: Error) => void;
  // New prop for non-blocking behavior
  nonBlocking?: boolean;
  // Default location to use while detecting
  defaultLocation?: {
    state: string;
    city: string;
    zipCode: string;
    cityType: 'metro' | 'tier2' | 'tier3' | 'rural';
  };
}

const LocationDetector: React.FC<LocationDetectorProps> = ({ 
  onLocationDetected, 
  onError,
  nonBlocking = true,
  defaultLocation = {
    state: 'Maharashtra',
    city: 'Mumbai',
    zipCode: '',
    cityType: 'metro'
  }
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'success' | 'failed' | 'timeout'>('idle');
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const detectionStartTime = useRef<number>(0);

  const formData = {
    state: currentLocation.state,
    city: currentLocation.city,
    zipCode: currentLocation.zipCode,
    cityType: currentLocation.cityType
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    setError(null);
    setDetectionStatus('detecting');
    detectionStartTime.current = Date.now();

    // Set a timeout for the entire detection process
    timeoutRef.current = setTimeout(() => {
      if (detectionStatus === 'detecting') {
        setDetectionStatus('timeout');
        setIsDetecting(false);
        setError('Location detection timed out. You can continue with manual entry.');
        if (nonBlocking) {
          // Use default location if non-blocking
          onLocationDetected(defaultLocation);
        }
      }
    }, 8000); // 8 second timeout

    try {
      // Use optimized location detection
      const locationData = await getOptimizedLocation();
      
      // Clear timeout since we succeeded
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      const location = {
        state: locationData.state,
        city: locationData.city,
        zipCode: '',
        cityType: locationData.cityType
      };
      
      setCurrentLocation(location);
      setDetectionStatus('success');
      
      // Call the callback with the detected location
      onLocationDetected(location);
      
    } catch (error) {
      console.error('Error detecting location:', error);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setError(error instanceof Error ? error.message : 'Unknown error');
      setDetectionStatus('failed');
      
      if (onError) onError(error instanceof Error ? error : new Error('Unknown error'));
      
      // If non-blocking, use default location and allow manual override
      if (nonBlocking) {
        onLocationDetected(defaultLocation);
      } else {
        setManualInput(true);
      }
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationDetected(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedLocation = { ...currentLocation, [name]: value };
    setCurrentLocation(updatedLocation);
    onLocationDetected(updatedLocation); // Update in real-time
  };

  const handleSkipDetection = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDetecting(false);
    setDetectionStatus('idle');
    onLocationDetected(defaultLocation);
  };

  useEffect(() => {
    // Auto-detect location on component mount if non-blocking
    if (nonBlocking) {
      // Start with default location immediately
      onLocationDetected(defaultLocation);
      // Then try to enhance with real location
      detectLocation();
    } else {
      // Blocking mode - wait for location before proceeding
      detectLocation();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Show detection progress
  if (isDetecting && detectionStatus === 'detecting') {
    const elapsed = Date.now() - detectionStartTime.current;
    const progress = Math.min((elapsed / 8000) * 100, 100);
    
    return (
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Detecting Your Location</h3>
          <p className="text-gray-600 text-sm mb-4">This helps us provide location-specific insights</p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            {elapsed < 3000 
              ? 'Getting GPS coordinates...' 
              : elapsed < 6000 
                ? 'Looking up your city...' 
                : 'Almost done...'
            }
          </p>
        </div>
        
        {nonBlocking && (
          <button
            onClick={handleSkipDetection}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Skip & Continue
          </button>
        )}
      </div>
    );
  }

  // Show success state briefly
  if (detectionStatus === 'success' && !manualInput) {
    return (
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Location Detected!</h3>
            <p className="text-green-700 text-sm">
              {currentLocation.city}, {currentLocation.state} ({currentLocation.cityType})
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setManualInput(true)}
            className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-300 transition-colors"
          >
            Edit Location
          </button>
          
          <button
            onClick={detectLocation}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Detect Again
          </button>
        </div>
      </div>
    );
  }

  // Show timeout or error state
  if (detectionStatus === 'timeout' || detectionStatus === 'failed') {
    return (
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">
              {detectionStatus === 'timeout' ? 'Location Detection Timed Out' : 'Location Detection Failed'}
            </h3>
            <p className="text-yellow-700 text-sm mb-2">
              {detectionStatus === 'timeout' 
                ? 'We\'re using a default location. You can edit it below.' 
                : error || 'Unable to detect your location automatically.'}
            </p>
            <p className="text-yellow-700 text-sm">
              Current: {currentLocation.city}, {currentLocation.state} ({currentLocation.cityType})
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setManualInput(true)}
            className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-300 transition-colors"
          >
            Edit Location
          </button>
          
          <button
            onClick={detectLocation}
            className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Manual input form
  if (manualInput) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Your Location</h3>
        
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={currentLocation.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your city"
              required
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={currentLocation.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your state"
              required
            />
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={currentLocation.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your zip/postal code"
            />
          </div>
          
          <div>
            <label htmlFor="cityType" className="block text-sm font-medium text-gray-700 mb-1">City Type</label>
            <select
              id="cityType"
              name="cityType"
              value={currentLocation.cityType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="metro">Metro City (Mumbai, Delhi, etc.)</option>
              <option value="tier2">Tier 2 City (Pune, Jaipur, etc.)</option>
              <option value="tier3">Tier 3 City (Smaller cities)</option>
              <option value="rural">Rural Area</option>
            </select>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={detectLocation}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Auto-Detect
            </button>
            
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Save Location
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

export default LocationDetector;