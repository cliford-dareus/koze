"use client";

import { FormEvent, useState } from "react";
import ResultComponent from "./result-component";
import TranslationForm from "./translation-form";
import { translate } from "@/_actions/translate";

export const supportedLanguages = [
  { id: 1, name: "English", value: "en" },
  { id: 2, name: "French", value: "fr" },
  { id: 3, name: "Spanish", value: "es" },
];

const TranslationMananger = () => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleTranslate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    const data = await translate(
      textToTranslate,
      selectedLang.from,
      selectedLang.to,
    );

    if (data?.response.data.translations.translatedText)
      setResult(data?.response.data.translations.translatedText);
    setTextToTranslate("");
    setIsLoading(false);
  };

  console.log(selectedLang);

  return (
    <div className="">
      <ResultComponent
        handleLangChange={handleLangChange}
        selectedLang={selectedLang}
        output={result}
      />

      <TranslationForm
        handleLangChange={handleLangChange}
        selectedLang={selectedLang}
        handleTranslation={handleTranslate}
        setTextToTranslate={setTextToTranslate}
        textToTranslate={textToTranslate}
      />
    </div>
  );
};

export default TranslationMananger;
