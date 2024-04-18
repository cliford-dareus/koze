"use server";

export const translate = async (text: string, from: string, to: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/translate", {
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
