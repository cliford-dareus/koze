/**
 * Merriam-Webster Collegiate® Thesaurus helpers.
 * Docs: https://www.dictionaryapi.com/api/v3/references/thesaurus/json/{word}?key=KEY
 */

export type DefinitionSense = {
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
};

export type Meaning = {
  partOfSpeech: string;
  definitions: DefinitionSense[];
  synonyms: string[];
  antonyms: string[];
};

export type WordLookupResult =
  | {
      ok: true;
      word: string;
      meanings: Meaning[];
      suggestions?: never;
    }
  | {
      ok: false;
      error: string;
      suggestions?: string[];
    };

type MwWordRef = { wd?: string };

type MwSense = {
  dt?: unknown[];
  syn_list?: MwWordRef[][];
  ant_list?: MwWordRef[][];
  near_list?: MwWordRef[][];
};

type MwEntry = {
  meta?: {
    id?: string;
    stems?: string[];
    syns?: string[][];
    ants?: string[][];
  };
  hwi?: { hw?: string };
  fl?: string;
  shortdef?: string[];
  def?: { sseq?: unknown[] }[];
};

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

function cleanMwMarkup(text: string): string {
  return text
    .replace(/\{it\}/g, "")
    .replace(/\{\/it\}/g, "")
    .replace(/\{bc\}/g, "")
    .replace(/\{wi\}/g, "")
    .replace(/\{\/wi\}/g, "")
    .replace(/\{.*?\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordsFromLists(lists?: MwWordRef[][]): string[] {
  if (!lists?.length) return [];
  const out: string[] = [];
  for (const group of lists) {
    for (const item of group ?? []) {
      if (item?.wd) out.push(item.wd);
    }
  }
  return uniqueStrings(out);
}

function flattenStringLists(lists?: string[][]): string[] {
  if (!lists?.length) return [];
  return uniqueStrings(lists.flat().filter(Boolean));
}

function extractTextAndExample(dt: unknown[] | undefined): {
  definition: string;
  example: string;
} {
  let definition = "";
  let example = "";
  if (!Array.isArray(dt)) return { definition, example };

  for (const node of dt) {
    if (!Array.isArray(node) || node.length < 2) continue;
    const [tag, payload] = node;
    if (tag === "text" && typeof payload === "string") {
      definition = cleanMwMarkup(payload);
    }
    if (tag === "vis" && Array.isArray(payload)) {
      const first = payload[0] as { t?: string } | undefined;
      if (first?.t) example = cleanMwMarkup(first.t);
    }
  }
  return { definition, example };
}

function walkSenses(sseq: unknown[] | undefined): DefinitionSense[] {
  const senses: DefinitionSense[] = [];
  if (!Array.isArray(sseq)) return senses;

  const visit = (node: unknown) => {
    if (!Array.isArray(node)) return;
    if (node[0] === "sense" && node[1] && typeof node[1] === "object") {
      const sense = node[1] as MwSense;
      const { definition, example } = extractTextAndExample(sense.dt);
      const synonyms = wordsFromLists(sense.syn_list);
      const antonyms = [
        ...wordsFromLists(sense.ant_list),
        ...wordsFromLists(sense.near_list),
      ];
      if (definition || synonyms.length || antonyms.length) {
        senses.push({
          definition: definition || "—",
          example,
          synonyms: uniqueStrings(synonyms),
          antonyms: uniqueStrings(antonyms),
        });
      }
      return;
    }
    for (const child of node) visit(child);
  };

  for (const item of sseq) visit(item);
  return senses;
}

function entryToMeaning(entry: MwEntry): Meaning | null {
  const partOfSpeech = entry.fl?.trim() || "other";
  const senseDefs =
    entry.def?.flatMap((block) => walkSenses(block.sseq)) ?? [];

  const metaSyns = flattenStringLists(entry.meta?.syns);
  const metaAnts = flattenStringLists(entry.meta?.ants);

  let definitions = senseDefs;
  if (!definitions.length && entry.shortdef?.length) {
    definitions = entry.shortdef.map((d, i) => ({
      definition: cleanMwMarkup(d),
      example: "",
      synonyms: i === 0 ? metaSyns : [],
      antonyms: i === 0 ? metaAnts : [],
    }));
  }

  if (!definitions.length && (metaSyns.length || metaAnts.length)) {
    definitions = [
      {
        definition: "Related words",
        example: "",
        synonyms: metaSyns,
        antonyms: metaAnts,
      },
    ];
  }

  if (!definitions.length) return null;

  const synonyms = uniqueStrings([
    ...metaSyns,
    ...definitions.flatMap((d) => d.synonyms),
  ]);
  const antonyms = uniqueStrings([
    ...metaAnts,
    ...definitions.flatMap((d) => d.antonyms),
  ]);

  return { partOfSpeech, definitions, synonyms, antonyms };
}

export function parseThesaurusResponse(
  raw: unknown,
  queriedWord: string,
): WordLookupResult {
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
    return {
      ok: false,
      error: `No exact match for “${queriedWord}”. Try a suggestion.`,
      suggestions: (raw as string[]).slice(0, 8),
    };
  }

  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: `No thesaurus entry for “${queriedWord}”.` };
  }

  const meanings: Meaning[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const meaning = entryToMeaning(item as MwEntry);
    if (meaning) meanings.push(meaning);
  }

  if (!meanings.length) {
    return { ok: false, error: `No usable senses for “${queriedWord}”.` };
  }

  const head =
    (raw[0] as MwEntry)?.hwi?.hw?.replace(/\*/g, "") ||
    (raw[0] as MwEntry)?.meta?.id?.split(":")[0] ||
    queriedWord;

  return { ok: true, word: head, meanings };
}

export async function fetchCollegiateThesaurus(
  word: string,
  apiKey: string,
): Promise<WordLookupResult> {
  const cleaned = word.trim().toLowerCase();
  if (!cleaned) {
    return { ok: false, error: "Enter a word to look up." };
  }

  const url = new URL(
    `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${encodeURIComponent(cleaned)}`,
  );
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    return {
      ok: false,
      error: `Thesaurus request failed (${response.status}).`,
    };
  }

  const body: unknown = await response.json();
  return parseThesaurusResponse(body, cleaned);
}
