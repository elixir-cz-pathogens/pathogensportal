---
# Not a dashboard: a page with its own functionality (map + diagnosis
# selector), so it lives outside the dashboards section. `type` stays
# `dashboards` because only layouts/dashboards/single.html loads
# /js/pp-charts.js, without which the map is never coloured.
type: dashboards
# Keep the old URL working: published news items link to it.
aliases:
  - "/dashboards/signals/"
title: "Signály — detekce anomálií"
origin: own
description: "Automatické vyhledávání překročení očekávané hladiny v 1 200+ řadách hlášených infekčních nemocí (diagnóza × kraj, ÚZIS ISIN) metodou Farrington/Noufaily."
image: "/images/cards/signals.svg"
highlight: true
tags: ["detekce anomálií", "surveillance", "včasné varování", "ÚZIS", "statistika"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (CC BY 4.0)</a>'
# The date of the last run comes from generated_at in this JSON, not from here.
update_from: "anomaly_signals.json"
update_read: "stamp"
---

Stránka automaticky hledá, kde je hlášených případů infekčních nemocí víc, než bývá v danou
roční dobu a v daném kraji obvyklé. Pro každou časovou řadu se ze sezónnosti a historie spočítá
**očekávaná hladina** a stránka ukáže řady, které ji výrazně překročily.

{{% if-data file="anomaly_signals_weekly.json" %}}
Přepínačem níže zvolte, co chcete vidět:

- **Letos** — 11 častých nemocí až do minulého měsíce, z týdenního souhrnu ÚZIS;
- **Všechny nemoci** — 114 diagnóz po krajích z otevřených dat ISIN, která ale končí posledním
  uzavřeným rokem.

{{< views >}}

{{% view id="letos" title="Letos: 11 častých nemocí" %}}
Otevřená data ISIN se obnovují jednou ročně. Pro jedenáct častých diagnóz ale ÚZIS vydává týdenní
souhrn až do minulého týdne, a v něm zvlášť počet záznamů z hlášení EWS. Detektor nad ním hodnotí
poslední uzavřený měsíc stejnou metodou jako zbytek stránky, jen s kratší historií (od roku 2022).

Nové hlášení EWS nepůsobí na všechny nemoci stejně, a podle toho se s nimi zachází:

- **Hlášení se jen přesunula.** Lékaři a laboratoře hlásí stejné případy novou cestou a celkový
  počet zůstal na úrovni minulých let (salmonelóza, kampylobakterióza, plané neštovice). Tyto
  nemoci se hodnotí jako dřív.
- **EWS zachytil případy, které se dřív nehlásily.** Hlášených případů je dvakrát až pětkrát víc
  než v minulých letech, aniž by přibylo nemocných (pásový opar, borelióza, mononukleóza, svrab).
  S minulými roky je srovnávat nelze, proto se nehodnotí; dlaždice ukazuje jen vývoj.
- **Úroveň vzrostla a EWS tvoří menšinu.** Nárůst může být epidemie i nový kanál; signál platí,
  jen když je nad mezí normy i bez případů z EWS.

Do kterého případu nemoc patří, se počítá z dat každý měsíc znovu. Měsíce s epidemií (třeba černý
kašel v roce 2024) se do obvyklé úrovně nepočítají.

{{< signals-weekly src="/data/charts/anomaly_signals_weekly.json" title="Letos — 11 diagnóz z týdenního souhrnu ÚZIS" >}}

Měsíční počty tu vznikají sečtením týdnů; týden na přelomu měsíce se dělí podle pracovních dnů.
Od oficiálních měsíčních počtů se tak liší obvykle o 1–2 %. Za rok 2026 navíc u 1–10 % záznamů
chybí kraj, takže krajské řady jsou o něco nižší než skutečnost; celostátní jsou úplné.
{{% view-end %}}
{{% /if-data %}}

{{% view id="vsechny" title="Všechny nemoci: otevřená data ISIN" %}}
Otevřená data ISIN tvoří přes **1 200 časových řad** (114 diagnóz × 14 krajů plus celostátní
součty). Obnovují se jednou ročně, proto se tu hodnotí poslední měsíc, který v nich je.

{{< signals-period src="/data/charts/anomaly_signals.json" >}}

{{< signals-map src="/data/charts/anomaly_signals.json" title="Kde signál je — podle kraje" >}}

{{< signals src="/data/charts/anomaly_signals.json" title="Řady nad očekávanou hladinou" >}}

### Jak číst tabulku

| Sloupec | Význam |
|---|---|
| **Nahlášeno** | Kolik případů bylo za daný měsíc skutečně nahlášeno. |
| **Z toho novým kanálem** | Kolik z nahlášených případů přišlo přes hlášení EWS — způsob hlášení, který ÚZIS zavedl v červenci 2025 a který v historii chybí. |
| **Obvykle bývá** | Endemická hladina z modelu: kolik případů by tahle nemoc v tomhle kraji a v tomhle ročním období měla mít v běžném roce. Počítá se z historie 2018–dosud se sníženou vahou minulých epidemií. |
| **Ještě v normě do** | Horní mez toho, co se ještě dá vysvětlit běžným kolísáním (99. percentil predikčního intervalu). Počet mezi *Obvykle bývá* a touhle hranicí je normální provoz; nad ní začíná signál. |
| **Skóre překročení** | (nahlášeno − obvykle) / (mez normy − obvykle). Hodnota **1** znamená počet právě na mezi normy, hodnota **2** znamená, že odchylka od obvyklého stavu je dvojnásobkem odchylky meze. Čím vyšší, tím méně pravděpodobné, že jde o náhodu. |

Příklad (vyhodnocení za 12/2025): hepatitida A v Jihomoravském kraji. Obvykle tam bývá
**1** případ, mez normy je **5**, nahlášeno bylo **80** případů. Skóre překročení je
(80 − 0,86) / (5,04 − 0,86) ≈ **19**; takovou odchylku běžné kolísání nevysvětlí.


### Nový kanál hlášení: proč u části signálů „nelze rozhodnout“

Od července 2025 přijímá ÚZIS případy i novou cestou, přes hlášení EWS. U některých
nemocí tudy přichází většina případů (stav k 12/2025): u pásového oparu 62 %, u lymeské
boreliózy („jiné spirochetové infekce“) 59 %, u infekční mononukleózy 51 %. Počet hlášených
případů tím skokově vzrostl, **aniž by to nutně odráželo vyšší výskyt onemocnění**.

Případy z nového kanálu nelze jednoduše odečíst. Část hlášení se do nového kanálu přesunula
ze starého (pásový opar hlášený starou cestou klesl z ~340 na ~175 případů měsíčně), takže počet
srovnatelný s minulými roky není znám. Leží někde mezi „nahlášeno bez nového kanálu“
a „nahlášeno celkem“. Tabulka proto signály dělí na dvě části:

- **nahoře** signály, které platí, i když se případy z nového kanálu úplně vynechají;
  jde o překročení bez ohledu na to, kolik hlášení se přesunulo;
- **pod nadpisem „nelze rozhodnout“** řady, které jsou nad mezí normy jen díky
  případům z nového kanálu. Může za nimi být skutečný nárůst i pouhá změna hlášení
  a z dat to rozlišit nelze. Na mapě jsou tyto kraje šedé, ne v odstínu skóre překročení.

Dva štítky nahrazují skóre překročení tam, kde statistický model nedává smysl:

- **vzácná nemoc** — nemoc s nejvýše ~5 případy v celé historii (záškrt, žlutá
  zimnice…). Práh tu je „víc než ojedinělý případ“: hlásí se každý shluk od 2 případů.
- **mimo dosavadní výskyt** — případy v období, ve kterém se nemoc dřív vůbec
  nevyskytovala (v historii pro tuhle část roku nejsou žádné). Může jít o skutečnou
  novinku i o změnu vykazování.

Prioritně posuzujte řady s **vysokým skóre překročení a zároveň vysokým počtem případů**.
Řádek s malými počty a skóre těsně nad 1 může být náhoda: při 99% mezi a ~1 200 hodnocených
řadách lze čistě náhodou čekat řádově desítku překročení měsíčně.

{{< signals-excluded src="/data/charts/anomaly_signals.json" >}}
{{% view-end %}}

---

### Co signál znamená — a co ne

Signál říká jediné: *počet hlášených případů je statisticky výrazně nad tím, co by
pro tuto nemoc, v tomto kraji a v tomto ročním období bylo obvyklé*. **Není to
potvrzená epidemie.** Za překročením může stát skutečné ohnisko, ale i změna
způsobu vykazování, dohlášení starších případů nebo prostá náhoda.
Signál je podnětem k dalšímu ověření, nikoli závěrem.

Platí to i obráceně: **absence signálu neznamená, že k nárůstu nedochází.** Data za poslední
měsíce jsou vždy neúplná (hlášení dobíhají se zpožděním), takže nedávný nárůst se může
ukázat až zpětně.

### Jak se očekávaná hladina počítá

Používáme metodu **Farrington/Noufaily** — stejný algoritmus, kterým britská
UKHSA týdně prochází tisíce řad laboratorních hlášení:

- očekávání dává kvazi-Poissonův regresní model nad celou dostupnou historií
  (2018–dosud) se sezónností a trendem,
- minulé epidemie v historii dostávají **sníženou váhu**, aby loňská vlna
  nezvedla letošní „normál“,
- práh je horní mez predikčního intervalu (99. percentil); **skóre překročení**
  udává, kolikrát je odchylka pozorování od očekávání větší než odchylka prahu,
- nemoci příliš vzácné na statistický model (např. záškrt) mají vlastní pravidlo:
  hlásí se každý shluk případů.

### Jak dobře metoda funguje

Výkonnost metody byla ověřena simulační studií se známým výsledkem a zpětným testem
na skutečných epidemiích:

- epidemii, která přidá **desetinásobek** běžného měsíčního kolísání, metoda
  zachytí s pravděpodobností **~96 %**, obvykle v prvním či druhém měsíci;
  pětinásobek zachytí ve ~3 případech z 5,
- **pertusová epidemie 2024** (37 918 případů): první signál **listopad 2023**,
  tři měsíce před tím, než se epidemie stala veřejným tématem; v klidném
  období 2021–2023 žádný planý poplach,
- skutečné velké epidemie jsou řádově silnější než uvedené detekční limity;
  listopad 2023 u pertuse byl zhruba patnácti- až dvacetinásobek běžného kolísání.

<p class="stat-source">
  Metoda: Farrington et al. (1996), Noufaily et al. (2012) · implementace, zpětné
  testy a simulační studie v repozitáři
  <a href="https://github.com/elixir-cz-pathogens/pathogensportal-db" target="_blank">pathogensportal-db</a> ·
  Zdroj dat: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — ISIN</a>, měsíční agregace
</p>
