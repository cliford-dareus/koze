import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export type Group = {
  partOfSpeech: string;
  definitions: definitionsType[];
  antonyms: string[];
  synonyms: string[];
};

type Meaning = {
  partOfSpeech: string;
  definitions: definitionsType[];
  synonyms: string[];
  antonyms: string[];
};

type definitionsType = {
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const groupSimilarMeanings = (meanings: Meaning[]) => {
    return meanings?.reduce((acc, item) => {
      if (acc[item.partOfSpeech]) {
        acc[item.partOfSpeech] = {
          ...acc[item.partOfSpeech],
          definitions: [
            ...acc[item.partOfSpeech].definitions,
            ...item.definitions,
          ],
          synonyms: [...acc[item.partOfSpeech].synonyms, ...item.synonyms],
          antonyms: [...acc[item.partOfSpeech].antonyms, ...item.antonyms],
        };
      } else {
        acc[item.partOfSpeech] = item;
      }

      return acc;
    }, {} as { [key: string]: Group });
  };
