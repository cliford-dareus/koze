"use client";

import { FormEvent, useState } from "react";
import ResultComponent from "./result-component";
import TranslationForm from "./translation-form";
import { translate } from "@/app/_actions/translate";

export const supportedLanguages = [
  { id: 1, name: "English", value: "en" },
  { id: 2, name: "French", value: "fr" },
  { id: 3, name: "Spanish", value: "es" },
];

const TranslationManager = () => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [selectedLang, setSelectedLang] = useState({
    from: "en",
    to: "fr",
  });

  const handleLangChange = (type: "from" | "to", value: string) => {
    setSelectedLang((prevState) => ({
      ...prevState,
      [type]: value,
    }));
  };

  const handleTranslation = async (e: FormEvent) => {
    e.preventDefault();
    if (!textToTranslate.trim()) return;

    setIsLoading(true);
    setResult("");
    setError("");

    try {
      const data = await translate(
        textToTranslate,
        selectedLang.from,
        selectedLang.to,
      );

      const translated =
        data?.response?.data?.translations?.translatedText ?? null;

      if (translated) {
        setResult(
          Array.isArray(translated) ? translated[0] : String(translated),
        );
      } else {
        setError("Translation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <ResultComponent
        handleLangChange={handleLangChange}
        selectedLang={selectedLang}
        output={result}
      />

      {error && (
        <p className="text-red-400 text-sm text-center mt-2 px-4">{error}</p>
      )}
      {isLoading && (
        <p className="text-slate-300 text-sm text-center mt-2 px-4">
          Translating…
        </p>
      )}

      <TranslationForm
        handleLangChange={handleLangChange}
        selectedLang={selectedLang}
        handleTranslation={handleTranslation}
        setTextToTranslate={setTextToTranslate}
        textToTranslate={textToTranslate}
      />
    </div>
  );
};

export default TranslationManager;
