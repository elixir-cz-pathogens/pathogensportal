---
title: "Chřipka — intenzita sezóny"
origin: own
description: "Jak silná je chřipková sezóna, kam míří a co čekat za měsíc: týdenní nemocnost ILI a ARI proti prahům metody MEM, trend růstu a čtyřtýdenní předpověď evropského hubu RespiCast."
image: "/images/cards/flu.webp"
highlight: true
tags: ["chřipka", "ILI", "ARI", "MEM", "předpověď", "surveillance", "ČR"]
data_source: '<a href="https://www.who.int/tools/flunet" target="_blank">WHO FluID</a> · <a href="https://erviss.org/" target="_blank">ECDC ERVISS</a> · <a href="https://respicast.ecdc.europa.eu/" target="_blank">ECDC RespiCast</a>'
update_from: "flu_mem.json"
update_read: "stamp"
---

{{< callout tone="warning" >}}
**Stránka je ve vývoji.** Výpočty i podoba se ještě mění a čísla tu mohou být neúplná nebo
vzájemně nesourodá: hlášení chodí se zpožděním a zpětně se doplňují, přes léto se nehlásí
vůbec, pokrytá populace se mezi sezónami mění a předpověď pochází od třetí strany. Neberte
stránku jako podklad pro rozhodování — závazné jsou údaje SZÚ, ÚZIS a MZČR.
{{< /callout >}}

{{< flu part="status" />}}

{{< method title="Jak se pozná trend a jak často se trefuje" >}}
{{< method-part title="Metoda" >}}
Z posledních tří týdnů se váženou regresí spočítá **tempo růstu** a pravděpodobnost, že je sklon opravdu kladný. Váhou je počet případů — týden se stovkami případů řekne víc než týden s desítkami.

```
ln( případy / populace ) = a + r · týden
změna za týden = e^r − 1
P(růst) = P( T[n−2] < r / SE )     (Studentovo t)
```

Kategorie podle P(růst): nad 90 % roste · 75–90 % pravděpodobně roste · 25–75 % beze změny · 10–25 % pravděpodobně klesá · pod 10 % klesá.

**Proč ne reprodukční číslo R.** R patří jednomu patogenu se známým generačním intervalem. ILI a ARI jsou směs chřipky, RSV, covidu a rhinovirů — jedno R pro ně neexistuje a převod by byl přesný jen naoko.
{{< /method-part >}}
{{< method-part title="Studie" >}}
- CDC, Center for Forecasting and Outbreak Analytics: *Current Epidemic Trends (Based on R<sub>t</sub>)* — odtud kategorie a hranice pravděpodobností.
- Wallinga J., Lipsitch M. (2007): *How generation intervals shape the relationship between growth rates and reproductive numbers.* Proc. R. Soc. B 274 — proč tempo růstu nese stejnou informaci jako R.
{{< /method-part >}}
{{< method-part title="Jak jsme to testovali" >}}
Na minulých sezónách: když portál řekl…, další týden nemocnost opravdu vzrostla:

{{< flu part="backtest" />}}

Délku okna (3 týdny) rozhodl právě tenhle test. S okny 4 a 5 týdnů se pořadí kategorií rozpadá a kolem vrcholu se „roste“ hlásí ještě dva týdny po obratu.
{{< /method-part >}}
{{< method-part title="Omezení dat" >}}
- **Trend popisuje poslední tři týdny, nepředpovídá.** I po „roste“ další týden nemocnost ve třetině případů klesla.
- **Sváteční týdny** (52, 53, 1) hlášení skokově sníží a pak zvýší — trend přes ně nese upozornění a do testu se nepočítá.
- **Letní pauza.** Zhruba od týdne 21 do 35 se nehlásí; dokud po ní nejsou tři souvislé týdny, trend není.
- Čerstvé týdny se ještě dohlašují, poslední bod se může zpětně posunout.
{{< /method-part >}}
{{< /method >}}

{{< flu part="chart" indicator="ili" controls="true" height="400" title="Týdenní nemocnost ILI proti prahům intenzity" subtitle="ILI na 100 tis. obyvatel · říjen až květen (kalendářní týdny 40–20) · celá ČR" note="**Kalendářní týden** je týden podle normy ISO: od pondělí do neděle, týden 1 je ten s prvním čtvrtkem roku. Sezóna se sleduje od týdne 40 (přelom září a října) do týdne 20 (polovina května). ILI = chřipce podobné onemocnění hlášené praktickými lékaři, přepočtené na 100 tis. obyvatel pokryté populace. Jde o klinickou diagnózu, ne laboratorně potvrzenou chřipku. Nahoře na stránce je vždy poslední hlášený týden. Graf ukazuje běžící sezónu, jakmile má první hlášení v sezónním okně; do té doby poslední uzavřenou sezónu, kterou lze přehrát posuvníkem — běžící sezóna jde vybrat i tak." >}}
{{< method inside="true" title="Jak se prahy počítají, jak jsme to ověřili a kde má metoda slabiny" >}}
{{< method-part title="Metoda" >}}
**Moving Epidemic Method (MEM)** — standard ECDC a WHO pro chřipkovou surveillance. Tři kroky:

