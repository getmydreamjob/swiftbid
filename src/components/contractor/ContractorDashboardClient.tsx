// src/components/contractor/ContractorDashboardClient.tsx
'use client';

import { useState, useEffect } from 'react';
import type { ActiveBidRequestSummary } from '@/lib/types';
import { BidRequestCard } from './BidRequestCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, LayoutGrid, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

interface ContractorDashboardClientProps {
  initialBidRequests: ActiveBidRequestSummary[];
}

const tabsCategories = ["All Projects", "New", "Expiring Soon", "Residential", "Commercial", "Renovation", "New Build"] as const;
type TabCategory = typeof tabsCategories[number];


export function ContractorDashboardClient({ initialBidRequests }: ContractorDashboardClientProps) {
  const [bidRequests, setBidRequests] = useState<ActiveBidRequestSummary[]>(initialBidRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('endDate'); // e.g., 'endDate', 'postedDate', 'title'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'
  const [activeTab, setActiveTab] = useState<TabCategory>(tabsCategories[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAndSortedRequests = bidRequests
    .filter(req => req.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(req => {
      if (activeTab === "All Projects") return true;
      if (activeTab === "New") return req.status === 'new';
      if (activeTab === "Expiring Soon") return req.status === 'expiring_soon';
      if (activeTab === "Residential") return req.category === 'Residential';
      if (activeTab === "Commercial") return req.category === 'Commercial';
      if (activeTab === "Renovation") return req.category === 'Renovation';
      if (activeTab === "New Build") return req.category === 'New Build';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'endDate') {
        return new Date(a.biddingEndDate).getTime() - new Date(b.biddingEndDate).getTime();
      }
      if (sortBy === 'postedDate') {
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card p-4 rounded-lg shadow-md space-y-3 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-10 bg-primary/20 rounded w-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6 shadow-md bg-card">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects by title..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endDate">Bidding End Date</SelectItem>
                <SelectItem value="postedDate">Posted Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
                <span className="sr-only">Toggle View Mode</span>
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as TabCategory)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-6">
          {tabsCategories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
        </TabsList>
        
        {/* Render content based on the active tab and filtered/sorted requests */}
        {/* We can have one TabsContent and dynamically render inside, or map through categories if structure differs significantly */}
        {tabsCategories.map(cat => (
          <TabsContent key={cat} value={cat}> 
            {activeTab === cat && ( // Only render content for the active tab
              filteredAndSortedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-xl font-semibold text-foreground">No Projects Found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    There are currently no projects matching your criteria for &quot;{activeTab}&quot;. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredAndSortedRequests.map(request => (
                    <BidRequestCard key={request.id} request={request} viewMode={viewMode} />
                  ))}
                </div>
              )
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
