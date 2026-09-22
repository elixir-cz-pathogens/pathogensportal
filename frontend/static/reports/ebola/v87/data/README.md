# Data ke grafu / Chart data

Soubor `drc-bdbv-sitrep-timeseries.csv` obsahuje kurátorovanou časovou řadu použitou na stránkách `graf-vyvoj.html` a `en/graf-vyvoj.html`. Každý řádek odkazuje na veřejný zdroj, z něhož byla hodnota převzata.

The file `drc-bdbv-sitrep-timeseries.csv` contains the curated time series used by `graf-vyvoj.html` and `en/graf-vyvoj.html`. Each row links to the public source from which the value was taken.

## Verze / Version

- verze webu / website version: v87
- revize kurace / curation review: 2026-09-22
- stav k datu posledního bodu / latest point data cut-off: 2026-09-19
- počet bodů / number of points: 106

## Sloupce / Columns

- `date`: datum, k němuž se vztahují údaje SitRepu / date represented by the SitRep data
- `sitrep_number`: číslo SitRepu INSP/COUSP / INSP/COUSP SitRep number
- `confirmed_cases_cumulative`: kumulativní potvrzené případy v DRK / cumulative confirmed cases in the DRC
- `confirmed_deaths_cumulative`: kumulativní úmrtí mezi potvrzenými případy / cumulative deaths among confirmed cases
- `new_confirmed_cases_reported`: nově hlášené potvrzené případy uvedené zdrojem / newly reported confirmed cases stated by the source
- `daily_deaths_reported`: nově hlášená úmrtí mezi potvrzenými případy, pokud zdroj uvádí srovnatelnou metriku / newly reported deaths among confirmed cases when the source states a comparable metric
- `source_url`: veřejná adresa zdroje / public source URL
- `source_data_as_of_date`: stav k datu ve zdroji / source data cut-off date
- `curation_date`: datum kurátorského zpracování nebo revize řádku / date on which the row was curated or reviewed
- `notes`: omezení a poznámky k interpretaci / interpretation notes and limitations

## Omezení / Limitations

Časová řada končí nejnovějším veřejným detailním SitRepem 128 s údaji k 19. září 2026. PDF je datováno 20. září a příloha byla na webu INSP zveřejněna 21. září. SitRepy 86–128 byly dohledány přes oficiální WordPress rozhraní INSP a každý řádek odkazuje přímo na příslušné PDF. Denní hodnoty se přebírají pouze tehdy, když je SitRep přímo uvádí; nejsou dopočítávány rozdílem kumulativních součtů.

The time series ends with the latest public detailed report, SitRep 128 with data as of 19 September 2026. The PDF is dated 20 September and the attachment was posted on the INSP website on 21 September. SitReps 86–128 were located through the official INSP WordPress interface, and each row links directly to its PDF. Daily values are used only when the SitRep states them directly; they are not reconstructed from differences between cumulative totals.

SitRep 83 přímo uvádí 80 nově potvrzených případů, 49 úmrtí a 17 uzdravení. Titulní souhrn uvádí kumulativně 1 850 úmrtí, zatímco tabulka 1 a součet provincií dávají 1 851. ECDC a následující SitRep podporují hodnotu 1 850, kterou řada používá s výslovným záznamem rozporu. SitRep 84 uvádí v klíčových sděleních 67 nově potvrzených případů a 42 úmrtí za 24 hodin; dřívější souhrnná odrážka rozlišuje 15 úmrtí mezi nově potvrzenými případy. SitRep 85 uvádí v klíčových sděleních 89 nově potvrzených případů a 29 úmrtí, z toho 21 mezi nově potvrzenými případy a dalších 8 v léčebných centrech. Denní hodnoty nejsou rekonstruovány rozdílem kumulativních součtů.

SitRep 83 directly reports 80 newly confirmed cases, 49 deaths and 17 recoveries. Its cover summary reports 1,850 cumulative deaths, while Table 1 and the provincial sum report 1,851. ECDC and the following SitRep support 1,850, which the series uses while explicitly preserving the discrepancy. SitRep 84 reports 67 newly confirmed cases and 42 deaths over 24 hours in its key messages; an earlier summary bullet distinguishes 15 deaths among newly confirmed cases. SitRep 85 reports 89 newly confirmed cases and 29 deaths in its key messages, comprising 21 deaths among newly confirmed cases and 8 further deaths in treatment centres. Daily values are not reconstructed from cumulative differences.

