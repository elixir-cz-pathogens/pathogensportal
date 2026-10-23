---
title: "Formát datových souborů"
description: "Struktura souborů JSON, ze kterých se kreslí grafy."
weight: 30
---

Data grafů jsou v `frontend/static/data/charts/*.json` a na webu na adrese
`/data/charts/<soubor>.json`. Generuje je `pathogensportal-db`; ručně se neupravují, další běh
zpracování by změny přepsal.

## Struktura

```json
{
  "labels": ["KT 40/26", "KT 41/26"],
  "labels_en": ["Wk 40/26", "Wk 41/26"],
  "datasets": [
    { "label": "Influenza A (celkem)", "label_en": "Influenza A (total)", "data": [1, 4] }
  ],
  "meta": { "chart_id": "flu_weekly", "metric": "lab_detections", "unit": "count", "…": "…" }
}
```

| Pole | Význam |
|---|---|
| `labels` | popisky osy X (období, věkové skupiny, kraje…) |
| `datasets[]` | řady: `label` a hodnoty `data` ve stejném pořadí jako `labels` |
| `*_en` | anglické varianty popisků (`labels_en`, `label_en`, `x_title_en`, `unit_en`) |
| `x_title`, `unit` | název osy X a jednotka (u některých grafů) |

Barvy a styl řad v souboru web ignoruje; bere je z vlastní palety.

## Metadata `meta`

| Pole | Význam |
|---|---|
| `chart_id` | identifikátor grafu |
| `metric`, `unit` | co se měří a v jaké jednotce |
| `grain` | časová podrobnost (`week`, `month`, `year`…) |
| `region` | územní podrobnost (`CZ`, `NUTS3`…) |
| `generated_at` | kdy soubor vznikl (UTC) |
| `period` | pokryté období (`start`, `end`, počet bodů), pokud je k dispozici |
| `source_ids`, `sources[]` | zdroje: vydavatel, stránka, licence, kdy byla data stažena |
| `caveats[]` | známá omezení a zlomy v datech (`id`, `since`, `description`, `impact`) |

Výstup Signálů (`anomaly_signals.json`) má vlastní strukturu: vyhodnocované období
(`target_period`), seznam signálů a parametry metody (`provenance`).
