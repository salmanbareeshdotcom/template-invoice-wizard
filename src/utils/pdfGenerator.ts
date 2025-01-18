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
    rate: number;
    quantity: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate: number;
}

export const generatePDF = (templateId: string, data: InvoiceData): jsPDF => {
  const doc = new jsPDF();
  
  // Common header
  doc.setFontSize(20);
  doc.text("INVOICE", 105, 20, { align: "center" });
  
  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice No: ${data.invoiceNo}`, 20, 40);
  doc.text(`Date: ${data.invoiceDate}`, 20, 45);
  doc.text(`Due Date: ${data.dueDate}`, 20, 50);
  
  // Billing details
  doc.setFontSize(12);
  doc.text("Bill From:", 20, 70);
  doc.setFontSize(10);
  doc.text(data.billFromName, 20, 75);
  doc.text(data.billFromAddress, 20, 80);
  
  doc.setFontSize(12);
  doc.text("Bill To:", 120, 70);
  doc.setFontSize(10);
  doc.text(data.billToName, 120, 75);
  doc.text(data.billToAddress, 120, 80);
  
  // Items table
  let yPos = 100;
  doc.setFontSize(10);
  doc.text("Item", 20, yPos);
  doc.text("Rate", 100, yPos);
  doc.text("Qty", 130, yPos);
  doc.text("Amount", 160, yPos);
  
  yPos += 10;
  data.items.forEach(item => {
    doc.text(item.name, 20, yPos);
    doc.text(`$${item.rate.toFixed(2)}`, 100, yPos);
    doc.text(item.quantity.toString(), 130, yPos);
    doc.text(`$${item.amount.toFixed(2)}`, 160, yPos);
    yPos += 10;
  });
  
  // Totals
  yPos += 10;
  doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 160, yPos, { align: "right" });
  yPos += 10;
  const tax = data.subtotal * (data.taxRate / 100);
  doc.text(`Tax (${data.taxRate}%): $${tax.toFixed(2)}`, 160, yPos, { align: "right" });
  yPos += 10;
  doc.text(`Total: $${(data.subtotal + tax).toFixed(2)}`, 160, yPos, { align: "right" });
  
  return doc;
};