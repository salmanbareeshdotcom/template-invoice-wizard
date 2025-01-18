import jsPDF from 'jspdf';

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  billToName: string;
  billToAddress: string;
  billFromName: string;
  billFromAddress: string;
  items: Array<{
    name: string;
    description: string;
    rate: number;
    quantity: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate: number;
}

export const generatePDF = (data: InvoiceData): jsPDF => {
  console.log('Generating PDF for invoice:', data.invoiceNo);
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, 20, { align: 'center' });
  
  // Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${data.invoiceNo}`, 15, 40);
  doc.text(`Date: ${data.invoiceDate}`, 15, 45);
  doc.text(`Due Date: ${data.dueDate}`, 15, 50);
  
  // Billing details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill From:', 15, 70);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.billFromName || '', 15, 77);
  doc.text(data.billFromAddress || '', 15, 84);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', pageWidth - 90, 70);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.billToName || '', pageWidth - 90, 77);
  doc.text(data.billToAddress || '', pageWidth - 90, 84);
  
  // Table header
  const startY = 100;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, startY, pageWidth - 30, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, startY + 7);
  doc.text('Description', 70, startY + 7);
  doc.text('Rate', 130, startY + 7);
  doc.text('Qty', 150, startY + 7);
  doc.text('Amount', 170, startY + 7);
  
  // Table content
  let currentY = startY + 15;
  doc.setFont('helvetica', 'normal');
  
  data.items.forEach(item => {
    if (item.name) {
      doc.text(item.name.toString(), 20, currentY);
      doc.text(item.description || '', 70, currentY);
      doc.text(`$${item.rate.toFixed(2)}`, 130, currentY);
      doc.text(item.quantity.toString(), 150, currentY);
      doc.text(`$${item.amount.toFixed(2)}`, 170, currentY);
      currentY += 10;
    }
  });
  
  // Totals
  currentY += 10;
  const totalsX = 140;
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal:', totalsX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${data.subtotal.toFixed(2)}`, 170, currentY);
  
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Tax Rate:', totalsX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.taxRate}%`, 170, currentY);
  
  currentY += 8;
  const tax = data.subtotal * (data.taxRate / 100);
  doc.setFont('helvetica', 'bold');
  doc.text('Tax:', totalsX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${tax.toFixed(2)}`, 170, currentY);
  
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', totalsX, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${(data.subtotal + tax).toFixed(2)}`, 170, currentY);
  
  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });
  
  console.log('PDF generation completed for invoice:', data.invoiceNo);
  return doc;
};