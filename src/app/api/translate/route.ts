import { NextRequest, NextResponse } from "next/server";

const URL = "https://deep-translate1.p.rapidapi.com/language/translate/v2";

export async function POST(req: NextRequest) {
  const { from, to, text } = await req.json();
  const apiKey = process.env.API_KEY!;

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("X-RapidAPI-Key", apiKey);
  headers.set("X-RapidAPI-Host", "deep-translate1.p.rapidapi.com");

  const body = JSON.stringify({ q: text, source: from, target: to });

  try {
    const res = await fetch(URL, { method: "POST", headers, body });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return NextResponse.json({ response: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ response: "something went wrong" });
  }
}
