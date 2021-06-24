---
title: Install and Use Chinese in Latex
layout: post
guid: urn:uuid:00f6f622-0d9a-427a-89c3-4d30bfe5e76b
categories:
  - notes
tags:
  - Latex
  - Fonts
  - Chinese
---

> The purpose of this post is to note the methods of installing Chinese fonts on the Unix system and their use in Latex.


### Install Chinese Fonts
First you can check what fonts are available in your system with
```
    fc-list
    fc-list :lang=zh
```

#### Basic steps
```
    # copy fonts to ~/.fonts or /usr/share/fonts on linux
    export DEST=~/.fonts
    cd $DEST
    cp /path/to/fonts/*.tt[c,f] .
    # generate fonts.scale
    mkfontscale
    # generate fonts.dir
    mkfontdir
    # set up fonts cache
    fc-cache -fsv

    # to delete fonts, just rm the ttf or ttc files, and then re-run
    fc-cache -fsv
```
