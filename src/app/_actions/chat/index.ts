import { FormDataType } from "@/app/(pages)/chat/[slug]/page";

export async function getData(formData: FormDataType) {
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            console.error("Chat API error", res.status);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}
