const sharp = require('sharp');

exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.extinctionYear || !data.yearsRemaining) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
          message: 'Required fields: extinctionYear, yearsRemaining'
        })
      };
    }
    
    // Format currency based on provided locale and currency code
    const formatCurrency = (amount) => {
      try {
        return new Intl.NumberFormat(data.locale || 'en-IN', {
          style: 'currency',
          currency: data.currencyCode || 'INR',
          maximumFractionDigits: 0
        }).format(amount);
      } catch (error) {
        // Fallback if Intl.NumberFormat fails
        const currencySymbol = data.currencyCode === 'USD' ? '$' : 
                              data.currencyCode === 'EUR' ? '€' : 
                              data.currencyCode === 'GBP' ? '£' : '₹';
        return `${currencySymbol}${amount.toLocaleString()}`;
      }
    };

    // Create an SVG template with the data
    const svgTemplate = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4f46e5" />
            <stop offset="100%" stop-color="#7e22ce" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)" />
        <rect x="50" y="50" width="1100" height="530" rx="20" fill="white" opacity="0.1" />
        
        <text x="600" y="150" font-family="Arial" font-size="48" font-weight="bold" fill="white" text-anchor="middle">WEALTH EXTINCTION ALERT</text>
        
        <text x="600" y="250" font-family="Arial" font-size="72" font-weight="bold" fill="#ef4444" text-anchor="middle">${data.extinctionYear}</text>
        <text x="600" y="300" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Your family's wealth dies in ${data.yearsRemaining} years</text>
        
        <text x="600" y="380" font-family="Arial" font-size="32" fill="white" text-anchor="middle">Children inherit: ${formatCurrency(data.childrenInheritance || 0)}</text>
        <text x="600" y="430" font-family="Arial" font-size="32" fill="white" text-anchor="middle">Grandchildren inherit: ${formatCurrency(data.grandchildrenInheritance || 0)}</text>
        
        <text x="600" y="520" font-family="Arial" font-size="28" fill="white" text-anchor="middle">Calculate your family's wealth timeline at wealthbloom.com</text>
        
        <text x="600" y="580" font-family="Arial" font-size="24" fill="white" opacity="0.7" text-anchor="middle">70% of family wealth disappears by generation 2</text>
      </svg>
    `;

    // Convert SVG to PNG
    const pngBuffer = await sharp(Buffer.from(svgTemplate))
      .png()
      .toBuffer();

    // Return the image with appropriate headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000'
      },
      body: pngBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Error generating image',
        message: error.message || 'Unknown error'
      })
    };
  }
};