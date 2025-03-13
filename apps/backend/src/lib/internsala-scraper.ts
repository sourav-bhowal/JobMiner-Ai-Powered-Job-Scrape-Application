import puppeteer from "puppeteer";
import { openai } from "@repo/openai";

// Function to chunk text before sending to OpenAI
export function chunkText(text: string, maxBytes = 9000) {
  if (!text || typeof text !== "string") {
    throw new Error("Input must be a non-empty string");
  }

  const chunks = [];
  let currentChunk = "";
  let currentSize = 0;

  const words = text.split(" ").filter(Boolean);

  for (const word of words) {
    const wordSize = Buffer.byteLength(word, "utf8");
    const spaceSize = currentChunk ? 1 : 0;

    if (currentSize + wordSize + spaceSize > maxBytes) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
      currentSize = wordSize;
    } else {
      currentChunk += (currentChunk ? " " : "") + word;
      currentSize += wordSize + spaceSize;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  if (chunks.length === 0) {
    throw new Error("No chunks were generated");
  }

  return chunks;
}

export const jobScraper = async () => {
  const JOB_SEARCH_URL = "https://internshala.com/jobs/web-development-jobs/";

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto(JOB_SEARCH_URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Advanced scrolling system
    let lastHeight = 0;
    let sameHeightCount = 0;
    let scrollAttempt = 0;
    const MAX_SCROLL_ATTEMPTS = 50;

    while (scrollAttempt < MAX_SCROLL_ATTEMPTS) {
      // Random scroll distance and delay
      const scrollBy = Math.floor(Math.random() * 400) + 300; // 300-700px
      await page.evaluate((scrollBy) => {
        window.scrollBy({ top: scrollBy, behavior: "smooth" });
      }, scrollBy);

      // Random wait with network idle check
      await Promise.race([
        page.waitForNetworkIdle({ idleTime: 1000 }),
        new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 3000 + 2000)
        ),
      ]);

      // Height check logic
      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      if (newHeight === lastHeight) {
        sameHeightCount++;
        if (sameHeightCount > 3) break;
      } else {
        sameHeightCount = 0;
        lastHeight = newHeight;
      }

      // Bottom detection with 100px threshold
      const atBottom = await page.evaluate(
        () =>
          window.scrollY + window.innerHeight >=
          document.body.scrollHeight - 100
      );
      if (atBottom) break;

      scrollAttempt++;

      const body = await page.evaluate(() => document.body.innerHTML);

      // Chunk the scraped job listings before sending to OpenAI
      const chunks = chunkText(body, 9000);

      for (const [index, chunk] of chunks.entries()) {
        console.log(`Sending chunk ${index + 1} of ${chunks.length}`);

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
    console.error("Scraping error:", error);
    return [];
  } finally {
    await browser.close();
  }
};

jobScraper();
