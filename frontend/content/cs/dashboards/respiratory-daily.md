---
title: "Respirační infekce — denní přehled a nemocnice"
origin: aggregated
description: "Chřipka, COVID-19, RSV a akutní respirační infekce v ČR den po dni: případy hlášené lékaři, hospitalizace, příjmy na JIP a očkování podle denního reportu ÚZIS."
image: "/images/cards/flu-regional.svg"
tags: ["chřipka", "COVID-19", "RSV", "hospitalizace", "očkování", "ÚZIS", "ČR"]
data_source: '<a href="https://www.nzip.cz/data/2860-respiracni-infekce-denni-reporting-esurveillance-datovy-souhrn" target="_blank">ÚZIS ČR — Respirační infekce, denní reporting e-surveillance</a>'
# The date comes from posledni_datum in this JSON (state as of the previous day), not from here.
update_from: "esurv_summary.json"
update_read: "stamp"
---

Tento panel ukazuje respirační infekce v České republice den po dni: kolik případů chřipky,
covidu-19 a RSV hlásí lékaři, kolik lidí s nimi leží v nemocnici a kolik dávek očkování bylo
podáno. Vychází z denního reportu e-surveillance, který ÚZIS ČR vydává každé ráno se stavem
k předchozímu dni.

{{< callout tone="info" >}}
**Tato čísla nejsou totéž co nemocnost na panelech chřipky.** Tam jde o týdenní odhad z ordinací
vybraných praktických lékařů, který se srovnává s epidemickým prahem. Tady jsou automatizovaná
hlášení všech zapojených lékařů a nemocnic: jsou o týden až dva čerstvější, ale s prahem ani
s minulými sezónami se nesrovnávají.
{{< /callout >}}

{{% if-data file="esurv_summary.json" not="true" %}}
Data pro tento panel zatím nedorazila. Objeví se po prvním běhu datové pipeline, která denní
report ÚZIS stahuje.
{{% /if-data %}}

{{% if-data file="esurv_summary.json" %}}
---

{{< stat-card src="/data/charts/esurv_summary.json" >}}

{{< period-switch >}}

### Hlášené případy

Graf ukazuje součet za posledních sedm dní, ne jednotlivé dny. Hlášení mají silný týdenní rytmus,
o víkendu jich přijde zlomek, a denní čísla by ukazovala hlavně ordinační hodiny. Státní svátek
součet sedmi dní, ve kterých leží, znatelně sníží; komentář proto srovnává celé kalendářní týdny
a týden se svátkem nesrovnává. Poslední dny se u zdroje ještě doplňují.

{{< comment src="/data/charts/esurv_summary.json" block="cases" >}}

{{< chart id="esurvCases" src="/data/charts/esurv_cases.json" series="0,1,2" type="line" period="page" title="Chřipka, COVID-19 a RSV — hlášené případy za 7 dní" height="340" note="Absolutní počty: případy hlášené lékaři, součet za 7 dní končících daným dnem, celá ČR. Nepřepočteno na obyvatele." >}}

Všechny akutní respirační infekce a onemocnění podobná chřipce dohromady. Je jich řádově víc než
potvrzené chřipky, proto mají vlastní graf.

{{< chart id="esurvCasesAri" src="/data/charts/esurv_cases.json" series="3" type="line" period="page" title="ARI/ILI celkem — hlášené případy za 7 dní" height="300" note="Absolutní počty: všechna hlášení akutních respiračních infekcí a onemocnění podobných chřipce, součet za 7 dní, celá ČR." >}}

Kdo je nemocný nejčastěji: hlášené případy za posledních sedm dní v přepočtu na velikost věkové
skupiny.

{{< chart id="esurvCasesAge" src="/data/charts/esurv_cases_age.json" series="0,1,2" type="bar" title="Hlášené případy za 7 dní podle věku — na 100 000 obyvatel" height="340" note="Přepočet na 100 000 obyvatel dané věkové skupiny je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika ČSÚ." >}}

