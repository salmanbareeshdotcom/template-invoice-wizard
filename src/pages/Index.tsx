import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import TemplateSelector from "@/components/TemplateSelector";
import { templates } from "@/utils/invoiceTemplates";
import { generatePDF, InvoiceData } from "@/utils/pdfGenerator";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        console.log("CSV Parse Results:", results);
        if (results.data && results.data.length > 0) {
          try {
            const row = results.data[0] as any;
            const data: InvoiceData = {
              invoiceNo: row["Invoice No"],
              invoiceDate: row["Invoice date"],
              dueDate: row["Due date"],
              billToName: row["Bill to name"],
              billToAddress: row["Bill to address"],
              billFromName: row["Bill from Name"],
              billFromAddress: row["Bill from address"],
              items: [
                {
                  name: row["Line item 1 name"],
                  rate: parseFloat(row["Line item 1 rate"]),
                  quantity: parseInt(row["Line item 1 qty"]),
                  amount: parseFloat(row["Line item 1 amount"])
                },
                {
                  name: row["Line item 2 name"],
                  rate: parseFloat(row["Line item 2 rate"]),
                  quantity: parseInt(row["Line item 2 qty"]),
                  amount: parseFloat(row["Line item 2 amount"])
                }
              ],
              subtotal: parseFloat(row["Subtotal"]),
              taxRate: parseFloat(row["Tax rate"])
            };
            setInvoiceData(data);
            setCsvFile(file);
            toast({
              title: "CSV uploaded successfully",
              description: "Your invoice data has been loaded.",
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
    if (!invoiceData) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please upload a CSV file first.",
      });
      return;
    }

    try {
      const doc = generatePDF(selectedTemplate, invoiceData);
      doc.save(`invoice-${invoiceData.invoiceNo}.pdf`);
      toast({
        title: "PDF generated successfully",
        description: "Your invoice has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Error generating PDF",
        description: "An error occurred while generating the PDF.",
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
                Uploaded: {csvFile.name}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">2. Select Template</h2>
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">3. Generate PDF</h2>
            <Button
              onClick={handleGeneratePDF}
              disabled={!invoiceData}
              className="w-full md:w-auto"
            >
              Generate Invoice PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;