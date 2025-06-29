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
    if (!data.results || !data.results.extinctionYear) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Invalid input data provided',
          message: 'Required fields: results.extinctionYear'
        })
      };
    }
    
    // Create anonymized data for sharing
    // Only include the essential data needed for sharing, removing any PII
    const anonymizedData = {
      results: {
        extinctionYear: data.results.extinctionYear,
        yearsRemaining: data.results.yearsRemaining,
        childrenInheritance: data.results.childrenInheritance,
        grandchildrenInheritance: data.results.grandchildrenInheritance,
        currentWealth: data.results.currentWealth,
        protectedScenario: {
          extinctionYear: data.results.protectedScenario?.extinctionYear,
          additionalYears: data.results.protectedScenario?.additionalYears,
          grandchildrenInheritance: data.results.protectedScenario?.grandchildrenInheritance
        }
      },
      inputs: {
        // Include only non-identifying information
        netWorth: data.inputs.financialFoundation?.currentNetWorth || data.inputs.netWorth,
        childrenCount: data.inputs.childrenContext?.children?.length || 0
      },
      createdAt: new Date().toISOString()
    };
    
    // Generate a unique ID for the share
    // In a real implementation, this would store the data in a database
    // and return a reference ID
    const shareId = generateUniqueId();
    
    // In a real implementation, you would store the anonymizedData in a database
    // using the shareId as the key
    // await storeShareData(shareId, anonymizedData);
    
    // Return the share URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        shareUrl: `${process.env.URL || 'https://wealthbloom.com'}/shared/${shareId}`,
        shareId: shareId
      })
    };
  } catch (error) {
    console.error('Error creating share link:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Error creating share link',
        message: error.message || 'Unknown error'
      })
    };
  }
};

// Generate a unique ID for sharing
function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}