SitRep 86 přímo uvádí 85 nově potvrzených případů a 29 nově hlášených úmrtí a odděleně dalších 15 úmrtí v léčebných centrech; denní hodnota 44 používá tyto dvě výslovně uvedené složky. SitRepy 87–92 přímo hlásí denní dvojice případů/úmrtí 87/51, 68/50, 118/67, 100/53, 62/30 a 116/58. SitRep 89 má denní hodnotu 118 případů, zatímco kumulativní součet roste o 117 kvůli průběžné harmonizaci. SitRep 90 primárně potvrzuje první případ a úmrtí v zóně Buta v Bas-Uele. SitRep 93 přímo hlásí 101 případů, 33 komunitních úmrtí a 20 úmrtí v léčebných centrech; kumulativní součet roste o 102, protože jeden případ z Tshopo zaznamenaný 14. srpna byl v SitRepu 92 opomenut.

SitRepy 94–96 přímo uvádějí denní dvojice nově potvrzených případů a nově hlášených úmrtí 76/53, 84/42 a 103/56. U každé zprávy je denní počet úmrtí součtem výslovně uvedených komunitních úmrtí a úmrtí v léčebných centrech: 30 + 23, 29 + 13 a 35 + 21. SitRep 96 nově uvádí zónu Viadana v Bas-Uele, čímž se národní počet zasažených zdravotních zón zvýšil na 56.

SitRepy 97–100 přímo uvádějí denní dvojice 81/40, 85/41, 83/49 a 55/36. SitRep 97 současně přidal jeden retrospektivní případ v Tshopo. SitRep 99 nově uvádí zónu Mutwanga v Severním Kivu a zvyšuje národní počet zasažených zón na 57. SitRep 100 odděleně zaznamenává jeden retrospektivně doplněný případ v Haut-Uele, který není zahrnut mezi 55 nových potvrzení; proto kumulativní počet roste o 56.

SitRepy 101–103 přímo uvádějí denní dvojice 70/38, 72/35 a 57/29. U úmrtí jde o součet výslovně uvedených komunitních úmrtí a potvrzených úmrtí v léčebných centrech. SitRep 102 nově uvádí zónu Ganga v Bas-Uélé a zvyšuje národní počet zasažených zón na 58; SitRep 103 počet zón nemění.

SitRepy 104–106 přímo uvádějí denní dvojice 81/42, 69/38 a 82/38. U úmrtí jde opět o součet výslovně uvedených komunitních úmrtí a potvrzených úmrtí v léčebných centrech. SitRep 104 nově uvádí zóny Biena a Manguredjipa v Severním Kivu a zvyšuje národní počet zasažených zón na 60; SitRepy 105 a 106 počet zón nemění.

SitRepy 107–110 přímo uvádějí denní dvojice 96/49, 59/39, 86/57 a 64/32. Denní úmrtí jsou součtem výslovně uvedených komunitních úmrtí a potvrzených úmrtí v léčebných centrech: 41 + 8, 19 + 20, 43 + 14 a 25 + 7. SitRep 110 dále uvádí 30 uzdravených, 869 osob v izolaci/CTE a 89,0 % sledovaných kontaktů; všechny čtyři SitRepy ponechávají celostátní počet zasažených zón na 60.

SitRepy 111–113 přímo uvádějí denní dvojice 92/33, 94/23 a 86/39. Denní úmrtí jsou součtem výslovně uvedených komunitních úmrtí a potvrzených úmrtí v léčebných centrech: 24 + 9, 17 + 6 a 30 + 9. SitRep 113 dále uvádí 21 uzdravených, 817 osob v izolaci/CTE a 86,0 % sledovaných kontaktů. Nově uvádí Kaynu v Severním Kivu a zvyšuje celostátní počet zasažených zón z 60 na 61.

SitRep 86 directly reports 85 newly confirmed cases and 29 newly reported deaths, and separately another 15 deaths in treatment centres; the daily value of 44 uses those two explicitly stated components. SitReps 87–92 directly report daily case/death pairs of 87/51, 68/50, 118/67, 100/53, 62/30 and 116/58. SitRep 89 reports 118 daily cases while the cumulative total rises by 117 because of ongoing harmonisation. SitRep 90 provides primary confirmation of the first case and death in Buta health zone, Bas-Uele. SitRep 93 directly reports 101 cases, 33 community deaths and 20 deaths in treatment centres; the cumulative total rises by 102 because one Tshopo case recorded on 14 August had been omitted from SitRep 92.

