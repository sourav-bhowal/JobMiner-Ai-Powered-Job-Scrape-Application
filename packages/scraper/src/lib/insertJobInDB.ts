import prisma from "@repo/database/prisma";
import { Job } from "../types/job-type.js";
import { createJobEmbedding } from "../lib/jobEmbedding.js";

// Process Jobs from RabbitMQ and save them to the database
export async function insertJobInDB(jobBatch: Job[]) {
  try {
    // If the jobBatch is empty, return
    if (jobBatch.length === 0 || !jobBatch) {
      console.log("No job to insert in DB");
      return;
    }

    // Get the vector embeddings for the job
    const jobEmbeddings = await createJobEmbedding(jobBatch);

    // Prepare data for createMany
    const jobsToInsert = jobBatch.map((job, index) => ({
      title: job.title || "",
      companyName: job.companyName,
      companyLink: job.companyLink,
      jobType: job.jobType,
      responsibilities: job.responsibilities,
      skills: job.skills,
      tags: job.tags,
      benefits: job.benefits,
      currency: job.currency,
      salaryFrequency: job.salaryFrequency,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      remote: job.remote,
      location: job.location,
      description: job.description,
      insights: job.insights,
      link: job.link,
      applyLink: job.applyLink,
      applyBy: job.applyBy,
      postedAt: job.postedAt,
      vector: jobEmbeddings[index], // Store the corresponding vector embedding
    }));

    // Insert all jobs into the database
    await prisma.job.createMany({
      data: jobsToInsert,
      skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
    });
    console.log("Job inserted in DB");
  } catch (error) {
    console.error("Error inserting job in DB", error);
  }
}
