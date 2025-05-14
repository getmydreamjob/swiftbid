// src/components/client/CreateBidRequestPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Corrected import
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/shared/FileUpload';
import { findMatchingContractorsAction, createBidRequestAction } from '@/lib/actions/bidRequests';
import type { SuggestedContractor, HousePlanFile as AppHousePlanFile } from '@/lib/types';
import { SuggestedContractorCard } from '@/components/client/SuggestedContractorCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Search, Users, Send, InfoIcon } from 'lucide-react'; // Added InfoIcon
import { useToast } from "@/hooks/use-toast";
import { Separator } from '../ui/separator';

const bidRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(100),
  description: z.string().min(20, "Description must be at least 20 characters long.").max(2000),
  initialClarifyingQuestions: z.string().optional(),
  // planFiles are handled separately
});

type BidRequestFormValues = z.infer<typeof bidRequestSchema>;

export function CreateBidRequestPageClient() {
  const [planFiles, setPlanFiles] = useState<File[]>([]);
  const [appPlanFiles, setAppPlanFiles] = useState<AppHousePlanFile[]>([]);
  const [suggestedContractors, setSuggestedContractors] = useState<SuggestedContractor[]>([]);
  const [isMatchingContractors, setIsMatchingContractors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm<BidRequestFormValues>({
    resolver: zodResolver(bidRequestSchema),
    mode: 'onChange', // Validate on change for better UX
    defaultValues: {
      title: '',
      description: '',
      initialClarifyingQuestions: '',
    },
  });

  const projectDescription = watch('description'); // Watch description for AI matching

  useEffect(() => {
    // Convert File[] to AppHousePlanFile[] when planFiles change
    const newAppPlanFiles = planFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    setAppPlanFiles(newAppPlanFiles);
  }, [planFiles]);


  const handleFilesUpdated = (files: File[]) => {
    setPlanFiles(files);
    // If files are updated, clear previous AI suggestions and errors
    setSuggestedContractors([]);
    setAiError(null);
    setAiMessage(null);
  };

  const handleFindContractors = async () => {
    if (planFiles.length === 0 || !projectDescription) {
      toast({
        title: "Missing Information",
        description: "Please upload at least one plan file and provide a project description before matching contractors.",
        variant: "destructive",
      });
      return;
    }
    setAiError(null);
    setAiMessage(null);
    setIsMatchingContractors(true);
    setSuggestedContractors([]);

    try {
      // Use the first plan file for AI matching for simplicity
      const result = await findMatchingContractorsAction(projectDescription, planFiles[0]);
      if (result.error) {
        setAiError(result.error);
        toast({ title: "AI Matching Error", description: result.error, variant: "destructive" });
      } else if (result.message) {
        setAiMessage(result.message);
        setSuggestedContractors(result.contractors || []);
         toast({ title: "AI Matching Info", description: result.message, variant: "default" });
      } else {
        setSuggestedContractors(result.contractors || []);
        if (result.contractors && result.contractors.length > 0) {
            toast({ title: "AI Matching Successful", description: `${result.contractors.length} contractors suggested.`, variant: "default" });
        } else {
             toast({ title: "AI Matching Complete", description: "No specific contractors found by AI.", variant: "default" });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI matching.";
      setAiError(errorMessage);
      toast({ title: "AI Matching Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsMatchingContractors(false);
    }
  };

  const onSubmit: SubmitHandler<BidRequestFormValues> = async (data) => {
    if (planFiles.length === 0) {
      toast({
        title: "Missing Plan Files",
        description: "Please upload at least one house plan file.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.initialClarifyingQuestions) {
      formData.append('initialClarifyingQuestions', data.initialClarifyingQuestions);
    }
    planFiles.forEach(file => {
      formData.append('planFiles', file); // 'planFiles' must match server action
    });
    
    // Append suggested contractor IDs if any - example
    // suggestedContractors.forEach(c => formData.append('suggestedContractorIds[]', c.contractorId));

    try {
      const result = await createBidRequestAction(formData);
      if (result.success) {
        toast({
          title: "Bid Request Submitted!",
          description: result.message,
          variant: "default",
          className: "bg-accent text-accent-foreground",
        });
        // Reset form or redirect user
        // e.g., router.push(`/client/bid-requests/${result.bidRequestId}`);
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Could not submit bid request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Project Details</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input id="title" placeholder="e.g., New Kitchen Remodel, Two-Story House Construction" {...field} />}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea id="description" placeholder="Describe your project in detail. Include scope, desired materials, specific requirements, etc." rows={6} {...field} />}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="initialClarifyingQuestions">Optional Clarifying Questions for Contractors</Label>
            <Controller
              name="initialClarifyingQuestions"
              control={control}
              render={({ field }) => <Textarea id="initialClarifyingQuestions" placeholder="e.g., What is your typical timeline for a project of this size? Are you licensed and insured for this type of work?" rows={3} {...field} />}
            />
             <p className="text-xs text-muted-foreground mt-1">Help contractors understand your needs better by asking upfront questions.</p>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Upload House Plans</h2>
        <FileUpload 
          onFilesUpdated={handleFilesUpdated} 
          acceptedFileTypes=".pdf,.docx,.jpeg,.jpg,.png"
          multiple 
          maxFiles={5}
        />
        {planFiles.length === 0 && <p className="text-sm text-muted-foreground mt-2">Supported formats: PDF, DOCX, JPG, PNG. Max 5 files.</p>}
      </section>
      
      <Separator />

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Find Contractors (Optional)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use our AI tool to find contractors best suited for your project based on the uploaded plans and description.
        </p>
        <Button type="button" onClick={handleFindContractors} disabled={isMatchingContractors || planFiles.length === 0 || !projectDescription}>
          {isMatchingContractors ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {isMatchingContractors ? 'Matching...' : 'Find Matching Contractors'}
        </Button>

        {aiError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI Matching Error</AlertTitle>
            <AlertDescription>{aiError}</AlertDescription>
          </Alert>
        )}
        {aiMessage && !aiError && (
          <Alert variant="default" className="mt-4 border-primary/50 text-primary [&>svg]:text-primary">
             <InfoIcon className="h-4 w-4" />
            <AlertTitle>AI Matching Result</AlertTitle>
            <AlertDescription>{aiMessage}</AlertDescription>
          </Alert>
        )}

        {suggestedContractors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-foreground mb-3 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              AI Suggested Contractors ({suggestedContractors.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedContractors.map(contractor => (
                <SuggestedContractorCard key={contractor.contractorId} contractor={contractor} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Separator />
      
      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting || !isValid || planFiles.length === 0}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <Send className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Bid Request'}
        </Button>
      </div>
    </form>
  );
}
