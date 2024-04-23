"use server";

export const translate = async (text: string, from: string, to: string) => {
  try {
    const res = await fetch("https://koze.vercel.app/api/translate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ text, from, to }),
    });

    if (!res.ok) throw new Error("Something went wrong");

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export async function getQuote() {
  const category = "happiness";

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/quotes?category=${category}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.NINJA_API_KEY!,
        },
      }
    );

    const result = await response.json();
    return result[0];
  } catch (error) {
    console.log(error);
  }
}


export async function getRandomFacts() {
  try {
    const response = await fetch(
      "https://uselessfacts.jsph.pl/random.json?language=en",
      {
        method: "GET",
        next: { revalidate: 3600 },
      }
    );
    const result = await response.json();
    return {
    text:  result.text ||
      result.text_short ||
      result.text_long ||
      result.text_long ||
      result.text,
    author: result.source || result.author
    }
  } catch (error) {
    
  }
};

export async function getDefinition(word: string) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    return result[0];
  } catch (error) {
    console.log(error);
  }
}