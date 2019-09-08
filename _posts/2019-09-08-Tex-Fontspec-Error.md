---
title: Tex: from fontspec error
layout: post
guid: urn:uuid:06d6fd38-1a0f-44aa-a04f-05118c5bfa60
categories:
  - note
tags:
  - Tex
  - fontspec
---

Starting from a *fontspec error: "font-not-found"* with *xelatex*, this post shows how to settle this issue.


### 1. [The main tex family tree](https://www.overleaf.com/learn/latex/Articles/The_TeX_family_tree:_LaTeX,_pdfTeX,_XeTeX,_LuaTeX_and_ConTeXt)

In short, *latex* provides a higher-level language to work in than *tex*; *pdftex* supports PDF output; *xetex*, which is another modification of the underlying *tex* engine, this time to support a wider range of characters beyond just plain English numbers and letters, and to include support for modern font formats; and *luatex* is extended with the eponymous scripting language, *Lua*, which is a simple and stable language.

