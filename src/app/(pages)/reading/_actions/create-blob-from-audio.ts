"use server";

export default async function createBlobFromAudioURL(audioURL: string) {
  try {
    const response = await fetch(audioURL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Get the audio data as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  } catch (error) {
    console.error("Error creating blob from audio URL:", error);
    throw error;
  }
}