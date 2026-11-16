---
title: "Linie ve stromech příbuznosti"
origin: aggregated
description: "Kolik českých kmenů je ve veřejných stromech příbuznosti Nextstrainu, do kterých linií patří a jak staré stromy jsou — chřipka, covid, ptačí chřipka, spalničky, RSV a mpox."
image: "/images/cards/flu.webp"
tags: ["genomika", "fylogeneze", "Nextstrain", "chřipka", "SARS-CoV-2", "ČR"]
data_source: '<a href="https://nextstrain.org/" target="_blank">Nextstrain</a>'
update_from: "genomics_lineages.json"
update_read: "stamp"
nav_hidden: true
---

{{< nav-pills group="genomika" active="linie" >}}

Pro chřipku, covid i ptačí chřipku existují **hotové veřejné stromy příbuznosti**, které se
průběžně přepočítávají ze sekvencí z celého světa. Portál je nestaví znovu — bere z nich to,
co se týká Česka: kolik kmenů v nich je, do kterých linií patří a kdy byl strom naposledy
přepočítán. Odkaz u každého stromu vede rovnou na pohled s vybraným Českem.

{{< genomics part="lineages" note="Strom příbuznosti seskupuje viry podle podobnosti genomu. Blízko sebe jsou kmeny, které mají společného předka nedávno; neříká to, kdo koho nakazil. **Linie** (klad, podlinie) je pojmenovaná větev stromu — způsob, jak se o skupině příbuzných virů mluvit." >}}

### Metodika a omezení

- **Z několika desítek kmenů nelze usuzovat na zastoupení linií v populaci.** Počty ukazují,
  co se z Česka do stromu dostalo, ne jak časté linie u nás jsou. U ptačí chřipky jsou počty
  řádově vyšší, i tam jde ale o vzorky odebrané při ohniscích v chovech, ne plošně.
- **Stáří stromu je u každého jiné.** Chřipkové stromy se přepočítávají denně až týdně,
  evropský strom SARS-CoV-2 naposledy v říjnu 2025. Datum je proto uvedené u každého zvlášť.
- **Ptačí chřipka je nákaza ptáků** a spadá pod veterinární dozor, ne pod SZÚ. Žádný český
  vzorek v tom stromu není od člověka.
- **Nula je zjištění.** Spalničkový i RSV strom se obnovují pravidelně a stojí na zcela
  otevřených datech, do kterých může přispět kdokoli.
- Podkladová data stromů chřipky, covidu a ptačí chřipky pocházejí z databáze GISAID. Její
  podmínky zakazují data šířit a zpřístupňovat přes jiný portál, proto se z nich přebírají
  jen souhrnné počty a odkaz; sekvence se nestahují.
- Kmen se počítá jako český podle pole „země odběru“ ve stromu.

### Další pohledy na tatáž data

- [Genomická data z Česka](/dashboards/genomics/) — kolik dat je v archivu ENA
- [Chřipka a respirační viry](/dashboards/influenza-surveillance/) — laboratorní záchyty
  a podíl pozitivních vzorků
- [Fylogeneze chřipky](/dashboards/nextstrain-influenza/) a
  [SARS-CoV-2](/dashboards/nextstrain-sarscov2/) — stromy samotné

<p class="stat-source">
  Zdroj: veřejné stromy <a href="https://nextstrain.org/" target="_blank">Nextstrain</a>
  (Hadfield a kol., <em>Bioinformatics</em> 2018) · podkladová data GISAID, USDA, GenBank
  a Pathoplexus podle jednotlivých stromů ·
  Úpravy: počty českých kmenů, jejich linie a stáří stromů počítá Pathogen Portal.
</p>
