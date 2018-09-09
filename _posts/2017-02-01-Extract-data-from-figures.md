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

### WebPlotDigitizer
[WebPlotDigitizer](https://automeris.io/WebPlotDigitizer/)  was developed to be an easy to use, free of charge and opensource program that can work with a variety of plot types and images. 
This program is developed using HTML5 which allows it to run within a web browser and requires no installation on to the user's hard drive.


### DataThief
[DataThief III](http://datathief.org/) is writen in Java. This means, that apart from the "excutable" called `Datathief.jar`, 
one will has to have the Java Virtual Machine. To use it, the basic steps are:

1.  Load the figure includes expected data;
2.  Fix the three `location indicators` (these have an X through there center) until the vertical `quality indicator` bar turns from red to fully green. This will allow you define the axe. One can also use `log` axe with well choose axis option from `Axis menu`;
3.  Once you have defined the axes, scattered data or full curve can be obtained from `Point mode` or `Trace mode`. To extract a curve, one also need define the `start indicator`, `end indicator` and `color indicator`.

One defect of DataThief is the extraction of a line with `marker`. In this case, if the `output distance` is too small, the matched curved will go along the edge of the marker (big error if the marker is not too small).


### Engauge Digitizer
[Engauge Digitizer](http://markummitchell.github.io/engauge-digitizer/), like DataThief, works on Linux, Mac and Windows.  The process is import an image file, digitized within Engauge, 
and exported as a table of numeric data to a text file. Work can be saved into an Engauge DIG file.
