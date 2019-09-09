---
title: Tex -- from fontspec error
layout: post
guid: urn:uuid:06d6fd38-1a0f-44aa-a04f-05118c5bfa60
categories:
  - note
tags:
  - Tex
  - fontspec
---

Starting from a *fontspec error: "font-not-found"* with *xelatex*, this post shows how to settle this issue.


### [The main tex family tree](https://www.overleaf.com/learn/latex/Articles/The_TeX_family_tree:_LaTeX,_pdfTeX,_XeTeX,_LuaTeX_and_ConTeXt)

In short, *latex* provides a higher-level language to work in than *tex*, which was developed by Donald Knuth in 1977; *pdftex* supports PDF output; *xetex*, which is another modification of the underlying *tex* engine, supports a wider range of characters beyond just plain English numbers and letters, and includes support for modern font formats; and *luatex* is extended with the eponymous scripting language, *Lua*, which is a simple and stable language.


### [More on XeTex and LuaTex](https://tex.stackexchange.com/questions/36/differences-between-luatex-context-and-xetex/72#72)

Both *luatex* and *xetex* are UTF-8 engines for processing *tex* documents. This means that the input (.tex files) can contain characters that with *pdftex* are difficult to use directly. Both can also use system fonts, again in contrast to *pdftex*. However, the two are very different in approach. 

*xetex* uses system-specific libraries to work. This means that it is very easy to use 'out of the box' for loading system fonts and other UTF-8 tasks. Indeed, it was written for this purpose: supporting languages, etc., that traditional *tex* struggles with. This makes for an easy to use for end-users, particularly if you use the *fontspec* package on *latex*. However, because things between are 'farmed out' to the OS, there is a trade-off in flexibility terms.

In contrast, *luatex* has bigger aims. The idea is to add a scripting language (*Lua*) to *tex* and to open up the internals of *tex* to this language. The result is that a lot is possible, but it has to be programmed in. There is growing *latex* support for *luatex*: *fontspec* v2 supports it, and new packages are being written to use more of the new features.

### [Why LuaTex?](https://tex.stackexchange.com/questions/126206/why-choose-lualatex-over-xelatex)

*lua(la)tex* has been chosen as the official successor of *pdf(la)tex*, so you can expect more development effort to go towards it now and in the future. *lua(la)tex* doesn't rely on system-specific libraries, so in theory, you're less prone to encounter platform-specific issues or differences in output. Another advantage of *luatex* over *xetex* is that *luatex* uses the PDF engine of *pdftex*, while *xetex* uses its own one. ~~One consequence of this is, that all features of the PGF graphics package (on which TikZ builds) should be available also under *luatex*, while some features are definitely not available under *xetex*~~.


### [Switching from LaTex to LuaLaTex](http://dante.ctan.org/tex-archive/info/luatex/lualatex-doc/lualatex-doc.pdf)

For those using LaTex, to produce a document with LuaLaTex, you need to know the following differences:

- Don't load *inputenc*, just encode your source in UTF-8.
- Don't load *fontenc* nor *textcomp*, but load *fontspec*.
- *babel* works with *LuaLaTex* but you can load *polyglossia* instead.
- Don't use any package that changes the fonts, but use *fontspec*'s commands instead.

So, you only need to get familiar with *fontspec*, which is easy: select the main (serif) font with *\setmainfont*, the sans serif font with *\setsansfont* and the mono-spaced (typewriter) font with *\setmonofont*.
