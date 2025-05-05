// backend/services/pdfReportService.js
const PDFDocument = require('pdfkit');

const generatePDFReport = (reportData) => {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    // You can then send this PDF as a response or save to disk
  });
  
  doc.fontSize(20).text('Daily Sales Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${reportData.date}`);
  doc.text(`Total Revenue: $${reportData.totalRevenue}`);
  doc.text(`Total Orders: ${reportData.totalOrders}`);
  doc.text(`Average Order Value: $${reportData.averageOrderValue}`);
  doc.text(`Page Views: ${reportData.pageViews}`);
  doc.text(`Customer Analytics: ${JSON.stringify(reportData.customerAnalytics)}`);
  
  doc.end();
  return buffers;
};

module.exports = { generatePDFReport };
