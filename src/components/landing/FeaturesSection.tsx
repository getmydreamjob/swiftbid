// src/components/landing/FeaturesSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Users, Bell, FileText, BrainCircuit, Hammer } from "lucide-react"; // Updated import
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColorClass: string;
  iconColorClass: string;
}

const features: Feature[] = [
  {
    icon: UploadCloud,
    title: "Easy Plan Uploads",
    description: "Quickly upload your house plans in various formats (PDF, DOCX, JPEG, PNG) to start receiving bids.",
    bgColorClass: "bg-blue-100 dark:bg-blue-900",
    iconColorClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: BrainCircuit,
    title: "AI Contractor Matching",
    description: "Our smart AI suggests the best-suited contractors for your project based on their skills and your plans.",
    bgColorClass: "bg-purple-100 dark:bg-purple-900",
    iconColorClass: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Users,
    title: "Targeted Contractor Reach",
    description: "Connect with contractors whose expertise aligns with your project needs, ensuring relevant bids.",
    bgColorClass: "bg-green-100 dark:bg-green-900",
    iconColorClass: "text-green-600 dark:text-green-400",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Stay updated with instant in-app alerts for new bids, messages, and project status changes.",
    bgColorClass: "bg-yellow-100 dark:bg-yellow-900",
    iconColorClass: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: FileText,
    title: "Clear Plan Previews",
    description: "View uploaded plans directly within the app for easy review by both homeowners and contractors.",
    bgColorClass: "bg-indigo-100 dark:bg-indigo-900",
    iconColorClass: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Hammer, // Now using lucide-react Hammer
    title: "Streamlined Bidding",
    description: "Contractors can easily submit bids, ask questions, and manage their proposals all in one place.",
    bgColorClass: "bg-red-100 dark:bg-red-900",
    iconColorClass: "text-red-600 dark:text-red-400",
  },
];


export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why Choose <span className="text-primary">SwiftBid</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make finding and bidding on house plan projects seamless and efficient.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex flex-row items-start space-x-4 pb-4">
                <div className={`p-3 rounded-lg ${feature.bgColorClass}`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColorClass}`} />
                </div>
                <CardTitle className="text-xl font-semibold mt-1">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Custom Hammer SVG removed as we are now using lucide-react Hammer
