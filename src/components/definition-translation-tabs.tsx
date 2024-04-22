"use client";

import { getDefinition, translate } from "@/_actions/translate";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Group, groupSimilarMeanings } from "@/lib/utils";
import { LucidePlay } from "lucide-react";
import TextToSpeechButton from "./text-to-speech-button";

type Props = {
  word: string;
};

const DefinitionTranslationTabs = ({ word }: Props) => {
  const [meaningBytype, setMeaningBytype] = React.useState<
    {
      title: string;
      content: Group;
    }[]
  >([]);
  const [translation, setTranslation] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [definition, translationResult] = await Promise.all([
          getDefinition(word.replace(/^"|"$/g, "")),
          translate(word, "en", "fr"),
        ]);

        const groupedMeanings = groupSimilarMeanings(definition?.meanings);
        const meaningsByType = Object.keys(groupedMeanings).map(
          (partOfSpeech) => {
            const item = groupedMeanings[partOfSpeech];
            const singleItem = {
              title: partOfSpeech,
              content: item,
            };
            return singleItem;
          }
        );

        setMeaningBytype(meaningsByType);
        setTranslation(
          translationResult.response.data.translations.translatedText
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [word]);

  return (
    <div className="p-4">
      <Tabs className="max-h-[80vh]" defaultValue="definition">
        <TabsList>
          <TabsTrigger value="definition">Definition</TabsTrigger>
          <TabsTrigger value="translation">Translation</TabsTrigger>
        </TabsList>
        <div className="max-h-[80vh] overflow-y-auto">
          <TabsContent value="definition">
            {meaningBytype.map((content) => (
              <article key={content.title}>
                <h3 className="text-xl">{content.title}</h3>
                <ul className="list-decimal ml-4 mb-4">
                  {content.content.definitions.map((def) => (
                    <li className="mt-2" key={def.definition}>
                      {def.definition} <br />
                      <span className="text-slate-500">
                        {def.example ? `"${def.example}"` : null}
                      </span>
                      {def.synonyms.length > 0 && (
                        <span className="flex mt-2 flex-wrap items-center">
                          synonyms:{" "}
                          {def.synonyms.map((syn) => (
                            <p
                              key={syn}
                              className="ml-2 mt-1 border border-indigo-500 px-3 rounded-3xl cursor-pointer"
                            >
                              {syn}
                            </p>
                          ))}
                        </span>
                      )}
                      {def.antonyms.length > 0 && (
                        <span className="flex mt-2 flex-wrap items-center">
                          antonyms:{" "}
                          {def.antonyms.map((ant) => (
                            <p
                              key={ant}
                              className="ml-2 mt-1 border border-green-500 px-3 rounded-3xl cursor-pointer"
                            >
                              {ant}
                            </p>
                          ))}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </TabsContent>
          <TabsContent value="translation">
            <div>
                <h3>{word}</h3>
            </div>
            <div className="flex gap-4">
              <TextToSpeechButton text={word} classnames="py-4">
                <LucidePlay size={20} />
                <p>{word}</p>
              </TextToSpeechButton>

              <TextToSpeechButton text={translation} lang="fr" classnames="py-4">
                <LucidePlay size={20} />
                <p>{translation}</p>
              </TextToSpeechButton>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DefinitionTranslationTabs;
