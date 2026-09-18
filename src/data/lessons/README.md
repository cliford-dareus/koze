# Lesson language packs

Curriculum ships **in the app** as JSON. Progress stays in Mongo / localStorage.

## Packs (22 directions)

| Pattern | Example | Meaning |
|---------|---------|--------|
| `en-fr` / `fr-en` | French track | Original high-detail packs |
| `en-{lang}` | `en-es`, `en-ja` | Learn that language from English |
| `{lang}-en` | `es-en`, `ja-en` | Learn English from that language |

**Languages:** `fr`, `es`, `ht`, `pt`, `de`, `it`, `zh`, `ja`, `ko`, `ar`, `hi`

Each pack has **25 lessons** across 8 units (foundations → grammar-core), same `id` / `slug` / `unitId` so progress keys stay stable.

## Files

```
src/data/lessons/units.json
src/data/lessons/manifest.json
src/data/en-fr.json
src/data/fr-en.json
src/data/en-es.json … en-hi.json
src/data/es-en.json … hi-en.json
```

Loader: `src/data/lessons.ts`  
Direction mapping: `src/lib/learning-prefs.ts` → `directionForLearningLanguage()`
