---
title: "Nová datová vrstva a stránka Signály"
date: 2026-09-03
description: "Datová pipeline v0.2.0 přináší incidenci na 100 000 obyvatel, mapu krajů, čerstvá ebola data — a automatickou detekci anomálií nad 1 200 řadami hlášených nemocí."
highlight: true
image: "/images/cards/signals.svg"
tags: ["novinky", "detekce anomálií", "release"]
---

Portál dostal největší aktualizaci od svého spuštění. Datová pipeline vyšla ve verzi
**0.2.0** a s ní se na webu objevilo několik nových věcí:

**Signály — detekce anomálií.** Přes 1 200 časových řad hlášených infekčních nemocí
(diagnóza × kraj) teď každý běh pipeline automaticky prochází statistický systém
včasného varování metodou Farrington/Noufaily — stejnou, jakou používá britská UKHSA.
Stránka [Signály](/dashboards/signals/) ukazuje, kde jsou hlášené počty nad očekávanou
hladinou. Při zpětném testu systém zachytil pertusovou epidemii 2024 **tři měsíce
předtím, než se stala veřejným tématem**.

**Incidence místo holých počtů.** Mapy infekčních nemocí nově přepočítávají případy
na 100 000 obyvatel (jmenovatele ČSÚ) — srovnání krajů tak konečně říká něco
o epidemiologické situaci, ne o počtu obyvatel.

**Čerstvá data o ebole.** Souhrn, grafy i tabulka hodnot epidemie Bundibugyo 2026
se generují z kurátorované denní řady a aktualizují průběžně; graf trajektorií nově
srovnává rychlost růstu se šesti historickými epidemiemi na logaritmické škále.

Pod kapotou: normalizovaná databázová vrstva (PostgreSQL), archivace snímků stažených
dat a jmenovatele populace — detaily v repozitáři
[pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db).
