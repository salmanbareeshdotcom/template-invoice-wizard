import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import { generatePDF, InvoiceData } from "@/utils/pdfGenerator";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        console.log("CSV Parse Results:", results);
        if (results.data && results.data.length > 0) {
          try {
            const invoices: InvoiceData[] = results.data
              .filter((row: any) => row["Invoice Date"]) // Filter out empty rows
              .map((row: any) => ({
                invoiceNo: "INV-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
                invoiceDate: row["Invoice Date"],
                dueDate: row["Due Date"],
                billToName: row["Bill to Name"],
                billToAddress: row["Bill to Address"],
                billFromName: row["Bill from Name"],
                billFromAddress: row["Bill from Address"],
                items: [
                  {
                    name: row["Line Item 1 Name"],
                    description: row["Line Item 1 Description"],
                    rate: parseFloat(row["Line Item 1 Rate"].replace("$", "").replace(",", "")),
                    quantity: 1,
                    amount: parseFloat(row["Line Item 1 Amount"].replace("$", "").replace(",", ""))
                  }
                ],
                subtotal: parseFloat(row["Total Amount"].replace("$", "").replace(",", "")),
                taxRate: 10
              }));

            setInvoiceData(invoices);
            setCsvFile(file);
            toast({
              title: "CSV uploaded successfully",
              description: `${invoices.length} invoice(s) data has been loaded.`,
            });
          } catch (error) {
            console.error("Error parsing CSV:", error);
            toast({
              variant: "destructive",
              title: "Error parsing CSV",
              description: "Please make sure your CSV follows the required format.",
            });
          }
        }
      },
      header: true,
    });
  };

  const handleGeneratePDF = () => {
    if (invoiceData.length === 0) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please upload a CSV file first.",
      });
      return;
    }

    try {
      invoiceData.forEach((data, index) => {
        const doc = generatePDF(data);
        doc.save(`invoice-${data.invoiceNo}.pdf`);
      });
      
      toast({
        title: "PDFs generated successfully",
        description: `Generated ${invoiceData.length} invoice(s).`,
      });
    } catch (error) {
      console.error("Error generating PDFs:", error);
      toast({
        variant: "destructive",
        title: "Error generating PDFs",
        description: "An error occurred while generating the PDFs.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Invoice Generator</h1>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">1. Upload CSV</h2>
            <FileUpload onFileAccepted={handleFileUpload} />
            {csvFile && (
              <p className="mt-2 text-sm text-gray-500">
                Uploaded: {csvFile.name} ({invoiceData.length} invoice(s))
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">2. Generate PDFs</h2>
            <Button
              onClick={handleGeneratePDF}
              disabled={invoiceData.length === 0}
              className="w-full md:w-auto"
            >
              Generate {invoiceData.length} Invoice PDF{invoiceData.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;