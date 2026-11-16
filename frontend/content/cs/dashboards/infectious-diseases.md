---
title: "Infekční nemoci — přehled"
origin: aggregated
description: "Hlášené infekční nemoci v ČR podle dat ÚZIS: vybrané diagnózy po týdnech, kraje, nejčastější diagnózy, sezónní průběh a věk."
image: "/images/cards/infectious-hub.svg"
highlight: true
tags: ["infekční nemoci", "surveillance", "ÚZIS", "kraje", "ČR"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — otevřená data ISIN (CC BY 4.0)</a> · <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">ÚZIS ČR — týdenní datový souhrn</a>'
# The yearly open export; the weekly block states its own date above its text.
update_from: "isin_monthly_trend.json"
update_read: "month"
---

{{< nav-pills group="infekcni-nemoci" active="prehled" >}}

Panel shrnuje infekční nemoci, které se v České republice povinně hlásí do **Informačního systému
infekčních nemocí (ISIN)**. Systém spravuje ÚZIS ČR. Chřipku a covid-19 najdete na samostatných
panelech, podrobný rozpad podle skupin nemocí v záložkách výše.

Většina panelu vychází z otevřených dat ISIN. Ta pokrývají všechny diagnózy po měsících od roku
2018, obnovují se ale jen jednou ročně, takže končí prosincem posledního uzavřeného roku.
{{% if-data file="isin_weekly.json" %}}Jedenáct častých diagnóz ukazuje sekce *Letos po týdnech* až do minulého týdne, z týdenního souhrnu ÚZIS.{{% /if-data %}}

{{< callout tone="warning" >}}
**Od července 2025 se část případů hlásí novým způsobem.** Systém včasného varování (EWS) posílá hlášení od lékařů, nemocnic a laboratoří do ISIN automatizovaně. U některých diagnóz tím hlášených případů skokově přibylo — u pásového oparu a boreliózy na víc než dvojnásobek. Nárůst je z velké části změna hlášení, ne vyšší nemocnost, a počty od poloviny roku 2025 proto nejde srovnávat s dřívějšími roky. V grafech je část z hlášení EWS odlišená barvou.
{{< /callout >}}

{{% if-data file="isin_weekly.json" %}}
---

### Letos po týdnech

Jedenáct často hlášených diagnóz po týdnech až do minulého týdne. Po výběru diagnózy ukážou
sloupce hlášené případy a barevně odlišenou část, která vznikla z hlášení EWS. Kde tato část
přesahuje desetinu, text počty s předchozími roky nesrovnává.

{{< isin part="weekly" note="Absolutní počty hlášených případů za kalendářní týden (pondělí až neděle), celá ČR, podle týdenního datového souhrnu ÚZIS. „Z hlášení EWS“ jsou záznamy založené na automatizovaném hlášení; jsou součástí celkového počtu, ne případy navíc. Počet hlášených případů není počet nemocných." note_age="Přepočet na obyvatele je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika. Věkové skupiny jsou různě široké, proto se neuvádí počet, ale přepočet na 100 tis. obyvatel dané skupiny." >}}
{{% /if-data %}}

---

### Kraje

Hlášené případy všech infekčních nemocí za poslední uzavřený rok. Mapa nejdřív ukazuje přepočet
na 100 tis. obyvatel kraje, protože samotné počty odrážejí hlavně to, kolik lidí v kraji žije.
Jmenovatele jsou z ČSÚ ([CC BY 4.0 podle podmínek ČSÚ](https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu));
přepočet je odvozený údaj portálu, ne oficiální statistika ČSÚ.

{{< comment src="/data/charts/isin_overview.json" block="regions" >}}

{{< region-map id="isinMap" title="Hlášené infekční nemoci podle krajů ČR" src="/data/charts/isin_regional_incidence.json" label="na 100 tis. obyvatel" unit="případů na 100 tis." note="Přepočet na populaci: hlášené případy za rok na 100 000 obyvatel kraje. Rozdíly mezi kraji můžou odrážet i to, jak důsledně se v kraji hlásí, ne jen skutečný výskyt nemocí. Přesná hodnota se zobrazí po najetí myší nebo klepnutí na kraj." alt_src="/data/charts/isin_regional_map.json" alt_label="počet případů" alt_unit="případů" alt_note="Absolutní počty hlášených případů za rok. Nepřepočteno na obyvatele — mapa z velké části kopíruje počet obyvatel kraje." >}}

---

### Nejčastější diagnózy

Deset diagnóz s nejvyšším počtem hlášených případů ve zvoleném roce. Názvy jsou zkrácené pro
čtenáře; úřední název podle MKN-10 se zobrazí po najetí myší na řádek.

{{% if-data file="isin_overview.json" %}}
{{< isin part="top" note="Absolutní roční počty hlášených případů, celá ČR, otevřená data ISIN; chřipka je vynechána. Druhá barva jsou záznamy z hlášení EWS, které se používá od července 2025: u diagnóz, kde tvoří velkou část, nelze rok 2025 srovnávat s předchozími." >}}
{{% /if-data %}}
{{% if-data file="isin_overview.json" not="true" %}}
{{< chart id="isinTopDiseases" src="/data/charts/isin_top_diseases.json" type="bar" title="10 nejčastějších infekčních nemocí — roční počty případů" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}
{{% /if-data %}}

---

### Sezónní průběh

Měsíční řady čtyř častých diagnóz ukazují sezónnost (plané neštovice vrcholí na jaře, salmonelózy
v létě) i mimořádné události — epidemie černého kašle v roce 2024 je vidět jako vrchol, který se
vymyká všem ostatním rokům. Přerušovaná čára označuje červenec 2025, odkdy část hlášení přichází
přes EWS.

{{< period-switch default="all" sticky="false" >}}

{{< chart id="isinMonthly" src="/data/charts/isin_monthly_trend.json" type="line" period="page" breaks="true" title="Sezónní průběh — měsíční počty případů" height="380"  note="Absolutní měsíční počty hlášených případů, celá ČR. Od července 2025 (přerušovaná čára) přichází část hlášení přes EWS; řady „Jiné spirochetové infekce“ (převážně borelióza) a „Plané neštovice“ od té doby nejsou srovnatelné s předchozími roky." >}}

---

### Věk

Kolik hlášených případů připadá na 100 tis. lidí stejného věku. Přepočet je tu nutný: věkové
skupiny jsou různě široké (první má jeden ročník, poslední všechny od 75 let), takže samotné
počty by srovnávaly nesrovnatelné.

{{% if-data file="isin_overview.json" %}}
{{< isin part="age" note="Všechny hlášené diagnózy kromě chřipky za poslední uzavřený rok, celá ČR. Přepočet na obyvatele je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika ČSÚ." >}}
{{% /if-data %}}
{{% if-data file="isin_overview.json" not="true" %}}
{{< chart id="isinAge" src="/data/charts/isin_age_groups.json" type="bar" title="Počet hlášených případů dle věkové skupiny (všechny roky)" height="360"  note="Absolutní počty případů za všechny roky po věkových skupinách. Nepřepočteno na velikost věkové skupiny v populaci." >}}
{{% /if-data %}}

---

### Metodika a omezení

- Data pocházejí z **ISIN** (Informační systém infekčních nemocí), povinné hlášení dle zákona č. 258/2000 Sb.
- **Otevřená data ISIN** (ÚZIS ČR, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.cs)): všechny diagnózy podle roku, měsíce, kraje, věkové skupiny a pohlaví; jeden řádek je agregovaný počet, ne jeden případ. Obnovují se jednou ročně.
- **Týdenní datový souhrn ÚZIS** „Meziroční srovnání počtu infekčních nemocí po týdnech v ČR“: jedenáct diagnóz po týdnech za posledních pět let, zvlášť záznamy založené na hlášení EWS. Souhrn licenci neuvádí, uvádí citaci (níže); portál z něj kreslí jen celostátní počty.
- **EWS** (Early Warning System) je součást ISIN pro automatizované hlášení od poskytovatelů zdravotních služeb a laboratoří. Záznamy z EWS jsou v datech od července 2025 a jejich podíl dál roste, proto se počty od té doby nesrovnávají s předchozími roky.
- Počet hlášených případů není počet nemocných: zachytí jen ty, kdo vyhledali lékaře a byli nahlášeni.
- Přepočty na 100 tis. obyvatel počítá portál z dat ČSÚ (obyvatelstvo k 31. 12.).
- Chřipka je vynechána — má vlastní podrobnější zdroj (SZÚ), viz panely o chřipce.
- Uspořádání panelu je inspirováno švýcarským [Infectious Disease Dashboard](https://www.idd.bag.admin.ch/en).

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz/data/NR-27-ISIN/NR-27-01/Otevrena-data-NR-27-01-infekcni-nemoci.csv" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/deed.cs" target="_blank">CC BY 4.0</a> ·
  Kategorie: povinné hlášení infekčních nemocí
</p>
<p class="stat-source">
  Týdenní data: Šanca O., Májek T., Davidová H., Rázková K., Klimeš D., Kubát J., Blaha M., Jarkovský J. Meziroční srovnání počtu infekčních nemocí po týdnech v ČR. Národní zdravotnický informační portál [online]. Praha: Ministerstvo zdravotnictví ČR a Ústav zdravotnických informací a statistiky ČR, 2026. Dostupné z: <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn</a>. ISSN 2695-0340. Úpravy: součty za rok a poslední čtyři týdny, podíl záznamů z hlášení EWS a přepočet věkových skupin na 100 tis. obyvatel vypočítal portál.
</p>
