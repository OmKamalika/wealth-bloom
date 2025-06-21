import React, { useState } from 'react';
import { X, Share2, Download, Copy, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

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

  if (!isOpen) return null;

  const { inputs, results } = calculatorData;

  // Generate shareable content
  const shareText = `😱 I just discovered something shocking about my family's wealth timeline. My grandchildren will inherit $0 by ${results.extinctionYear}. 70% of family wealth disappears by generation 2. Find out when YOUR wealth dies.`;
  
  const shareUrl_generated = `${window.location.origin}/shared/${generateShareId(calculatorData)}`;

  const generateShareId = (data: any): string => {
    // In production, this would create a database entry and return the ID
    return btoa(JSON.stringify({
      extinctionYear: data.results.extinctionYear,
      childrenInheritance: data.results.childrenInheritance,
      netWorth: data.inputs.netWorth,
      children: data.inputs.children
    })).substring(0, 12);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl_generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl_generated);
    
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
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleDownloadPDF = () => {
    // In production, this would generate and download a PDF report
    console.log('Generating PDF report...');
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
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results Preview */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {results.extinctionYear}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Your family's wealth extinction date
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Today</div>
                <div className="text-gray-600">${inputs.netWorth.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Children Inherit</div>
                <div className="text-gray-600">${results.childrenInheritance.toLocaleString()}</div>
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
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-2 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
              >
                <Twitter className="w-5 h-5 text-sky-600" />
                <span className="text-sky-600 font-medium">Twitter</span>
              </button>
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-blue-700 font-medium">LinkedIn</span>
              </button>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
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
                value={shareUrl_generated}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {copied ? '✓' : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 font-medium">Download PDF Report</span>
          </button>
        </div>

        {/* Pre-written Messages */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Suggested Message:</h4>
          <p className="text-sm text-gray-600 italic">
            "{shareText}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;