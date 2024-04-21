"use client";

import { translate } from "@/_actions/translate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LucideArrowLeftRight } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const supportedLanguages = [
  { id: 1, name: "English", value: "En" },
  { id: 2, name: "French", value: "Fr" },
  { id: 3, name: "Spanish", value: "Es" },
];

const Translation = (props: Props) => {
  const [result, setResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [textToTranslate, setTextToTranslate] = React.useState("");
  const [selectedLanguage, setSelectedLanguage] = React.useState({
    from: "",
    to: "",
  });

  const handleLanguageChange = (type: "from" | "to", value: string) => {
    setSelectedLanguage((prevState) => ({
      ...prevState,
      [type]: value,
    }));
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await translate(
      textToTranslate,
      selectedLanguage.from,
      selectedLanguage.to
    );

    setResult(data.response.data.translations.translatedText);
    setIsLoading(false);
  };

  return (
    <div className="mt-auto h-[50vh]">
      <div className="flex flex-col items-center p-4 rounded-lg border border-slate-300 mt-auto h-full w-full">
        <div className="flex gap-4 items-center w-[100%]">
          <Select
            value={selectedLanguage.from}
            onValueChange={(value) => handleLanguageChange("from", value)}
          >
            <SelectTrigger>From: {selectedLanguage.from}</SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.value}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>
            <LucideArrowLeftRight />
          </span>
          <Select
            value={selectedLanguage.to}
            onValueChange={(value) => handleLanguageChange("to", value)}
          >
            <SelectTrigger>To: {selectedLanguage.to}</SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.value}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col h-full gap-4 mt-4 w-full">
          <div className="flex-1 border p-2 rounded-md">
            {!isLoading ? (
              <p className="text-2xl font-medium">{result}</p>
            ) : (
              <div className="">Translating...</div>
            )}
          </div>

          <form className="h-[100px]" action="" onSubmit={handleTranslate}>
            <Input
              className="mb-4"
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
            />
            <Button className="bg-indigo-400" type="submit">Translate</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Translation;