1. V každé minulé sezóně se najde epidemické období. Pro každou délku *r* se vezme *r* po sobě jdoucích týdnů s největším součtem a spočítá se, kolik procent celé sezóny pokrývají. Epidemie trvá, dokud přidaný týden přináší aspoň δ = 2,8 % sezóny.

```
t(r) = max  Σ x[i..i+r−1] / Σ x · 100
Δ(r) = t̃(r) − t̃(r−1)        (t̃ = vyhlazená křivka)
délka epidemie = poslední r, kde Δ(r) ≥ δ
```

2. **Epidemický práh** z nejvyšších týdnů *před* epidemií: hodnota, kterou klidný týden překročí jen v 5 % případů.

```
práh = průměr + 1,645 · sd
```

3. **Pásma intenzity** z nejvyšších týdnů *během* epidemií, na logaritmické škále (vrcholy jsou zhruba lognormální):

```
hranice = exp( průměr(ln x) + z · sd(ln x) )
z = −0,253 · 1,282 · 1,960   (40. · 90. · 97,5. percentil)
```

Z každé sezóny jdou do odhadu 3 nejvyšší týdny (30 hodnot děleno počtem sezón).
{{< /method-part >}}
{{< method-part title="Studie" >}}
- Vega T. a kol. (2013): *Influenza surveillance in Europe: establishing epidemic thresholds by the Moving Epidemic Method.* Influenza and Other Respiratory Viruses 7(4).
- Vega T. a kol. (2015): *Influenza surveillance in Europe: comparing intensity levels calculated using the MEM.* IORV 9(5).
- WHO (2017, revize 2024): *Pandemic Influenza Severity Assessment (PISA)* — rámec, který MEM doporučuje.
- Referenční implementace: R balík `mem` (J. E. Lozano).
{{< /method-part >}}
{{< method-part title="Jak jsme to testovali" >}}
- **Shoda s referencí.** Náš výpočet dává na českých datech i na umělých sezónách stejné prahy a stejné začátky a konce epidemií jako R balík `mem` 2.19 — na deset platných číslic. Hlídá to automatický test při každé změně kódu.
- **Zpětný test po sezónách.** Prahy se spočítají bez jedné sezóny a na ní se vyzkouší. Epidemický práh takto zachytil <span data-pp-flu-val="ili.validation.sensitivity"></span> epidemických týdnů a mimo epidemii mlčel v <span data-pp-flu-val="ili.validation.specificity"></span> týdnů.
- **Citlivost na δ.** Zkoušeli jsme δ od 2,0 do 4,0 %. Rozdíly jsou v šumu, proto zůstává standardních 2,8 — prahy jsou tak srovnatelné s jinými zeměmi.
{{< /method-part >}}
{{< method-part title="Omezení dat" >}}
- **ILI je klinická diagnóza, ne laboratorně potvrzená chřipka.** Do čísla se promítají i jiné viry se stejnými příznaky.
- **Deset sezón je málo.** Pásmo „velmi vysoká“ stojí na extrapolaci — tak silnou sezónu data neobsahují.
- **Hlásí jen část ordinací.** Pokrytá populace se mění; ve FluID skočila v sezóně 2025/26 z 5,4 na 8,5 mil., proto ta sezóna do prahů zatím nejde.
- **Svátky.** Kolem Vánoc ordinace nehlásí a křivka má umělý zub.

Do odhadu jde posledních deset sezón, ve kterých epidemie proběhla. Vynechané:

{{< flu part="excluded" />}}
{{< /method-part >}}
{{< /method >}}
{{< /flu >}}

### Aktuální výhled na čtyři týdny

{{< flu part="outlook" />}}

{{< method title="Odkud je předpověď, jak se počítá pravděpodobnost a jak jí věřit" >}}
{{< method-part title="Metoda" >}}
Předpověď je **ensemble evropského hubu RespiCast** (ECDC, ISI Foundation, LSHTM). Desítky týmů každý týden pošlou svůj model — klasickou statistiku (ARIMA, Kalmanův filtr), epidemiologické modely (SEIR), strojové učení (LightGBM, N-BEATS, LSTM) i základové modely pro časové řady — a hub je složí do jedné předpovědi s 23 kvantily. Portál ji přebírá beze změny.

Sami dopočítáváme jen **pravděpodobnost překročení českého epidemického prahu**: z kvantilů se složí distribuční funkce a odečte se, kolik pravděpodobnosti leží nad prahem. Mimo rozsah předpovědi netvrdíme 0 ani 100 %, jen 1 nebo 99 %.

