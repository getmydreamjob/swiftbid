// src/components/landing/CTASection.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
          Ready to Start Your Next Project?
        </h2>
        <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Whether you're a homeowner looking for bids or a contractor seeking new opportunities, SwiftBid is your go-to platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            size="lg"
            variant="secondary" // Use secondary for contrast on primary background
            className="bg-white text-primary hover:bg-white/90 shadow-lg w-full sm:w-auto"
            asChild
          >
            <Link href="/client/create-bid">
              Homeowners: Post a Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 hover:text-white shadow-sm w-full sm:w-auto"
            asChild
          >
            <Link href="/contractor/dashboard">
              Contractors: Find Opportunities
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            "Fast & Easy Setup",
            "Secure & Reliable",
            "Transparent Process",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center justify-center sm:justify-start space-x-2 text-primary-foreground/90">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
