# Data ke grafu / Chart data

Soubor `drc-bdbv-sitrep-timeseries.csv` obsahuje kurátorovanou časovou řadu použitou na stránkách `graf-vyvoj.html` a `en/graf-vyvoj.html`. Každý řádek odkazuje na veřejný zdroj, z něhož byla hodnota převzata.

The file `drc-bdbv-sitrep-timeseries.csv` contains the curated time series used by `graf-vyvoj.html` and `en/graf-vyvoj.html`. Each row links to the public source from which the value was taken.

## Verze / Version

- verze webu / website version: v52
- revize kurace / curation review: 2026-07-27
- datový řez posledního bodu / latest point data cut-off: 2026-07-24
- počet bodů / number of points: 50

## Sloupce / Columns

- `date`: datum, k němuž se vztahují údaje SitRepu / date represented by the SitRep data
- `sitrep_number`: číslo SitRepu INSP/COUSP / INSP/COUSP SitRep number
- `confirmed_cases_cumulative`: kumulativní potvrzené případy v DRK / cumulative confirmed cases in the DRC
- `confirmed_deaths_cumulative`: kumulativní úmrtí mezi potvrzenými případy / cumulative deaths among confirmed cases
- `new_confirmed_cases_reported`: nově hlášené potvrzené případy uvedené zdrojem / newly reported confirmed cases stated by the source
- `daily_deaths_reported`: úmrtí mezi nově hlášenými potvrzenými případy, pokud zdroj uvádí srovnatelnou metriku / deaths among newly reported confirmed cases when the source states a comparable metric
- `source_url`: veřejná adresa zdroje / public source URL
- `source_data_as_of_date`: datum datového řezu zdroje / source data cut-off date
- `curation_date`: datum kurátorského zpracování nebo revize řádku / date on which the row was curated or reviewed
- `notes`: omezení a poznámky k interpretaci / interpretation notes and limitations

## Omezení / Limitations

- Denní hodnoty označují nově hlášené údaje, ne nutně datum vzniku infekce.
- Chybějící SitRepy ani chybějící denní hodnoty nejsou interpolovány nebo dopočítávány.
- U SitRepu 46 jsou denní hodnoty převzaty z veřejného přehledu ECDC a nejsou vypočteny rozdílem kumulativních bodů.
- U SitRepů 53–58 a 60 zůstávají denní úmrtí prázdná, protože zdroje neuvádějí přímo srovnatelnou metriku; některé z nich navíc obsahují vnitřně rozporné tabulkové údaje.
- Veřejná položka SitRep 63 nebyla při kontrole nalezena; chybějící den není dopočítán.
- SitRep 62 podporuje hodnotu 32 úmrtí v nadpisu, textu i kumulativním součtu, přestože jedna poznámka obsahuje chybný zápis „796 + 31 = 828“. SitRep 64 podporuje 86 nových případů v nadpisu, textu a součtu provincií, přestože souhrnný řádek tabulky 2 uvádí 56. CSV používá doložené hodnoty 32 a 86 a rozpor výslovně zaznamenává.
- SitRep 66 obsahuje na straně 8 v narativní větě chybný mezisoučet 539 osob v izolaci v Ituri; záhlaví, tabulka i součet 275 + 278 podporují 553 a celkový součet 734. Veřejná řada používá pouze souhlasný celkový údaj 734.
- SitRep 68 uvádí na titulní straně a v tabulce 2 celkem 2 536 potvrzených případů; stejnou hodnotu podporují součet provincií, denní přírůstek a kontrola WHO. Souhrnný řádek tabulky 1 chybně uvádí 2 531 a následující text chybně uvádí 2 228 místo 2 248 pro Ituri. CSV používá doložených 2 536.
- U SitRepů 69–71 používá CSV pouze ověřené kumulativní součty. Denní hodnoty zůstávají prázdné, protože ECDC uvádí pro 22. červenec celkový přírůstek neslučitelný se součtem provinčního rozpisu a velká změna kumulativních hodnot zahrnuje harmonizaci a zpětné zpracování dat.

Daily values represent newly reported data, not necessarily the date on which infections occurred. Missing SitReps and unavailable daily metrics are not interpolated or reconstructed. Public SitRep 63 was not found. SitRep 62 contains an arithmetic typo in one note, while its heading, prose and total support 32 deaths; SitRep 64 contains 56 in one total row, while its heading, prose and provincial sum support 86 new cases. SitRep 66 contains a narrative typo for the Ituri isolation subtotal, while its heading, table and arithmetic support the overall total of 734. SitRep 68 contains 2,531 in one total row and 2,228 for Ituri in the following prose, while its cover, detailed table, provincial sum, daily increase and WHO cross-check support 2,536 in total and 2,248 in Ituri. For SitReps 69–71 the CSV records only verified cumulative totals; daily values remain blank because ECDC's 22 July overall increase conflicts with its provincial split and the large cumulative change includes data harmonisation and retrospective processing.

## Licence / Licence

Není-li uvedeno jinak, původní kurace této datové řady a její metadata jsou zveřejněny pod licencí [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Jednotlivé zdrojové dokumenty nejsou touto licencí dotčeny a zůstávají pod podmínkami svých původních držitelů práv.

Unless stated otherwise, the original curation of this dataset and its metadata are licensed under the [Creative Commons Attribution 4.0 International licence (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Individual source documents are not covered by this licence and remain subject to the terms of their respective rights holders.