- Denní hodnoty označují nově hlášené údaje, ne nutně datum vzniku infekce.
- Chybějící SitRepy ani chybějící denní hodnoty nejsou interpolovány nebo dopočítávány.
- U SitRepu 46 jsou denní hodnoty převzaty z veřejného přehledu ECDC a nejsou vypočteny rozdílem kumulativních bodů.
- U SitRepů 53–58 a 60 zůstávají denní úmrtí prázdná, protože zdroje neuvádějí přímo srovnatelnou metriku; některé z nich navíc obsahují vnitřně rozporné tabulkové údaje.
- SitRep 59 přímo uvádí 31 nově potvrzených případů a 10 nově hlášených úmrtí. Titulní dlaždice uvádí kumulativně 719 úmrtí, ale text, podrobné tabulky a výpočet smrtnosti shodně podporují 718; CSV používá tuto doloženou hodnotu a rozpor zaznamenává.
- Veřejná položka SitRep 63 nebyla při ověření nalezena; chybějící den není dopočítán.
- SitRep 62 podporuje hodnotu 32 úmrtí v nadpisu, textu i kumulativním součtu, přestože jedna poznámka obsahuje chybný zápis „796 + 31 = 828“. SitRep 64 podporuje 86 nových případů v nadpisu, textu a součtu provincií, přestože souhrnný řádek tabulky 2 uvádí 56. CSV používá doložené hodnoty 32 a 86 a rozpor výslovně zaznamenává.
- SitRep 66 obsahuje na straně 8 v narativní větě chybný mezisoučet 539 osob v izolaci v Ituri; záhlaví, tabulka i součet 275 + 278 podporují 553 a celkový součet 734. Veřejná řada používá pouze souhlasný celkový údaj 734.
- SitRep 68 uvádí na titulní straně a v tabulce 2 celkem 2 536 potvrzených případů; stejnou hodnotu podporují součet provincií, denní přírůstek a kontrola WHO. Souhrnný řádek tabulky 1 chybně uvádí 2 531 a následující text chybně uvádí 2 228 místo 2 248 pro Ituri. CSV používá doložených 2 536.
- U SitRepů 69–71 používá CSV pouze ověřené kumulativní součty. Denní hodnoty zůstávají prázdné, protože ECDC uvádí pro 22. červenec celkový přírůstek neslučitelný se součtem provinčního rozpisu a velká změna kumulativních hodnot zahrnuje harmonizaci a zpětné zpracování dat.
- SitRep 72 přímo uvádí 125 nově potvrzených případů a 51 potvrzených úmrtí. SitRep 73 přímo uvádí 62 nově potvrzených případů a 32 potvrzených úmrtí; u Haut-Uele obsahuje lokální rozpor 38 versus 39 potvrzených případů, proto řádek používá pouze národní součty potvrzené WHO a ECDC. SitRep 74 přímo uvádí 98 nově potvrzených případů, 50 potvrzených úmrtí a 14 uzdravení; údaj o úmrtích zahrnuje harmonizaci 11 úmrtí podle zdravotních zón v Severním Kivu. SitRep 77 přímo uvádí 73 nově potvrzených případů, ačkoli jedna narativní věta chybně píše 77; dále uvádí 24 nových potvrzených úmrtí, harmonizaci sedmi dřívějších úmrtí a 25 uzdravení. SitRep 78 přímo uvádí 69 případů, 34 úmrtí a 15 uzdravení. SitRep 79 přímo uvádí 74 případů, 36 úmrtí a 42 uzdravení; jeho narativ uvádí 49 zasažených zdravotních zón, zatímco tabulka 1 uvádí 50, a provinční rozpis uzdravených je také vnitřně rozporný. SitRep 80 uvádí 58 případů a 19 uzdravení; titulní údaj, kumulativní aritmetika a ECDC podporují 40 denních úmrtí, zatímco jedna narativní věta píše 37. Zpráva odděleně zaznamenává harmonizaci deseti dřívějších úmrtí. SitRep 81 přímo uvádí 72 případů, 44 úmrtí a 22 uzdravení; dílčí provinční text je rozporný v rozpisu úmrtí, proto řada používá doložené národní součty. SitRepy 75 a 76 nebyly veřejně dohledány a mezery nejsou dopočítány.

