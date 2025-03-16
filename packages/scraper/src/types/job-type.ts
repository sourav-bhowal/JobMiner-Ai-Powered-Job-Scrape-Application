// Prisma Job Type
export interface Job {
  title?: string;
  companyName?: string;
  companyLink?: string;
  jobType?: string;
  responsibilities?: string[];
  skills?: string[];
  tags?: string[];
  benefits?: string[];
  currency?: string;
  salaryFrequency?: string;
  minSalary?: number;
  maxSalary?: number;
  remote?: boolean;
  location?: string;
  description?: string;
  insights?: string;
  link?: string;
  applyLink?: string;
  applyBy?: Date;
  postedAt?: Date;
}
