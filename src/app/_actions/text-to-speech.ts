"use server";

// const url =
//   "https://natural-text-to-speech-converter-at-lowest-price.p.rapidapi.com/";

// export default async function getTTs(lang: string, text: string) {
//   const data = new FormData();
//   data.append("msg", `${text}`);
//   data.append("lang", "Salli");
//   data.append("source", "ttsmp3");

//   const options = {
//     method: "POST",
//     headers: {
//       "x-rapidapi-key": "ed5a6ce265msh36358475eec709bp17f940jsn1ad14577646e",
//       "x-rapidapi-host":
//         "natural-text-to-speech-converter-at-lowest-price.p.rapidapi.com",
//     },
//     body: data,
//   };

//   try {
//     const response = await fetch(url, options);
//     const result = await response.text();
//     console.log("RESULT " + result);
    
//     // TEST RESPONSE
//     // return JSON.stringify({
//     //   URL: "https://ttsmp3.com/created_mp3/909780168b1b2ac44fda325a5b6b1540.mp3",
//          type: "natural"
//     // });
    
//     return result
//   } catch (error) {
//     console.error(error);
//   }
// }
 


const voicerssApiKey = process.env.VOICERS_API_KEY!;

const URL = "http://api.voicerss.org/";

const languages = {
  en: "en-us",
  fr: "fr-fr",
};

const voices = {
  en: "amy",
  fr: "iva",
};

export default async function getTTS(lang: string, text: string) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      src: `${text}`,
      //@ts-ignore
      hl: `${languages[lang]}`,
      //@ts-ignore
      v: `${voices[lang]}`,
      r: "0",
      c: "WAV",
      f: "8khz_8bit_mono",
      b64: "true",
      key: voicerssApiKey,
    }),
  };

  try {
    const response = await fetch(URL, options);
    const result = await response.text();
    return JSON.stringify({ URL: result, type: "voicers" });
  } catch (error) {
    console.error(error);
  }
}
