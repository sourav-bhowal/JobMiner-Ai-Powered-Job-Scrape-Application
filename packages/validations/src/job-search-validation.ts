import { z } from "zod";

// Job search validation schema
export const jobSearchSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  jobType: z.enum(["All Types", "Full-Time", "Part-Time", "Contract"]),
  skills: z.array(z.string()).optional(),
  showAiMatches: z.boolean(),
});

// Type definition for job search form values
export type JobSearchFormValues = z.infer<typeof jobSearchSchema>;
