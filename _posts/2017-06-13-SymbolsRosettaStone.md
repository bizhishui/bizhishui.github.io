---
title: Symbols Rosetta Stone
layout: post
guid: urn:uuid:5e23abaa-7fc0-465e-abae-7093c57eb61b
categories:
  - notes
tags:
  - Latex
  - Gnuplot
---


---

> Reproduced from [Mathew Peet's web](http://mathewpeet.org/lists/symbols/)

---

This page has some codes to make some symbols in html, latex and gnuplot, along with some acscii codes. After the table there is also information about how to use Italic font for variable names.

Gnuplot codes are for using enhnanced mode of postscript terminal. I usually use the setting "set terminal postscript enhanced eps" to 
also produce images in eps mode (otherwise I get problems with image rotation later when these images are inluded in latex.)


```
       html4        latex        gnuplot          ASCII   
    ------------------------------------------------------
       &alpha;     \alpha       {/Symbol a}       224     
       &beta;      \beta        {/Symbol b}       225     
       &chi;       \chi         {/Symbol c}       
       &Chi;       \Chi         {/Symbol C}       
       &delta;     \delta       {/Symbol d}       235
    ------------------------------------------------------
       &Delta;     \Delta       {/Symbol D}       
       &epsilon;   \epsilon     {/Symbol e}       238
       &Epsilon;   \Epsilon     {/Symbol E}       
       &phi;       \phi         {/Symbol f}       237
       &Phi;       \Phi         {/Symbol F}       232
    ------------------------------------------------------
       &gamma;     \gamma       {/Symbol g}       
       &Gamma;     \Gamma       {/Symbol G}       226
       &eta;       \eta         {/Symbol h}       
       &Eta;       \Eta         {/Symbol H}       
       &iota;      \iota        {/Symbol i}       
    ------------------------------------------------------
       &Iota;      \Iota        {/Symbol I}       
       &kappa;     \kappa       {/Symbol k}       
       &Kappa;     \Kappa       {/Symbol K}       
       &lambda;    \lambda      {/Symbol l}       
       &Lambda;    \Lambda      {/Symbol L}       
    ------------------------------------------------------
       &mu;        \mu          {/Symbol m}       230
       &Mu;        \Mu          {/Symbol M}       
       &nu;        \nu          {/Symbol n}       
       &Nu;        \Nu          {/Symbol N}       
       &omicron;   \omicron     {/Symbol o}       
    ------------------------------------------------------
       &Omicron;   \Omicron     {/Symbol O}       
       &pi;        \pi          {/Symbol p}       227 
       &Pi;        \Pi          {/Symbol P}      
       &theta;     \theta       {/Symbol q}       
       &Theta;     \Theta       {/Symbol Q}       233
    ------------------------------------------------------
       &rho;       \rho         {/Symbol r}       
       &Rho;       \Rho         {/Symbol R}       
       &sigma;     \sigma       {/Symbol s}       229
       &Sigma;     \Sigma       {/Symbol S}       228
       &tau;       \tau         {/Symbol t}       231
    ------------------------------------------------------
       &Tau;       \Tau         {/Symbol T}       
       &upsilon;   \upsilon     {/Symbol u}       
       &Upsilon;   \Upsilon     {/Symbol U}       
       &omega;     \omega       {/Symbol w}       
       &Omega;     \Omega       {/Symbol W}       
    ------------------------------------------------------
       &xi;        \xi          {/Symbol x}      
       &Xi;        \Xi          {/Symbol X}      
       &psi;       \psi         {/Symbol y}       
       &Psi;       \Psi         {/Symbol Y}       
       &zeta;      \zeta        {/Symbol z}       
    ------------------------------------------------------
       &Zeta;      \Zeta        {/Symbol Z}       
```

### Italic font for use as variable names
To write M in italics (gnuplot) we need {/Times-Italic M}
