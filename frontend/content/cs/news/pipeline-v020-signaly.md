---
title: "Nová datová vrstva a stránka Signály"
date: 2026-09-03
translationKey: "news-pipeline-v020"
description: "Verze 0.2.0 datového zpracování přináší incidenci na 100 000 obyvatel, mapu krajů, aktualizovaná data o ebole a automatickou detekci anomálií nad 1 200 řadami hlášených nemocí."
highlight: true
image: "/images/cards/signals.svg"
tags: ["novinky", "detekce anomálií", "release"]
---

Vyšla verze **0.2.0** datového zpracování portálu. Přináší tyto změny:

**Signály — detekce anomálií.** Přes 1 200 časových řad hlášených infekčních nemocí
(diagnóza × kraj) teď při každé aktualizaci dat automaticky prochází statistický systém
včasného varování metodou Farrington/Noufaily, kterou používá i britská UKHSA.
Stránka [Signály](/signals/) ukazuje, kde jsou hlášené počty nad očekávanou
hladinou. Při zpětném testu systém zachytil pertusovou epidemii 2024 **tři měsíce
předtím, než se stala veřejným tématem**.

**Incidence místo holých počtů.** Mapy infekčních nemocí nově přepočítávají případy
na 100 000 obyvatel (jmenovatele ČSÚ). Přepočet umožňuje srovnávat kraje nezávisle
na počtu obyvatel.

**Aktualizovaná data o ebole.** Souhrn, grafy i tabulka hodnot epidemie Bundibugyo 2026
se generují z kurátorované denní řady a aktualizují průběžně; graf trajektorií nově
srovnává rychlost růstu se šesti historickými epidemiemi na logaritmické škále.

Technické změny: normalizovaná databázová vrstva (PostgreSQL), archivace snímků stažených
dat a jmenovatele populace; podrobnosti v repozitáři
[pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db).
