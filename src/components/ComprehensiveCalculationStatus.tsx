import React, { useEffect, useState } from 'react';
import { getCalculationJobStatus, getCalculationResults } from '../api/tiered-calculation-api';
import { Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface ComprehensiveCalculationStatusProps {
  jobId: string;
  onComplete: (results: any) => void;
}

const ComprehensiveCalculationStatus: React.FC<ComprehensiveCalculationStatusProps> = ({ 
  jobId, 
  onComplete 
}) => {
  const [status, setStatus] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Poll for job status
    const intervalId = setInterval(async () => {
      try {
        const jobStatus = await getCalculationJobStatus(jobId);
        
        if (jobStatus) {
          setStatus(jobStatus);
          setProgress(jobStatus.progress);
          
          if (jobStatus.status === 'completed') {
            // Get results
            const results = await getCalculationResults(jobId);
            
            if (results) {
              onComplete(results);
              clearInterval(intervalId);
            }
          } else if (jobStatus.status === 'failed') {
            setError(jobStatus.error || 'Calculation failed');
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        setError('Error checking calculation status');
      } finally {
        setIsLoading(false);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [jobId, onComplete]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mr-3"></div>
          <p className="text-gray-700">Loading calculation status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 shadow-md border border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-800 mb-2">Calculation Error</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-yellow-50 rounded-2xl p-6 shadow-md border border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">Calculation Not Found</h3>
            <p className="text-yellow-700">The calculation job could not be found. It may have expired or been cancelled.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 rounded-2xl p-6 shadow-md border border-purple-200">
      <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Comprehensive Analysis in Progress
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-purple-700 mb-1">
          <span>{status.currentStep || 'Processing'}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-purple-200 rounded-full">
          <div 
            className="h-2 bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-sm text-purple-700">
        <p className="mb-2">
          <strong>Status:</strong> {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
        </p>
        <p className="mb-2">
          <strong>Started:</strong> {status.startedAt ? new Date(status.startedAt).toLocaleTimeString() : 'Pending'}
        </p>
        {status.estimatedTimeRemaining && (
          <p>
            <strong>Estimated time remaining:</strong> {Math.round(status.estimatedTimeRemaining / 60)} minutes
          </p>
        )}
      </div>
      
      <div className="mt-4 bg-white rounded-xl p-4 border border-purple-100">
        <h4 className="font-medium text-purple-800 mb-2">What's happening?</h4>
        <p className="text-sm text-purple-700">
          Our advanced calculation engine is running 5,000+ Monte Carlo simulations to provide you with the most accurate wealth projection possible. This includes extreme value analysis, behavioral finance adjustments, and detailed family impact analysis.
        </p>
      </div>
    </div>
  );
};

export default ComprehensiveCalculationStatus;