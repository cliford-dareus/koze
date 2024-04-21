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
    return result;
  } catch (error) {
    console.error(error);
  }
}
