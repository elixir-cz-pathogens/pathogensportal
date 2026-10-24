---
title: "Signals"
translationKey: docs-signals
description: "What a signal is, how to read the exceedance score and what to do when you see a signal."
weight: 20
---

The [Signals](/en/signals/) page automatically checks over 1,200 time series of reported infectious
diseases (diagnosis × region) and shows the months in which the reported count exceeded the
expected level.

## Month evaluated

Signals are based on open ISIN data. The month evaluated is stated on the Signals page right below
the introduction and may be many months older than the date of the last update, because the open
ISIN export is published with a delay.

## Exceedance score

**Exceedance score** = (reported − usual) / (limit of normal − usual). A value of 1 means a count
exactly at the limit of normal; the higher the score, the less likely it is to be chance. The terms
are explained in the [glossary](/en/docs/readers/glossary/).

## What a signal means

A signal is **not a confirmed outbreak**; it is a prompt for further checking. An exceedance can be
caused by a real outbreak, but also by a change in how cases are reported, late reporting of older
cases or chance: with so many series evaluated, a few random exceedances appear every month.
Look first at series with a high score and a high number of cases at the same time.

A detailed explanation of the method, the table columns and the limitations is on the
[Signals](/en/signals/) page itself.
