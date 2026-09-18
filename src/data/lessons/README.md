# Lesson language packs

Curriculum ships **in the app** as JSON (not Mongo). Progress/XP stay in the database.

## Layout

```
src/data/lessons/
  units.json          # shared unit map (ids used by every pack)
  manifest.json       # which direction packs exist
  packs/
    en-fr.json        # 25 lessons, English → French
    fr-en.json        # 25 lessons, French → English
```

Types and loaders live in `src/data/lessons.ts`.

## Add a language pack

1. Copy an existing pack (e.g. `packs/en-fr.json`).
2. Translate prompts/terms for the new direction (e.g. `en-es`).
3. Keep the same `id`, `slug`, and `unitId` so progress keys stay stable.
4. Register the pack in `manifest.json` and in `LESSONS_PATH_MAP` inside `lessons.ts`.
5. Extend `LessonDirection` if you add a new direction code.

## Lesson shape

Each lesson:

- `id`, `slug`, `title`, `description`
- `unitId` (must exist in `units.json`)
- `direction` (`en-fr` | `fr-en` | …)
- `level`, `estimatedMinutes`, `xp`
- `steps[]` (`intro` | `tip` | `vocab` | `phrase` | `check` | …)

## Supported packs today

| Pack | Direction | Lessons |
|------|-----------|--------|
| English → French | `en-fr` | 25 |
| French → English | `fr-en` | 25 |
