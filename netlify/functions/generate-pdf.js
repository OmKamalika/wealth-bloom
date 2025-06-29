const PDFDocument = require('pdfkit');

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
    const calculatorData = JSON.parse(event.body);
    const { inputs, results, currencyCode, locale } = calculatorData;
    
    // Validate input data
    if (!results || !results.extinctionYear) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Invalid input data provided',
          message: 'Missing calculation results'
        })
      };
    }
    
    // Format currency based on provided locale and currency code
    const formatCurrency = (amount) => {
      try {
        return new Intl.NumberFormat(locale || 'en-IN', {
          style: 'currency',
          currency: currencyCode || 'INR',
          maximumFractionDigits: 0
        }).format(amount);
      } catch (error) {
        // Fallback if Intl.NumberFormat fails
        const currencySymbol = currencyCode === 'USD' ? '$' : 
                              currencyCode === 'EUR' ? '€' : 
                              currencyCode === 'GBP' ? '£' : '₹';
        return `${currencySymbol}${amount.toLocaleString()}`;
      }
    };
    
    // Create a PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    // Collect the PDF data chunks
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    // Add content to the PDF
    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#4f46e5').text('Wealth Extinction Analysis', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).font('Helvetica').fillColor('#666').text('Prepared on ' + new Date().toLocaleDateString(), { align: 'center' });
    doc.moveDown(2);
    
    // Key findings
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#000').text('Key Findings');
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#ef4444').text(`Wealth Extinction Year: ${results.extinctionYear}`);
    doc.fontSize(12).font('Helvetica').fillColor('#666').text(`Your family's wealth will be depleted in ${results.yearsRemaining} years.`);
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Current Wealth:');
    doc.fontSize(12).font('Helvetica').fillColor('#000').text(formatCurrency(results.currentWealth));
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Inheritance Impact:');
    doc.fontSize(12).font('Helvetica').fillColor('#000').text(`Children will inherit: ${formatCurrency(results.childrenInheritance)}`);
    doc.fontSize(12).font('Helvetica').fillColor('#000').text(`Grandchildren will inherit: ${formatCurrency(results.grandchildrenInheritance)}`);
    doc.moveDown(2);
    
    // Top wealth destroyers
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#000').text('Top Wealth Destroyers');
    doc.moveDown();
    
    if (results.topWealthDestroyers && results.topWealthDestroyers.length > 0) {
      results.topWealthDestroyers.forEach((destroyer, index) => {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text(`${index + 1}. ${destroyer.factor}`);
        doc.fontSize(12).font('Helvetica').fillColor('#666').text(destroyer.description);
        doc.fontSize(12).font('Helvetica').fillColor('#ef4444').text(`Impact: ${formatCurrency(destroyer.impact)}`);
        doc.moveDown();
      });
    } else {
      doc.fontSize(12).font('Helvetica').fillColor('#666').text('No specific wealth destroyers identified.');
    }
    doc.moveDown();
    
    // Protected scenario
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#000').text('Protected Scenario');
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#10b981').text(`Extended Extinction Year: ${results.protectedScenario?.extinctionYear || (results.extinctionYear + 5)}`);
    doc.fontSize(12).font('Helvetica').fillColor('#666').text(`With proper planning, you can extend your wealth timeline by ${results.protectedScenario?.additionalYears || 5} years.`);
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Recommended Improvements:');
    
    if (results.protectedScenario?.improvements && results.protectedScenario.improvements.length > 0) {
      results.protectedScenario.improvements.forEach((improvement, index) => {
        doc.fontSize(12).font('Helvetica').fillColor('#000').text(`• ${improvement}`);
      });
    } else {
      doc.fontSize(12).font('Helvetica').fillColor('#666').text('• Family coordination optimization');
      doc.fontSize(12).font('Helvetica').fillColor('#666').text('• Investment strategy refinement');
      doc.fontSize(12).font('Helvetica').fillColor('#666').text('• Estate planning efficiency');
    }
    doc.moveDown(2);
    
    // Next steps
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#000').text('Next Steps');
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica').fillColor('#000').text('1. Schedule a consultation with our wealth protection experts');
    doc.fontSize(12).font('Helvetica').fillColor('#000').text('2. Create your family coordination plan');
    doc.fontSize(12).font('Helvetica').fillColor('#000').text('3. Implement the recommended improvements');
    doc.fontSize(12).font('Helvetica').fillColor('#000').text('4. Monitor your wealth timeline regularly');
    doc.moveDown(2);
    
    // Footer
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('This report is for educational purposes only and does not constitute financial advice.', { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('© 2025 Wealth Bloom. All rights reserved.', { align: 'center' });
    
    // Finalize the PDF
    doc.end();
    
    // Collect the PDF data
    const pdfBuffer = await new Promise(resolve => {
      const data = Buffer.concat(chunks);
      resolve(data);
    });
    
    // Return the PDF with appropriate headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=wealth-extinction-report.pdf',
        'Cache-Control': 'private, max-age=3600'
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Error generating PDF',
        message: error.message || 'Unknown error'
      })
    };
  }
};