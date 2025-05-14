export interface HousePlanFile {
  id: string; // Added for easier management in lists
  name: string;
  type: string; // e.g., 'application/pdf', 'image/jpeg'
  size: number; // in bytes
  dataUri?: string; // for AI processing if needed on client, or for server action
  url?: string; // if stored in cloud
}

export interface ClarifyingQuestion {
  id: string;
  text: string;
  askedByRole: 'client' | 'contractor';
  askerName: string; // e.g. "Homeowner" or "Contractor John Doe"
  timestamp: string; // ISO string
  isResolved?: boolean;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  answeredByRole: 'client' | 'contractor';
  answererName: string;
  timestamp: string; // ISO string
}

export interface BidRequest {
  id: string;
  title: string;
  description: string;
  housePlans: HousePlanFile[];
  initialClarifyingQuestions: string; // Initial questions from client as a block of text
  status: 'open' | 'expired' | 'awarded' | 'cancelled';
  clientId: string; // User ID of the client
  clientName?: string; // Denormalized for display
  createdAt: string; // ISO string
  biddingEndDate: string; // ISO string
  bids?: Bid[];
  threadedQuestions?: ClarifyingQuestion[];
}

export interface Bid {
  id: string;
  bidRequestId: string;
  contractorId: string;
  contractorName: string; 
  amount: number;
  timelineEstimate: string; // e.g., "3-4 weeks", "2 months"
  notes?: string;
  attachments?: HousePlanFile[];
  submittedAt: string; // ISO string
  status: 'submitted' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
}

export interface ContractorTag {
  tagName: string;
  score: number;
}

export interface SuggestedContractor {
  contractorId: string;
  name?: string; 
  tags: ContractorTag[];
  overallScore: number;
  specialties?: string[]; // e.g. ["Kitchen Remodeling", "New Construction"]
  location?: string; // e.g. "San Francisco, CA"
  profileImageUrl?: string;
  briefDescription?: string; // A short description or summary from AI
}

export type UserRole = 'client' | 'contractor' | 'guest';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  companyName?: string; // For contractors
  preferredCategories?: string[]; // For contractors
  avatarUrl?: string;
}

// For Contractor Dashboard, mock data for active bid requests
export interface ActiveBidRequestSummary {
  id: string;
  title: string;
  clientName: string; // Name of the homeowner/client
  postedDate: string; // ISO string
  biddingEndDate: string; // ISO string
  status: 'open' | 'expiring_soon' | 'new'; // More specific status for dashboard
  planOverview?: string; // e.g., "3 bed, 2 bath, 1500 sqft"
  location?: string; // e.g. "Springfield, IL"
  category?: 'Residential' | 'Commercial' | 'Renovation' | 'New Build'; // Added for filtering
}

// For Notification system
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'bid';
  timestamp: string; // ISO string
  isRead: boolean;
  link?: string; // Optional link to relevant page
}
