// INTERNSALA SCRAPER
import puppeteer from "puppeteer";
import { openai } from "@repo/openai";
import { chunkText } from "../lib/chunkText.js";

// Main job scraping function
export const internshalaJobScraper = async () => {
  // Internshala job search URL
  const JOB_SEARCH_URL = "https://internshala.com/jobs/web-development-jobs/";

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: false, // set to true for production
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // args required for running Puppeteer in a Docker container
  });

  // Create a new page
  const page = await browser.newPage();

  try {
    // Go to the job search URL
    await page.goto(JOB_SEARCH_URL, {
      waitUntil: "networkidle2", // wait until there are no more than 2 network connections for at least 500ms
      timeout: 60000, // 60s timeout
    });

    // Advanced scrolling system
    let lastHeight = 0; // Initial height
    let sameHeightCount = 0; // Counter for the number of times the height remains the same
    let scrollAttempt = 0; // Counter for the number of scroll attempts
    const MAX_SCROLL_ATTEMPTS = 50; // Maximum number of scroll attempts

    // Scroll until the bottom of the page or maximum scroll attempts
    while (scrollAttempt < MAX_SCROLL_ATTEMPTS) {
      // Random scroll distance and delay
      const scrollBy = Math.floor(Math.random() * 400) + 300; // 300-700px
      // Page evaluation to scroll smoothly
      await page.evaluate((scrollBy) => {
        window.scrollBy({ top: scrollBy, behavior: "smooth" }); // scroll smoothly by scrollBy pixels
      }, scrollBy);

      // Random wait with network idle check
      await Promise.race([
        // race between the two promises
        page.waitForNetworkIdle({ idleTime: 1000 }), // wait for 1s of network inactivity
        new Promise(
          (resolve) => setTimeout(resolve, Math.random() * 3000 + 2000) // resolve after 2-5s
        ),
      ]);

      // Height check logic
      const newHeight = await page.evaluate(() => document.body.scrollHeight); // get the new height
      // If the height remains the same for more than 3 times, break the loop
      if (newHeight === lastHeight) {
        sameHeightCount++; // increment the counter
        if (sameHeightCount > 3) break; // break if the counter exceeds 3
      } else {
        // reset the counter if the height changes
        sameHeightCount = 0;
        lastHeight = newHeight; // update the last height
      }

      // Bottom detection with 100px threshold
      const atBottom = await page.evaluate(
        () =>
          window.scrollY + window.innerHeight >=
          document.body.scrollHeight - 100
      );
      if (atBottom) break;

      // Increment the scroll attempt
      scrollAttempt++;

      // Evaluate the body content
      const body = await page.evaluate(() => document.body.innerHTML);

      // Chunk the scraped job listings before sending to OpenAI
      const chunks = chunkText(body, 9000);

      // Send each chunk to OpenAI for completion
      for (const [index, chunk] of chunks.entries()) {
        console.log(`Sending chunk ${index + 1} of ${chunks.length}`);

        // Get the response from OpenAI API
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `
                      I am looking for a web development internship. Here are some job listings:
                      ${chunk} 
                      Scrape these job listings and provide a JSON summary with the following format:
                      {
                        job_id: [job_id],
                        title: [job_title],
                        company: { name: [company_name], url: [company_url] },
                        location: { city: [city], state: [state], country: [country], remote: [true/false] },
                        job_type: [job_type],
                        salary: { min: [min_salary], max: [max_salary], currency: [currency], frequency: [salary_frequency] },
                        posted_date: [posted_date],
                        deadline_date: [deadline_date],
                        description: [job_description],
                        responsibilities: [ [responsibility_1], [responsibility_2], ... ],
                        requirements: [ [requirement_1], [requirement_2], ... ],
                        benefits: [ [benefit_1], [benefit_2], ... ],
                        application: { url: [application_url] },
                        source: { website: [website_name], scraped_url: [scraped_url], scraped_date: [scraped_date] }
                      }
                    `,
            },
          ],
        });

        console.log(response?.choices[0]?.message.content);
      }
    }
  } catch (error) {
    // Log and return empty array in case of error
    console.error("Scraping error:", error);
    return [];
  } finally {
    // Close the browser
    await browser.close();
  }
};