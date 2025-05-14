// src/lib/actions/bidRequests.ts
'use server';

import { suggestSuitableContractors, type SuggestSuitableContractorsInput } from '@/ai/flows/match-contractors';
import type { SuggestedContractor, HousePlanFile as AppHousePlanFile } from '@/lib/types';

// Helper to convert File to Data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function findMatchingContractorsAction(
  projectDescription: string,
  planFile: File | null
): Promise<{ contractors?: SuggestedContractor[]; error?: string; message?: string }> {
  if (!planFile) {
    return { error: "Please upload at least one plan file." };
  }
  if (!projectDescription.trim()) {
    return { error: "Please provide a project description." };
  }

  try {
    const planDataUri = await fileToDataUri(planFile);

    const input: SuggestSuitableContractorsInput = {
      planDataUri,
      projectDescription,
      // clarifyingQuestions: can be added if client provides them before matching
    };

    // Add a slight delay to simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await suggestSuitableContractors(input);
    
    const contractorsWithMockDetails = result.suggestedContractors.map((c, i) => ({
      ...c,
      name: `Contractor ${String.fromCharCode(65 + i)} (AI Matched)`,
      specialties: c.tags.slice(0, 2).map(t => t.tagName), // Mock specialties from tags
      location: "Local Area (Mock)",
      profileImageUrl: `https://placehold.co/100x100.png?text=${String.fromCharCode(65 + i)}`,
    }));
    
    if (contractorsWithMockDetails.length === 0) {
      return { message: "No specific contractors matched by AI. Consider broadening your project scope or try again.", contractors: [] };
    }

    return { contractors: contractorsWithMockDetails };
  } catch (error) {
    console.error("Error matching contractors:", error);
    // Check if the error is from Genkit or a general error
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to match contractors: ${errorMessage}. Please try again.` };
  }
}

export async function createBidRequestAction(formData: FormData): Promise<{ success: boolean; message: string; bidRequestId?: string, error?: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  // Files would be handled differently, e.g., uploaded to cloud storage,
  // and their URLs/references stored.
  // For now, just log names if they exist.
  const planFiles = formData.getAll('planFiles'); // Assuming 'planFiles' is the name attribute for file inputs

  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }

  // Mocking successful creation
  const mockBidRequestId = `br_${Date.now()}`;
  console.log("Bid Request Submitted (Mock):");
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Initial Clarifying Questions:", formData.get('initialClarifyingQuestions'));
  
  planFiles.forEach(file => {
    if (file instanceof File) {
      console.log(`Uploaded Plan: ${file.name} (Type: ${file.type}, Size: ${file.size} bytes)`);
    }
  });
  
  // Here you would typically:
  // 1. Validate data
  // 2. Upload files to cloud storage (S3, GCS)
  // 3. Save bid request details to database (PostgreSQL)
  // 4. Set bidding window (7 days)
  // 5. Trigger notifications to relevant contractors

  return { success: true, message: "Bid request submitted successfully! Contractors will be notified.", bidRequestId: mockBidRequestId };
}
