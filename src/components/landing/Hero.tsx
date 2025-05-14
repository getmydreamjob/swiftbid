// src/components/landing/Hero.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Hammer } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background elements can be added here */}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Get Your <span className="text-primary">House Plans</span> Bid On, Fast.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            SwiftBid is the easiest way for homeowners to connect with qualified contractors and receive competitive bids for their construction projects.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transition-shadow">
              <Link href="/client/create-bid">
                <Building className="mr-2 h-5 w-5" />
                Post Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
              <Link href="/contractor/dashboard">
                <Hammer className="mr-2 h-5 w-5" />
                Find Projects
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 md:mt-20 relative">
          <Image
            src="https://placehold.co/1200x600.png?bgColor=e0e7ff&textColor=3730a3"
            alt="SwiftBid platform mockup showing a dashboard with house plans and bid information"
            width={1200}
            height={600}
            className="rounded-xl shadow-2xl object-cover mx-auto"
            data-ai-hint="dashboard house plans"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
