import puppeteer, { Browser, Page } from "puppeteer";
import { sendJobsToQueue } from "../queue/producer.js";
import { Job } from "../types/job-type.js";

// Function to scrape jobs from Internshala
export const internshalaJobScraper = async (): Promise<void> => {
  // Base URL for Internshala jobs
  const BASE_URL = "https://internshala.com/jobs/web-development-jobs";

  // Launch a new browser and open a new page
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Open a new page
  const page: Page = await browser.newPage();

  // Go to the Internshala jobs page
  await page.goto(BASE_URL, {
    waitUntil: "domcontentloaded",
  });

  // Array to store all the jobs
  let allJobs: Job[] = [];

  // Function to auto scroll the page
  const autoScroll = async (): Promise<void> => {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          let scrollHeightBefore = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeightBefore) {
            clearInterval(timer);
            resolve();
          }
        }, 500);
      });
    });
  };

  // Function to extract the jobs from the page
  const extractJobs = async (): Promise<Job[]> => {
    return await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".individual_internship")
      ).map((jobElement) => ({
        title:
          jobElement.querySelector(".job-title-href")?.textContent?.trim() ||
          "",
        company:
          jobElement.querySelector(".company-name")?.textContent?.trim() || "",
        location:
          jobElement.querySelector(".locations span a")?.textContent?.trim() ||
          "",
        experience:
          jobElement
            .querySelector(".row-1-item:nth-child(2) span")
            ?.textContent?.trim() || "",
        salary:
          jobElement
            .querySelector(".ic-16-money + span")
            ?.textContent?.trim() || "",
        jobType:
          jobElement.querySelector(".status-li span")?.textContent?.trim() ||
          "",
        logo:
          jobElement
            .querySelector(".internship_logo img")
            ?.getAttribute("src") || "",
        jobLink:
          jobElement.querySelector(".job-title-href")?.getAttribute("href") ||
          "",
      })) as Job[];
    });
  };

  // Function to get the job details for a job
  const getJobDetails = async (jobUrl: string): Promise<Partial<Job>> => {
    const jobPage: Page = await browser.newPage();
    await jobPage.goto(`https://internshala.com${jobUrl}`, {
      waitUntil: "domcontentloaded",
    });

    const jobDetails: Partial<Job> = await jobPage.evaluate(() => {
      return {
        description:
          document.querySelector(".text-container")?.textContent?.trim() || "",
        skills: Array.from(
          document.querySelectorAll(".round_tabs_container .round_tabs")
        ).map((el) => el.textContent?.trim() || ""),
      };
    });

    await jobPage.close();
    return jobDetails;
  };

  // Get the total number of pages
  let totalPages: number = await page.evaluate(() => {
    return parseInt(
      document.querySelector("#total_pages")?.textContent?.trim() || "1",
      10
    );
  });

  console.log(`Total Pages: ${totalPages}`);

  // Loop through the pages and extract the jobs
  for (
    let currentPage = 1;
    currentPage <= Math.min(2, totalPages);
    currentPage++
  ) {
    await autoScroll();

    let jobsOnPage: Job[] = await extractJobs();

    // Get the job details for each job on the page and add it to the allJobs array
    for (let job of jobsOnPage) {
      if (job.jobLink) {
        console.log(`Fetching details for: ${job.title}`);
        let extraDetails = await getJobDetails(job.jobLink);
        job = { ...job, ...extraDetails };
      }
      allJobs.push(job);
    }

    console.log(
      `Scraped Page ${currentPage}/${totalPages}, Total Jobs: ${allJobs.length}`
    );

    let isLastPage: boolean = await page.evaluate(
      () => document.querySelector("#isLastPage")?.getAttribute("value") === "1"
    );
    if (isLastPage) break;

    let nextButton = await page.$("#next");
    if (nextButton) {
      await nextButton.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } else {
      break;
    }
  }

  console.log(`Total Jobs: ${allJobs.length}`);

  // Send the jobs to the RabbitMQ queue
  await sendJobsToQueue(allJobs);

  await browser.close();
};