---

### Kraje

Nové případy za sedm dní na 100 tisíc obyvatel kraje, podle bydliště pacienta. Hodnoty spočítal
ÚZIS; přepínačem v záhlaví mapy zvolíte chřipku, nebo covid-19.

{{< region-map id="esurvMap" title="Hlášené případy za 7 dní na 100 000 obyvatel" src="/data/charts/esurv_map_chripka.json" label="chřipka" unit="případů na 100 tis." note="Chřipka: nové případy hlášené lékaři za posledních 7 dní na 100 000 obyvatel kraje, hodnoty ÚZIS." alt_src="/data/charts/esurv_map_covid19.json" alt_label="COVID-19" alt_unit="případů na 100 tis." alt_note="COVID-19: nové případy hlášené lékaři za posledních 7 dní na 100 000 obyvatel kraje, hodnoty ÚZIS." >}}

---

### Nemocnice

Počítá se každá hospitalizace, v jejímž průběhu byla infekce zaznamenána. Neznamená to, že
infekce byla důvodem přijetí. Počet zapojených nemocnic se v čase měnil, takže růst řady nemusí
být jen růst nemocnosti.

{{< comment src="/data/charts/esurv_summary.json" block="hospital" >}}

Kolik pacientů leželo v nemocnici ve stejný den. Je to stav, ne počet nově přijatých.

{{< chart id="esurvHosp" src="/data/charts/esurv_hosp_current.json" series="0,1,2" type="line" period="page" title="Hospitalizovaní s chřipkou, covidem-19 a RSV — stav po dnech" height="340" note="Absolutní počty současně hospitalizovaných, celá ČR." >}}

{{< chart id="esurvHospAri" src="/data/charts/esurv_hosp_current.json" series="3" type="line" period="page" title="Hospitalizovaní s ARI/ILI celkem — stav po dnech" height="280" note="Absolutní počty současně hospitalizovaných se zaznamenanou akutní respirační infekcí, celá ČR." >}}

Nově přijatí za sedm dní ukazují, jak rychle pacienti přibývají.

{{< chart id="esurvHospNew" src="/data/charts/esurv_hosp_new.json" series="0,1,2" type="line" period="page" title="Nově přijatí do nemocnice — součet za 7 dní" height="300" note="Absolutní počty nově hospitalizovaných, součet za 7 dní končících daným dnem, celá ČR." >}}

Přijetí na jednotku intenzivní péče nebo anesteziologicko-resuscitační oddělení a úmrtí během
hospitalizace jsou nízká čísla, která mezi týdny kolísají. O vývoji vypovídá delší období.

{{< chart id="esurvIcu" src="/data/charts/esurv_hosp_icu.json" series="0,1,2" type="bar" period="page" title="Nově přijatí na JIP nebo ARO — součet za 7 dní" height="280" note="Absolutní počty, součet za 7 dní končících daným dnem, celá ČR." >}}

{{< chart id="esurvDeaths" src="/data/charts/esurv_hosp_deaths.json" series="0,1,2" type="bar" period="page" title="Zemřelí za hospitalizace — součet za 7 dní" height="280" note="Absolutní počty úmrtí během hospitalizace, při které byla infekce zaznamenána; infekce nemusela být příčinou úmrtí. Součet za 7 dní, celá ČR." >}}

Nově přijatí za poslední čtyři týdny v přepočtu na velikost věkové skupiny. Nejvíc se
hospitalizují nejmenší děti a senioři.

{{< chart id="esurvHospAge" src="/data/charts/esurv_hosp_age.json" series="0,1,2" type="bar" title="Nově přijatí do nemocnice za 28 dní podle věku — na 100 000 obyvatel" height="340" note="Přepočet na 100 000 obyvatel dané věkové skupiny je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika ČSÚ." >}}

---

### Očkování

Podané dávky od začátku sezóny podle Centrální evidence očkování. Sezóna u chřipky a covidu-19
začíná 1. září, u RSV 1. října.

