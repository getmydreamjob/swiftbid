// src/app/contractor/dashboard/page.tsx
import { ContractorDashboardClient } from '@/components/contractor/ContractorDashboardClient';
import { Briefcase, ListChecks } from 'lucide-react';
import type { ActiveBidRequestSummary } from '@/lib/types';
// Removed unused Button: import { Button } from '@/components/ui/button'; 

export const metadata = {
  title: 'Contractor Dashboard | SwiftBid',
  description: 'View and manage active bid requests matching your profile.',
};

// Mock data for active bid requests
const mockActiveBidRequests: ActiveBidRequestSummary[] = [
  { id: 'br_001', title: 'Luxury Kitchen Renovation', clientName: 'Alice Wonderland', postedDate: new Date(Date.now() - 86400000 * 2).toISOString(), biddingEndDate: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'new' as const, planOverview: 'High-end finishes, custom cabinetry', location: 'Beverly Hills, CA', category: 'Renovation' },
  { id: 'br_002', title: 'Two-Story Home Addition', clientName: 'Bob The Builder', postedDate: new Date(Date.now() - 86400000 * 1).toISOString(), biddingEndDate: new Date(Date.now() + 86400000 * 6).toISOString(), status: 'open' as const, planOverview: 'Approx. 800 sqft addition, 2 beds, 1 bath', location: 'Austin, TX', category: 'Residential' },
  { id: 'br_003', title: 'Eco-Friendly Cabin Build', clientName: 'Carol Danvers', postedDate: new Date(Date.now() - 86400000 * 5).toISOString(), biddingEndDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'expiring_soon' as const, planOverview: 'Sustainable materials, off-grid setup', location: 'Asheville, NC', category: 'New Build' },
  { id: 'br_004', title: 'Downtown Office Fit-out', clientName: 'David Copperfield', postedDate: new Date(Date.now() - 86400000 * 3).toISOString(), biddingEndDate: new Date(Date.now() + 86400000 * 4).toISOString(), status: 'open' as const, planOverview: 'Modern office space, open concept', location: 'New York, NY', category: 'Commercial' },
  { id: 'br_005', title: 'Residential Complex Landscaping', clientName: 'Eva Green', postedDate: new Date(Date.now() - 86400000 * 7).toISOString(), biddingEndDate: new Date(Date.now() + 86400000 * 10).toISOString(), status: 'open' as const, planOverview: 'Large scale landscaping for new housing development', location: 'Miami, FL', category: 'Residential' },
];


export default function ContractorDashboardPage() {
  // In a real app, this data would be fetched server-side or client-side based on the authenticated contractor.
  const bidRequests = mockActiveBidRequests;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            Contractor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse active bid requests and submit your proposals.
          </p>
        </div>
        {/* Filter button removed as tabs are used for filtering categories */}
      </div>
      
      <ContractorDashboardClient initialBidRequests={bidRequests} />
    </div>
  );
}
