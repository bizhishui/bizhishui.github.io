---
title: Extract Data From Figures
layout: post
guid: urn:uuid:16e42ab4-3be4-4687-8946-65bfb8aa2e51
categories:
  - notes
tags:
  - Data
  - Figure
---


> This blog notes some free available softwares to extract data from a figure.


---

### DataThief
[DataThief III](http://datathief.org/) is writen in Java. This means, that apart from the "excutable" called `Datathief.jar`, 
one will has to have the Java Virtual Machine. To use it, the basic steps are:

1. Load the figure includes expected data

2. Fix the three `location indicators` (these have an X through there center) until the vertical `quality indicator` bar turns from red to fully green. This will allow you define the axe. One 
can also use `log` axe with well choose axis option from `Axis menu`

3. Once you have defined the axes, scattered data or full curve can be obtained from `Point mode` or `Trace mode`. To extract a curve, one also need define the `start indicator`, `end indicator`
and `color indicator`.

One defect of DataThief is the extraction of a line with `marker`. In this case, if the `output distance` is too small, the matched curved will go along the edge of the marker (big error if the marker is not too small).

### WebPlotDigitizer


### Engauge Digitizer