{{< comment src="/data/charts/esurv_summary.json" block="vaccination" >}}

{{< chart id="esurvVaxFlu" src="/data/charts/esurv_vaccination.json" series="0" type="line" title="Očkování proti chřipce — podané dávky od začátku sezóny" height="280" note="Kumulativní počet podaných dávek, celá ČR." >}}

{{< chart id="esurvVaxOther" src="/data/charts/esurv_vaccination.json" series="1,2" type="line" title="Očkování proti covidu-19 a RSV — podané dávky od začátku sezóny" height="280" note="Kumulativní počet podaných dávek, celá ČR. U RSV jde o vakcíny i o monoklonální protilátku pro kojence." >}}

Kolik dávek připadá na sto obyvatel věkové skupiny. Není to podíl očkovaných: jeden člověk může
dostat víc než jednu dávku.

{{< chart id="esurvVaxAge" src="/data/charts/esurv_vaccination_age.json" type="bar" title="Podané dávky na 100 obyvatel podle věku" height="320" note="Dávky od začátku sezóny na 100 obyvatel dané věkové skupiny; přepočet je výpočet portálu (jmenovatele ČSÚ). Očkování proti RSV má jiné věkové skupiny a v grafu není." >}}

---

### Laboratoře

Infekce potvrzené laboratořemi zapojenými do systému včasného varování, podle dne odběru
vzorku. Laboratoře hlásí jen pozitivní výsledky, podíl pozitivních testů z nich proto spočítat
nejde.

{{< chart id="esurvLab" src="/data/charts/esurv_lab.json" series="0,1,2" type="line" title="Laboratorně potvrzené infekce — součet za 7 dní" height="300" note="Absolutní počty pozitivních výsledků, součet za 7 dní končících daným dnem, celá ČR." >}}

---

### Metodika a omezení

| Ukazatel | Odkud je | Na co si dát pozor |
|---|---|---|
| Hlášené případy | automatizovaná hlášení lékařů do ISIN (systém včasného varování, EWS) | silný týdenní rytmus, svátky; poslední dny se doplňují |
| Hospitalizace, JIP a ARO, úmrtí | hlášení zapojených nemocnic do ISIN | hospitalizace s infekcí, ne nutně kvůli ní; počet zapojených nemocnic se měnil |
| Očkování | Centrální evidence očkování | dávky, ne osoby |
| Laboratorně potvrzené infekce | laboratoře zapojené do EWS | jen pozitivní výsledky; zapojena je část laboratoří |
| Kraje | hodnoty na 100 tisíc spočítané ÚZIS | podle bydliště pacienta |

Denní řady začínají 26. května 2025, hospitalizace s chřipkou 18. října 2025. S předchozími
sezónami je proto zatím není s čím srovnat. Zdroj licenci neuvádí; data portál přebírá s citací
a nezařazuje je do svého katalogu otevřených dat.

<p class="stat-source">Šanca O., Blaha M., Zelinková H., Jarkovský J., Klimeš D., Kundrát M., Krejčí J., Klika P., Mužík J., Komenda M., Dušek L. Respirační infekce – denní reporting e-surveillance. Národní zdravotnický informační portál [online]. Praha: Ministerstvo zdravotnictví ČR a Ústav zdravotnických informací a statistiky ČR, 2026. Dostupné z: <a href="https://www.nzip.cz/data/2860-respiracni-infekce-denni-reporting-esurveillance-datovy-souhrn" target="_blank">https://www.nzip.cz/data/2860-respiracni-infekce-denni-reporting-esurveillance-datovy-souhrn</a>. ISSN 2695-0340.</p>
<p class="stat-source">Úpravy portálu: sedmidenní součty z denních čísel a přepočet podle věku na obyvatele (jmenovatele ČSÚ). Reporty ÚZIS vznikají v projektu SCOPE IS, spolufinancovaném z programu EU4Health.</p>
{{% /if-data %}}
