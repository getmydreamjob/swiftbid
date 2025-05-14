import { Hero } from "@/components/landing/Hero";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <Hero />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