```
P( X ≥ práh ) = 1 − F(práh)
F = lineárně mezi sousedními kvantily
```
{{< /method-part >}}
{{< method-part title="Studie" >}}
- ECDC: *The European Respiratory Diseases Forecasting Hub (RespiCast)*; vyhodnocení sezóny 2023/24 (medRxiv 2025).
- Bracher J. a kol. (2021): *Evaluating epidemic forecasts in an interval format.* PLOS Computational Biology — skóre WIS.
- CDC FluSight: deset let vyhodnocování ukazuje, že ensemble je spolehlivější než jednotlivé modely.
{{< /method-part >}}
{{< method-part title="Jak jsme to testovali" >}}
Každou minulou předpověď pro ČR porovnáváme se skutečností a s referenčním modelem hubu („bude to jako minulý týden“), metrikou WIS — trestá široké intervaly i to, když skutečnost padne mimo ně.

{{< flu part="evaluation" />}}
{{< /method-part >}}
{{< method-part title="Omezení dat" >}}
- **Pásy jsou užší, než slibují.** Zkoušeli jsme je roztáhnout; škála z jedné sezóny se na druhou nepřenesla, proto ukazujeme původní předpověď a vedle ní její skutečnou úspěšnost.
- **Nástup vlny předpověď nevidí.** Tři týdny před začátkem epidemie 2024/25 dávala překročení prahu 1 %. Včasné varování je práce epidemického prahu a trendu, ne předpovědi.
- **Dvě sezóny historie.** Hub běží od října 2024; úspěšnost se mezi sezónami liší.
- **Zpoždění dat.** Hlášení chodí s dvoutýdenním odstupem, první dva „předpovídané“ týdny jsou ve skutečnosti odhad přítomnosti.
{{< /method-part >}}
{{< /method >}}

### Co předpověď říkala v přehrávaném týdnu

{{< flu part="replay" />}}

---

### ILI a ARI — dvě čísla z týchž ordinací

**ILI — chřipce podobné onemocnění.** Náhlý začátek, horečka nebo schvácenost a k tomu kašel či bolest v krku. Úzká definice: běžnou rýmu odfiltruje, takže křivka sleduje hlavně chřipku. Vlna ji zvedne zhruba patnáctkrát nad podzimní klid.

**ARI — akutní respirační infekce.** Stačí jeden respirační příznak. Spadá sem všechno, co se zrovna točí: rhinoviry, RSV, covid i chřipka (ILI je podmnožinou ARI). Vlna ji zvedne jen asi dvakrát, ale je to číslo, ve kterém tradičně mluví česká hygiena.

{{< flu part="chart" indicator="ari" height="300" title="Všechny akutní respirační infekce (ARI)" subtitle="ARI na 100 tis. obyvatel · stejná sezóna a týden jako nahoře · celá ČR" note="U ARI záměrně chybí pásma intenzity: chřipková vlna se v ní ztrácí v celoročním pozadí jiných virů a pásma by předstírala přesnost, kterou data nemají. Práh je orientační čára spočítaná metodou MEM — není to úřední hranice, kterou pro vyhlášení epidemie používají hygienici." >}}
{{< method inside="true" title="Proč u ARI nejsou pásma intenzity" >}}
{{< method-part title="Metoda" >}}
Stejný výpočet MEM jako u ILI. ARI je ale skoro plochá řada: i mimo vlnu nese každý týden kolem 3 % sezóny, takže metoda těžko pozná, kde epidemie začíná a končí.
{{< /method-part >}}
{{< method-part title="Jak jsme to testovali" >}}
Zpětný test po sezónách: epidemický práh u ARI zachytil jen <span data-pp-flu-val="ari.validation.sensitivity"></span> epidemických týdnů (u ILI <span data-pp-flu-val="ili.validation.sensitivity"></span>). Pod hranicí spolehlivosti, kterou jsme si stanovili předem, portál pásma nekreslí — data nesou příznak `intensity_reliable`.
{{< /method-part >}}
{{< method-part title="Omezení dat" >}}
- ARI zahrnuje všechny respirační infekce; chřipková vlna ji zvedne jen asi dvakrát.
- Práh na grafu je výsledek metody MEM, **ne úřední hranice**, podle které epidemii vyhlašují hygienici.
- Tři mírnější sezóny vyšly jako „bez epidemie“ a do odhadu nejdou.
{{< /method-part >}}
{{< /method >}}
{{< /flu >}}

### Jak dopadly minulé sezóny

{{< flu part="seasons" />}}

<p class="stat-source">
  Metoda: Moving Epidemic Method (Vega a kol. 2013, 2015) · výpočet ověřen proti referenčnímu R balíku <code>mem</code> ·
  implementace a testy v repozitáři
  <a href="https://github.com/elixir-cz-pathogens/pathogensportal-db" target="_blank">pathogensportal-db</a> ·
  laboratorní data o chřipce jsou na stránce <a href="/dashboards/influenza-surveillance/">Chřipka a respirační viry</a>
</p>
