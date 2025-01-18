import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Template = {
  id: string;
  name: string;
  description: string;
  preview: string;
};

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
}

const TemplateSelector = ({ templates, selectedTemplate, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-lg",
            selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-[8.5/11] mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-500">{template.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;