Daily values represent newly reported data, not necessarily the date on which infections occurred. Missing SitReps and unavailable daily metrics are not interpolated or reconstructed. Public SitRep 63 was not found. SitRep 59 directly reports 31 newly confirmed cases and 10 newly reported deaths. Its headline tile gives 719 cumulative deaths, but the prose, detailed tables and case-fatality calculation consistently support 718; the CSV uses that supported value and records the discrepancy. SitRep 62 contains an arithmetic typo in one note, while its heading, prose and total support 32 deaths; SitRep 64 contains 56 in one total row, while its heading, prose and provincial sum support 86 new cases. SitRep 66 contains a narrative typo for the Ituri isolation subtotal, while its heading, table and arithmetic support the overall total of 734. SitRep 68 contains 2,531 in one total row and 2,228 for Ituri in the following prose, while its cover, detailed table, provincial sum, daily increase and WHO cross-check support 2,536 in total and 2,248 in Ituri. For SitReps 69–71 the CSV records only verified cumulative totals; daily values remain blank because ECDC's 22 July overall increase conflicts with its provincial split and the large cumulative change includes data harmonisation and retrospective processing. SitRep 72 directly reports 125 newly confirmed cases and 51 confirmed deaths. SitRep 73 directly reports 62 newly confirmed cases and 32 confirmed deaths; its Haut-Uele provincial count is internally inconsistent at 38 versus 39, so the CSV uses only the national totals confirmed by WHO and ECDC. SitRep 74 directly reports 98 newly confirmed cases, 50 confirmed deaths and 14 recoveries; the death figure includes harmonisation of 11 deaths by health zone in North Kivu. SitRep 77 directly reports 73 newly confirmed cases although one narrative sentence says 77; it also reports 24 new confirmed deaths, harmonisation of seven earlier deaths and 25 recoveries. SitRep 78 reports 69 cases, 34 deaths and 15 recoveries. SitRep 79 reports 74 cases, 36 deaths and 42 recoveries; its narrative reports 49 affected health zones while Table 1 reports 50, and its provincial recovery breakdown is also internally inconsistent. SitRep 80 reports 58 cases and 19 recoveries; the headline figure, cumulative arithmetic and ECDC support 40 daily deaths, while one narrative sentence says 37. The report separately notes harmonisation of 10 earlier deaths. SitRep 81 directly reports 72 cases, 44 deaths and 22 recoveries; parts of the provincial narrative are inconsistent about the distribution of deaths, so the series uses supported national totals. Public SitReps 75 and 76 were not found, and their missing days are not reconstructed.

SitReps 94–96 directly report daily case/death pairs of 76/53, 84/42 and 103/56. In each report, the daily death count is the sum of explicitly reported community deaths and deaths in treatment centres: 30 + 23, 29 + 13 and 35 + 21. SitRep 96 newly lists Viadana health zone in Bas-Uele, bringing the national total to 56 affected health zones.

SitReps 97–100 directly report daily case/death pairs of 81/40, 85/41, 83/49 and 55/36. SitRep 97 also adds one retrospective Tshopo case. SitRep 99 newly lists Mutwanga health zone in North Kivu and raises the national total to 57 affected zones. SitRep 100 separately records one retrospectively added case in Haut-Uele that is not included among the 55 daily confirmations, so the cumulative total rises by 56.

SitReps 101–103 directly report daily case/death pairs of 70/38, 72/35 and 57/29. The death values sum the explicitly reported community deaths and confirmed deaths in treatment centres. SitRep 102 newly lists Ganga health zone in Bas-Uele and raises the national total to 58 affected zones; SitRep 103 leaves that total unchanged.

SitReps 104–106 directly report daily case/death pairs of 81/42, 69/38 and 82/38. The death values again sum the explicitly reported community deaths and confirmed deaths in treatment centres. SitRep 104 newly lists Biena and Manguredjipa health zones in North Kivu and raises the national total to 60 affected zones; SitReps 105 and 106 leave that total unchanged.

SitReps 107–110 directly report daily case/death pairs of 96/49, 59/39, 86/57 and 64/32. The daily death values sum the explicitly reported community deaths and confirmed deaths in treatment centres: 41 + 8, 19 + 20, 43 + 14 and 25 + 7. SitRep 110 also reports 30 recoveries, 869 people in isolation or treatment centres and 89.0% of listed contacts followed; all four SitReps leave the national total at 60 affected zones.

