---
title: "Signály — detekce anomálií"
origin: own
description: "Automatické vyhledávání překročení očekávané hladiny v 1 200+ řadách hlášených infekčních nemocí (diagnóza × kraj, ÚZIS ISIN) metodou Farrington/Noufaily."
image: "/images/cards/signals.svg"
highlight: true
tags: ["detekce anomálií", "surveillance", "včasné varování", "ÚZIS", "statistika"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (CC BY 4.0)</a>'
update_freq: "S každým během datové pipeline"
---

Data o infekčních nemocech tvoří přes **1 200 časových řad** (114 diagnóz × 14 krajů
plus celostátní součty) — příliš mnoho na to, aby je kdokoli sledoval očima. Tato
stránka je proto prochází automaticky: pro každou řadu spočítá **očekávanou endemickou
hladinu** ze sezónnosti a historie a zobrazí měsíce, kdy hlášený počet překročil
prahovou mez.

{{< signals src="/data/charts/anomaly_signals.json" title="Řady nad očekávanou hladinou" >}}

### Jak číst tabulku

| Sloupec | Význam |
|---|---|
| **Případy** | Kolik případů bylo za daný měsíc skutečně nahlášeno. |
| **Očekáváno** | Endemická hladina z modelu: kolik případů by tahle nemoc v tomhle kraji a v tomhle ročním období měla mít v běžném roce. Počítá se z historie 2018–dosud se sníženou vahou minulých epidemií. |
| **Práh** | Horní mez toho, co se ještě dá vysvětlit běžným kolísáním (99. percentil predikčního intervalu). Hodnota mezi *Očekáváno* a *Práh* je normální provoz; nad prahem začíná signál. |
| **Síla** | Kolikrát pozorování překročilo vzdálenost od očekávání k prahu. **1×** = přesně na prahu, **2×** = dvakrát tak daleko za ním. Čím vyšší, tím méně pravděpodobné, že jde o náhodu. |

Příklad z tabulky: hepatitida A v Jihomoravském kraji — očekáváno **0,9** případu,
práh **5**, nahlášeno **80**. Pozorování je tedy ~19× dál za prahem, než kam sahá
běžné kolísání (síla 19×) — to už náhoda prakticky nevysvětlí.

Dva štítky nahrazují sílu tam, kde statistický model nedává smysl:

- **vzácná nemoc** — nemoc s nejvýše ~5 případy v celé historii (záškrt, žlutá
  zimnice…). Práh tu je „víc než ojedinělý případ": hlásí se každý shluk od 2 případů.
- **mimo dosavadní výskyt** — případy v období, ve kterém se nemoc dřív vůbec
  nevyskytovala (v historii pro tuhle část roku nejsou žádné). Může jít o skutečnou
  novinku i o změnu vykazování.

Na co se dívat nejdřív: **vysoká síla spolu s vysokým počtem případů** (rozjetá
epidemie). Řádek s malými počty a nízkou silou těsně nad 1× může být náhoda —
při 1 200 hodnocených řadách jich pár takových čekáme každý měsíc.

---

### Co signál znamená — a co ne

Signál říká jediné: *počet hlášených případů je statisticky výrazně nad tím, co by
pro tuto nemoc, v tomto kraji a v tomto ročním období bylo obvyklé*. **Není to
potvrzená epidemie.** Za překročením může stát skutečné ohnisko, ale i změna
způsobu vykazování, dohlášení starších případů nebo prostá náhoda — při použitém
prahu (99. percentil) čekáme zhruba **1 % překročení čistou náhodou** i v úplně
klidné situaci. Signál je pozvánka podívat se blíž, ne závěr.

Platí to i obráceně: **ticho není důkaz klidu.** Data za poslední měsíce jsou vždy
neúplná (hlášení dobíhají se zpožděním), takže čerstvý nástup se může ukázat až
zpětně.

### Jak se očekávaná hladina počítá

Používáme metodu **Farrington/Noufaily** — stejný algoritmus, kterým britská
UKHSA týdně prochází tisíce řad laboratorních hlášení:

- očekávání dává kvazi-Poissonův regresní model nad celou dostupnou historií
  (2018–dosud) se sezónností a trendem,
- minulé epidemie v historii dostávají **sníženou váhu**, aby loňská vlna
  nezvedla letošní „normál",
- práh je horní mez predikčního intervalu (99. percentil); **síla** signálu
  udává, kolikrát pozorování překročilo prahovou vzdálenost od očekávání,
- nemoci příliš vzácné na statistický model (např. záškrt) mají vlastní pravidlo:
  hlásí se každý shluk případů.

### Jak dobře metoda funguje

Charakteristiku metody jsme změřili simulační studií se známou pravdou
a zpětným testem na skutečných epidemiích:

- epidemii, která přidá **desetinásobek** běžného měsíčního kolísání, metoda
  zachytí s pravděpodobností **~96 %**, obvykle v prvním či druhém měsíci;
  pětinásobek zachytí ve ~3 případech z 5,
- **pertusová epidemie 2024** (37 918 případů): první signál **listopad 2023**,
  tři měsíce před tím, než se epidemie stala veřejným tématem — a v klidném
  období 2021–2023 žádný planý poplach,
- skutečné velké epidemie jsou řádově silnější než uvedené detekční limity;
  listopad 2023 u pertuse byl zhruba patnácti- až dvacetinásobek běžného kolísání.

<p class="stat-source">
  Metoda: Farrington et al. (1996), Noufaily et al. (2012) · implementace, zpětné
  testy a simulační studie v repozitáři
  <a href="https://github.com/elixir-cz-pathogens/pathogensportal-db" target="_blank">pathogensportal-db</a> ·
  Zdroj dat: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — ISIN</a>, měsíční agregace
</p>
