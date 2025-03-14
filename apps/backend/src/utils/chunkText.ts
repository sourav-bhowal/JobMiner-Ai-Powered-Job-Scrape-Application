// Function: chunkText to split a string into chunks of a maximum size in bytes
export function chunkText(text: string, maxBytes = 9000) {
  // Validate the input
  if (!text || typeof text !== "string") {
    throw new Error("Input must be a non-empty string");
  }

  const chunks = []; // Initialize the chunks array
  let currentChunk = ""; // Initialize the current chunk
  let currentSize = 0; // Initialize the current size

  // Split the text into words and filter out empty strings
  const words = text.split(" ").filter(Boolean);

  // Iterate over the words
  for (const word of words) {
    const wordSize = Buffer.byteLength(word, "utf8"); // Get the size of the word in bytes
    const spaceSize = currentChunk ? 1 : 0; // Get the size of the space in bytes

    // Check if the current chunk exceeds the max bytes
    if (currentSize + wordSize + spaceSize > maxBytes) {
      chunks.push(currentChunk.trim()); // Push the current chunk to the chunks array
      currentChunk = word; // Set the current chunk to the word
      currentSize = wordSize; // Set the current size to the word size
    } else {
      currentChunk += (currentChunk ? " " : "") + word; // Append the word to the current chunk
      currentSize += wordSize + spaceSize; // Update the current size
    }
  }

  // Push the last chunk to the chunks array
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  // Check if no chunks were generated
  if (chunks.length === 0) {
    throw new Error("No chunks were generated");
  }

  // Return the chunks array
  return chunks;
}
