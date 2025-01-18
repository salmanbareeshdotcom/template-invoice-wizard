import { Template } from "@/components/TemplateSelector";

export const templates: Template[] = [
  {
    id: "standard",
    name: "Standard Invoice",
    description: "A clean, professional invoice layout suitable for most businesses",
    preview: "/placeholder.svg"
  },
  {
    id: "itemized",
    name: "Itemized Invoice",
    description: "Detailed layout with emphasis on line items and descriptions",
    preview: "/placeholder.svg"
  },
  {
    id: "service",
    name: "Service Invoice",
    description: "Perfect for service-based businesses and consultants",
    preview: "/placeholder.svg"
  }
];