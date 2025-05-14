// src/components/client/SuggestedContractorCard.tsx
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SuggestedContractor } from '@/lib/types';
import { Star, Users, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface SuggestedContractorCardProps {
  contractor: SuggestedContractor;
}

export function SuggestedContractorCard({ contractor }: SuggestedContractorCardProps) {
  const scoreColor = contractor.overallScore >= 80 
    ? 'text-accent' 
    : contractor.overallScore >= 60 
    ? 'text-yellow-500' // Keep yellow for mid-tier as no direct theme equivalent, or use muted-foreground
    : 'text-destructive';
  
  const scoreFillColor = contractor.overallScore >= 80
    ? 'fill-accent'
    : contractor.overallScore >= 60
    ? 'fill-yellow-500' // Corresponding fill
    : 'fill-destructive';


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-4 bg-muted/30">
        <div className="flex items-start space-x-3">
          <Image
            src={contractor.profileImageUrl || `https://placehold.co/80x80.png?text=${contractor.name ? contractor.name.charAt(0) : 'C'}`}
            alt={contractor.name || 'Contractor'}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary/50 object-cover"
            data-ai-hint="person portrait"
          />
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground leading-tight">{contractor.name || 'Unnamed Contractor'}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{contractor.location || 'Location not specified'}</CardDescription>
             <div className="flex items-center mt-1">
              <Star className={cn("h-5 w-5 mr-1", scoreColor, scoreFillColor)} />
              <span className={cn("text-md font-bold", scoreColor)}>
                {contractor.overallScore.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">/ 100 Match Score</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        {contractor.briefDescription && (
           <p className="text-sm text-muted-foreground italic line-clamp-2">{contractor.briefDescription}</p>
        )}
        {contractor.specialties && contractor.specialties.length > 0 && (
            <div className="mb-3">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Specialties</h4>
                <div className="flex flex-wrap gap-1.5">
                {contractor.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
                ))}
                </div>
            </div>
        )}
        
        {contractor.tags && contractor.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Relevant Skills (AI Tags)</h4>
            <ul className="space-y-1 text-xs">
              {contractor.tags.slice(0, 3).map(tag => (
                <li key={tag.tagName} className="flex items-center justify-between text-muted-foreground">
                  <span>{tag.tagName}</span>
                  <span className="font-medium text-foreground/80">{tag.score.toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t">
        <Button variant="outline" size="sm" className="w-full">
          View Profile & Invite
        </Button>
      </CardFooter>
    </Card>
  );
}
