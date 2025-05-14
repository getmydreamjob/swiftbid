// src/app/client/create-bid/page.tsx
import { CreateBidRequestPageClient } from '@/components/client/CreateBidRequestPageClient';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Create New Bid Request | SwiftBid',
  description: 'Submit your house plans and project details to receive bids from qualified contractors.',
};

export default function CreateBidRequestPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Create New Bid Request</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                Fill in the details below to get started.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="p-6 md:p-8">
          <CreateBidRequestPageClient />
        </div>
      </Card>
    </div>
  );
}
