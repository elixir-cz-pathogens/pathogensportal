---
title: "Geny rezistence v českých izolátech"
origin: aggregated
description: "Které geny rezistence k antibiotikům našel nástroj AMRFinderPlus v sekvenovaných českých izolátech klebsiel, stafylokoka, enterokoka a listerií."
image: "/images/cards/infectious-hub.svg"
tags: ["genomika", "rezistence", "antibiotika", "NCBI", "ČR"]
data_source: '<a href="https://www.ncbi.nlm.nih.gov/pathogens/" target="_blank">NCBI Pathogen Detection</a>'
update_from: "genomics_amr.json"
update_read: "stamp"
nav_hidden: true
---

{{< nav-pills group="genomika" active="rezistence" >}}

Americké NCBI nad všemi veřejnými bakteriálními genomy samo pouští nástroj **AMRFinderPlus**,
který v sestaveném genomu hledá známé geny rezistence k antibiotikům, a výsledek zveřejňuje.
Portál nic nepočítá — jen z výsledků vybírá české izoláty a sčítá, u kolika se který gen našel.

{{< genomics part="amr" note="Nález genu znamená, že je gen v genomu přítomen. Není to totéž co laboratorně změřená citlivost kmene k antibiotiku: gen může být neaktivní a naopak rezistence může mít i jinou příčinu. Sledují se geny, kvůli kterým se v Evropě hlídá právě tenhle druh." >}}

### Metodika a omezení

- **Sekvenované izoláty nejsou náhodný vzorek.** Sekvenují se přednostně kmeny vybrané kvůli
  rezistenci, kmeny z nemocničních nákaz a část vzorků pochází z odpadních vod. Z počtů se
  proto **záměrně nepočítají procenta** — neříkaly by, jak častá je rezistence u pacientů.
- **Záznam je izolát, ne pacient.** Od jednoho člověka může pocházet víc izolátů a naopak
  většina nemocných se nesekvenuje vůbec.
- **Výběr genů není úplný seznam rezistence.** Jsou to geny, kvůli kterým se v Evropě sleduje
  právě tenhle druh; genomy nesou i další geny, včetně těch, které má druh sám o sobě.
- Příbuznost izolátů (shluky velmi podobných genomů, které NCBI také počítá) portál zatím
  neukazuje. Shluk se snadno čte jako ohnisko, přitom znamená jen podobnost genomů.
- Izolát se počítá jako český podle pole „místo odběru“ v databázi NCBI. Počty se proto
  mohou lišit od archivu ENA, který zemi určuje jinak.
- Odhad citlivosti a volbu léčby dělá laboratoř u konkrétního pacienta. Tahle stránka
  o léčbě nevypovídá.

### Souvislosti

- [Genomická data z Česka](/dashboards/genomics/) — kolik dat je v archivu ENA
- [Infekční nemoci — přehled](/dashboards/infectious-diseases/) — hlášené případy

<p class="stat-source">
  Zdroj: <a href="https://www.ncbi.nlm.nih.gov/pathogens/" target="_blank">NCBI Pathogen Detection</a>,
  výsledky nástroje AMRFinderPlus ·
  <a href="https://www.ncbi.nlm.nih.gov/home/about/policies/" target="_blank">NCBI</a> na užití
  molekulárních dat neklade omezení ·
  Úpravy: výběr českých izolátů, zařazení genů do skupin a součty dělá Pathogen Portal.
</p>
