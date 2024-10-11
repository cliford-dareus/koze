import { FormDataType } from "@/app/(pages)/chat/[slug]/page";

export async function getData(formData: FormDataType) {
  try {
    const res = await fetch("https://koze.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
