import { FormDataType } from "@/app/chat/[slug]/page";

export async function getData(formData: FormDataType) {
  try {
    const res = await fetch("http://localhost:3000/api/chat", {
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
