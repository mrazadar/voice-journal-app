import { Readable } from "stream";

/**
 * This is a mock transcription service. In a real application,
 * you would integrate with a third-party API like Google Cloud Speech-to-Text,
 * AWS Transcribe, or a local speech-to-text library.
 *
 * For this project, it will simply return a predefined string or
 * simulate processing time.
 *
 * @param audioStream The audio data stream.
 * @returns A promise that resolves with the transcribed text.
 */
export async function transcribeAudio(audioStream: Readable): Promise<string> {
  console.log("Simulating audio transcription...");
  // Simulate reading the stream (optional, for demonstration)
  for await (const chunk of audioStream) {
    // Do nothing with the chunk, just consume it
  }

  // Simulate a delay for processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const mockTranscriptions = [
    "This is a mock transcription of your voice journal entry.",
    "The quick brown fox jumps over the lazy dog.",
    "Voice journaling is a great way to express yourself and keep track of your thoughts.",
    "Today was a productive day, and I learned a lot about Node.js and PostgreSQL.",
    "Remember to stay hydrated and take breaks while coding!",
  ];

  return mockTranscriptions[
    Math.floor(Math.random() * mockTranscriptions.length)
  ];
}