SitReps 111–113 directly report daily case/death pairs of 92/33, 94/23 and 86/39. The daily death values sum the explicitly reported community deaths and confirmed deaths in treatment centres: 24 + 9, 17 + 6 and 30 + 9. SitRep 113 also reports 21 recoveries, 817 people in isolation or treatment centres and 86.0% of listed contacts followed. It newly lists Kayna in North Kivu and raises the national total from 60 to 61 affected zones.

SitRepy 114–116 přímo hlásí za 5.–7. září dvojice 82/41, 82/51 a 71/41. Denní úmrtí jsou výslovné součty 32 + 9, 36 + 15 a 31 + 10. Počet zasažených zón zůstává 61. U SitRepu 115 používáme datum 6. září podle záhlaví, tabulek, WHO a ECDC; jedna souhrnná věta chybně uvádí 5. září. U SitRepu 116 nepoužíváme procento sledovaných kontaktů jako spolehlivý ukazatel: uvedených 88,3 % nesouhlasí s 21 359/24 719 (přibližně 86,4 %).

SitReps 114–116 directly report 82/41, 82/51 and 71/41 for 5–7 September. Daily deaths explicitly sum 32 + 9, 36 + 15 and 31 + 10. The number of affected zones remains 61. SitRep 115 uses 6 September in its heading and tables, corroborated by WHO and ECDC; one summary sentence incorrectly says 5 September. We do not use SitRep 116 contact follow-up as a reliable indicator: its stated 88.3% conflicts with 21,359/24,719 (approximately 86.4%).

SitRepy 117–121 přímo hlásí za 8.–12. září dvojice případů/úmrtí 86/43, 99/39, 80/49, 91/39 a 87/38. SitRep 118 má v identifikátoru chybně 10. září, ale datum hlášení i tabulky uvádějí 9. září. SitRep 119 přidává Bulu v Sud-Ubangi. SitRep 121 má rozporný ukazatel sledování kontaktů: 88,0 % na obálce, 91,3 % a 24 476/26 816 na straně 4; součet provinčních jmenovatelů je 27 816. Ukazatel není použit k hodnocení výkonu.

SitReps 117–121 directly report case/death pairs of 86/43, 99/39, 80/49, 91/39 and 87/38 for 8–12 September. SitRep 118 incorrectly gives 10 September in its identifier, but its reporting date and tables state 9 September. SitRep 119 adds Bulu in Sud-Ubangi. SitRep 121 has inconsistent contact follow-up: 88.0% on the cover, 91.3% and 24,476/26,816 on page 4; provincial denominators sum to 27,816. The indicator is not used to assess performance.

SitRepy 122–125 přímo hlásí za 13.–16. září dvojice případů/úmrtí 58/35, 87/35, 59/32 a 71/28. Denní úmrtí jsou výslovné součty komunitních úmrtí a potvrzených úmrtí v léčebných centrech: 23 + 12, 26 + 9, 16 + 16 a 18 + 10. Počet zasažených zdravotních zón zůstává 62 v sedmi provinciích.

SitReps 122–125 directly report case/death pairs of 58/35, 87/35, 59/32 and 71/28 for 13–16 September. Daily deaths explicitly sum community deaths and confirmed deaths in treatment centres: 23 + 12, 26 + 9, 16 + 16 and 18 + 10. The number of affected health zones remains 62 across seven provinces.

SitRepy 126–128 přímo hlásí za 17.–19. září dvojice případů/úmrtí 66/34, 73/37 a 58/23. Denní úmrtí jsou výslovné součty 16 + 18, 25 + 12 a 13 + 10. SitRep 127 nově uvádí příhraniční zdravotní zónu Dungu v Haut-Uélé a 63 zasažených zón; případ v Jižním Súdánu nehlásí.

SitReps 126–128 directly report case/death pairs of 66/34, 73/37 and 58/23 for 17–19 September. Daily deaths explicitly sum 16 + 18, 25 + 12 and 13 + 10. SitRep 127 newly lists border health zone Dungu in Haut-Uélé and 63 affected zones; it does not report a case in South Sudan.

## Licence / Licence

Není-li uvedeno jinak, původní kurace této datové řady a její metadata jsou zveřejněny pod licencí [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Jednotlivé zdrojové dokumenty nejsou touto licencí dotčeny a zůstávají pod podmínkami svých původních držitelů práv.

Unless stated otherwise, the original curation of this dataset and its metadata are licensed under the [Creative Commons Attribution 4.0 International licence (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Individual source documents are not covered by this licence and remain subject to the terms of their respective rights holders.
