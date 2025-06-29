import React, { useState, useEffect } from 'react';
import { X, Share2, Download, Copy, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorData: any;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  calculatorData
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [ogImageUrl, setOgImageUrl] = useState('');
  const { currencyInfo } = useCurrency();

  // Generate share URL and OG image when modal opens
  useEffect(() => {
    if (isOpen && calculatorData) {
      generateShareUrl();
      generateOgImage();
    }
  }, [isOpen, calculatorData]);

  if (!isOpen) return null;

  const { inputs, results } = calculatorData || {};

  // Generate shareable content
  const shareText = `😱 I just discovered something shocking about my family's wealth timeline. My grandchildren will inherit ${formatCurrency(results?.grandchildrenInheritance || 0, currencyInfo)} by ${results?.extinctionYear || 2050}. 70% of family wealth disappears by generation 2. Find out when YOUR wealth dies.`;

  // Generate share URL
  const generateShareUrl = async () => {
    try {
      // In a real implementation, this would call a backend API to create a shareable link
      // For now, we'll simulate it with a local URL
      const shareId = generateShareId(calculatorData);
      const generatedUrl = `${window.location.origin}/shared/${shareId}`;
      setShareUrl(generatedUrl);
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      // Fallback to a basic URL
      setShareUrl(`${window.location.origin}/calculator`);
    }
  };

  // Generate OG image
  const generateOgImage = async () => {
    setIsGeneratingImage(true);
    try {
      // In a real implementation, this would call a backend API to generate an image
      // For now, we'll simulate it with a placeholder
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // This would be replaced with the actual API call:
      // const response = await fetch('/api/generate-og-image', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     extinctionYear: results.extinctionYear,
      //     yearsRemaining: results.yearsRemaining,
      //     childrenInheritance: results.childrenInheritance,
      //     grandchildrenInheritance: results.grandchildrenInheritance,
      //     currencyCode: currencyInfo.code,
      //     locale: currencyInfo.locale
      //   })
      // });
      // const data = await response.json();
      // setOgImageUrl(data.imageUrl);
      
      // Placeholder for demo
      setOgImageUrl('https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop');
    } catch (error) {
      console.error('Failed to generate OG image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateShareId = (data: any): string => {
    // In production, this would create a database entry and return the ID
    // For now, we'll create a simple hash of the key data
    const keyData = {
      extinctionYear: data.results.extinctionYear,
      childrenInheritance: data.results.childrenInheritance,
      netWorth: data.inputs.financialFoundation?.currentNetWorth || data.inputs.netWorth,
      children: data.inputs.childrenContext?.children?.length || data.inputs.children
    };
    
    // Create a simple hash
    return btoa(JSON.stringify(keyData)).substring(0, 12);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      analytics.track('share_link_copied', { source: 'social_modal' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      analytics.track('social_share_initiated', { 
        platform, 
        extinction_year: results?.extinctionYear,
        emotional_state: analytics.getEmotionalMetrics()
      });
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      analytics.track('pdf_download_initiated', { 
        extinction_year: results?.extinctionYear
      });
      
      // In a real implementation, this would call a backend API to generate a PDF
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // This would be replaced with the actual API call:
      // const response = await fetch('/api/generate-pdf', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...calculatorData,
      //     currencyCode: currencyInfo.code,
      //     locale: currencyInfo.locale
      //   })
      // });
      
      // if (response.ok) {
      //   const blob = await response.blob();
      //   const url = window.URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = `wealth-extinction-report-${new Date().toISOString().split('T')[0]}.pdf`;
      //   document.body.appendChild(a);
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      //   document.body.removeChild(a);
      // }
      
      // For demo, show success message
      alert('PDF report would be downloaded in the actual implementation');
      
      analytics.track('pdf_download_completed', { 
        extinction_year: results?.extinctionYear
      });
    } catch (error) {
      console.error('Failed to download PDF:', error);
      analytics.track('pdf_download_failed', { 
        extinction_year: results?.extinctionYear,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Share Your Results</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results Preview */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {results?.extinctionYear || 2050}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Your family's wealth extinction date
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Today</div>
                <div className="text-gray-600">{formatCurrency(results?.currentWealth || 0, currencyInfo)}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Children Inherit</div>
                <div className="text-gray-600">{formatCurrency(results?.childrenInheritance || 0, currencyInfo)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          {/* Social Platforms */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Share on Social Media</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-2 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5 text-sky-600" />
                <span className="text-sky-600 font-medium">Twitter</span>
              </button>
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-blue-700 font-medium">LinkedIn</span>
              </button>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Share Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm"
                aria-label="Share URL"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
                aria-label="Copy link"
              >
                {copied ? '✓' : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            aria-label="Download PDF report"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 font-medium">Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">Download PDF Report</span>
              </>
            )}
          </button>
        </div>

        {/* Pre-written Messages */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Suggested Message:</h4>
          <p className="text-sm text-gray-600 italic">
            "{shareText}"
          </p>
        </div>

        {/* Hidden OG image for debugging */}
        {ogImageUrl && (
          <div className="hidden">
            <img src={ogImageUrl} alt="Share preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialShareModal;