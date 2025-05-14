// src/components/contractor/BidRequestCard.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ActiveBidRequestSummary } from '@/lib/types';
import { CalendarDays, User, MapPin, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNowStrict, differenceInDays, parseISO } from 'date-fns';

interface BidRequestCardProps {
  request: ActiveBidRequestSummary;
  viewMode?: 'grid' | 'list';
}

export function BidRequestCard({ request, viewMode = 'grid' }: BidRequestCardProps) {
  const biddingEndDate = parseISO(request.biddingEndDate);
  const daysLeft = differenceInDays(biddingEndDate, new Date());
  
  let statusBadgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let statusIcon = <Clock className="mr-1.5 h-3.5 w-3.5" />;
  let statusText = `${daysLeft} days left`;

  if (daysLeft < 0) {
    statusBadgeVariant = "destructive";
    statusIcon = <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />;
    statusText = "Expired";
  } else if (request.status === 'expiring_soon' || (daysLeft >= 0 && daysLeft <= 2)) {
    statusBadgeVariant = "destructive";
    statusIcon = <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />;
    statusText = `Ends in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`;
  } else if (request.status === 'new') {
    statusBadgeVariant = "default"; // Primary color for new
    statusIcon = <CheckCircle className="mr-1.5 h-3.5 w-3.5" />;
    statusText = "New";
  } else { // Open
     statusBadgeVariant = "secondary";
  }
  
  const postedDateFormatted = formatDistanceToNowStrict(parseISO(request.postedDate), { addSuffix: true });

  if (viewMode === 'list') {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
          <div className="flex-grow">
            <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
              <Link href={`/contractor/bid-requests/${request.id}`}>{request.title}</Link>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {request.planOverview || "No overview available."}
            </CardDescription>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center"><User className="mr-1 h-3.5 w-3.5" /> {request.clientName}</span>
              {request.location && <span className="flex items-center"><MapPin className="mr-1 h-3.5 w-3.5" /> {request.location}</span>}
              <span className="flex items-center"><CalendarDays className="mr-1 h-3.5 w-3.5" /> Posted {postedDateFormatted}</span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
             <Badge variant={statusBadgeVariant} className="text-xs px-2.5 py-1">
                {statusIcon}
                {statusText}
             </Badge>
            <Button asChild size="sm" variant="outline">
              <Link href={`/contractor/bid-requests/${request.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-semibold leading-tight hover:text-primary transition-colors">
            <Link href={`/contractor/bid-requests/${request.id}`}>{request.title}</Link>
          </CardTitle>
           <Badge variant={statusBadgeVariant} className="text-xs px-2 py-0.5 shrink-0">
            {statusIcon}
            {statusText}
           </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {request.planOverview || "Detailed plan information available upon viewing."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-center text-muted-foreground">
          <User className="mr-2 h-4 w-4 text-primary/80" />
          <span>Client: {request.clientName}</span>
        </div>
        {request.location && (
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-primary/80" />
            <span>Location: {request.location}</span>
          </div>
        )}
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4 text-primary/80" />
          <span>Posted: {postedDateFormatted}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full" variant="default">
          <Link href={`/contractor/bid-requests/${request.id}`}>
             <Eye className="mr-2 h-4 w-4" /> View Details & Bid
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
